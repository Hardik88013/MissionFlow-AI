import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from typing import Annotated, Any

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from pydantic import BaseModel, EmailStr, Field

from backend.app.db.mongodb import get_db


router = APIRouter(prefix="/auth", tags=["Authentication"])
SESSION_COOKIE = "missionflow_session"
SESSION_SECRET = os.getenv("SESSION_SECRET")
if not SESSION_SECRET:
    raise RuntimeError("SESSION_SECRET must be configured before starting the API")


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    email: EmailStr
    name: str


def _hash_password(password: str, salt: bytes | None = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000)
    return f"{base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(digest).decode()}"


def _verify_password(password: str, encoded: str) -> bool:
    try:
        salt_text, digest_text = encoded.split("$", 1)
        salt = base64.urlsafe_b64decode(salt_text.encode())
        expected = base64.urlsafe_b64decode(digest_text.encode())
    except (ValueError, TypeError):
        return False
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 210_000)
    return hmac.compare_digest(actual, expected)


def _create_session(email: str) -> str:
    payload = json.dumps(
        {"email": email, "expires": int(time.time()) + 60 * 60 * 8},
        separators=(",", ":"),
    ).encode()
    encoded = base64.urlsafe_b64encode(payload).decode()
    signature = hmac.new(SESSION_SECRET.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    return f"{encoded}.{signature}"


def _read_session(token: str | None) -> str | None:
    if not token or "." not in token:
        return None
    encoded, signature = token.rsplit(".", 1)
    expected = hmac.new(SESSION_SECRET.encode(), encoded.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return None
    try:
        payload = json.loads(base64.urlsafe_b64decode(encoded.encode()))
    except (ValueError, TypeError, json.JSONDecodeError):
        return None
    if payload.get("expires", 0) < time.time():
        return None
    return payload.get("email")


async def current_user(
    session: Annotated[str | None, Cookie(alias=SESSION_COOKIE)] = None,
) -> dict[str, Any]:
    email = _read_session(session)
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    db = await get_db()
    user = await db.users.find_one({"email": email}, {"_id": 0, "email": 1, "name": 1})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


def _set_session(response: Response, email: str):
    response.set_cookie(
        SESSION_COOKIE,
        _create_session(email),
        httponly=True,
        samesite="lax",
        secure=os.getenv("COOKIE_SECURE", "false").lower() == "true",
        max_age=60 * 60 * 8,
    )


@router.post("/login", response_model=UserResponse)
async def login(credentials: Credentials, response: Response):
    db = await get_db()
    user = await db.users.find_one({"email": credentials.email.lower()})
    if not user or not _verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    _set_session(response, user["email"])
    return {"email": user["email"], "name": user["name"]}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(credentials: Credentials, response: Response):
    db = await get_db()
    email = credentials.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account already exists")
    user = {"email": email, "name": email.split("@", 1)[0], "password_hash": _hash_password(credentials.password)}
    await db.users.insert_one(user)
    _set_session(response, email)
    return {"email": email, "name": user["name"]}


@router.get("/me", response_model=UserResponse)
async def me(user: Annotated[dict[str, Any], Depends(current_user)]):
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE)
