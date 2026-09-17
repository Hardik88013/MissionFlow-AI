import os
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from datetime import timedelta
from bson import ObjectId

from backend.app.db.mongodb import db
from backend.app.models.user import (
    UserCreate, UserLogin, UserInDB, Token,
    ForgotPassword, ResetPassword, GoogleAuth
)
from backend.app.services.auth_service import (
    get_password_hash, verify_password, create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES, verify_google_token,
    create_reset_token, verify_reset_token
)
from backend.app.services.email_service import send_reset_password_email

router = APIRouter(prefix="/auth", tags=["authentication"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email.lower()})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_dict = user.dict()
    user_dict["email"] = user_dict["email"].lower()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["is_active"] = True
    user_dict["is_google_user"] = False
    
    result = await db.users.insert_one(user_dict)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_dict["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": user_dict["email"],
            "full_name": user_dict["full_name"]
        }
    }

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email.lower()})
    if not db_user or not db_user.get("hashed_password"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": db_user["email"],
            "full_name": db_user.get("full_name", "")
        }
    }

@router.post("/google", response_model=Token)
async def google_auth(auth: GoogleAuth):
    idinfo = verify_google_token(auth.credential)
    if not idinfo:
        raise HTTPException(status_code=401, detail="Invalid Google token")
        
    email = idinfo.get("email").lower()
    full_name = idinfo.get("name", "")
    
    db_user = await db.users.find_one({"email": email})
    
    if not db_user:
        user_dict = {
            "email": email,
            "full_name": full_name,
            "is_active": True,
            "is_google_user": True
        }
        await db.users.insert_one(user_dict)
        db_user = user_dict
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": db_user["email"],
            "full_name": db_user.get("full_name", "")
        }
    }

@router.post("/forgot-password")
async def forgot_password(req: ForgotPassword, background_tasks: BackgroundTasks):
    db_user = await db.users.find_one({"email": req.email.lower()})
    if db_user:
        token = create_reset_token(db_user["email"])
        background_tasks.add_task(send_reset_password_email, db_user["email"], token, FRONTEND_URL)
    
    return {"message": "If that email is in our system, a reset link has been sent."}

@router.post("/reset-password")
async def reset_password(req: ResetPassword):
    email = verify_reset_token(req.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    hashed_password = get_password_hash(req.new_password)
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to reset password")
        
    return {"message": "Password has been reset successfully"}
