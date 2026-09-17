import os
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from datetime import timedelta
from bson import ObjectId

from backend.app.db.mongodb import db
from backend.app.models.user import (
    UserCreate, UserLogin, UserInDB, Token,
    ForgotPassword, ResetPassword
)
from backend.app.services.auth_service import (
    get_password_hash, verify_password, create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_reset_token, verify_reset_token
)
from backend.app.services.email_service import send_reset_password_email

router = APIRouter(prefix="/auth", tags=["authentication"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://missionflowai.vercel.app")

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    email_str = str(user.email).lower()
    existing_user = await db.users.find_one({"email": email_str})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_dict = user.dict() if hasattr(user, "dict") else user.model_dump()
    user_dict["email"] = email_str
    user_dict["full_name"] = str(user_dict.get("full_name", ""))
    
    raw_password = user_dict.pop("password")
    user_dict["hashed_password"] = get_password_hash(raw_password)
    user_dict["is_active"] = True
    user_dict["is_google_user"] = False
    
    # Safely insert to db
    try:
        result = await db.users.insert_one(user_dict)
    except Exception as e:
        print("DB Insert Error:", e)
        raise HTTPException(status_code=500, detail="Database insertion failed")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email_str}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": email_str,
            "full_name": user_dict["full_name"]
        }
    }

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    email_str = str(user.email).lower()
    db_user = await db.users.find_one({"email": email_str})
    
    if not db_user or not db_user.get("hashed_password"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email_str}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": email_str,
            "full_name": str(db_user.get("full_name", ""))
        }
    }

@router.post("/forgot-password")
async def forgot_password(req: ForgotPassword, background_tasks: BackgroundTasks):
    email_str = str(req.email).lower()
    db_user = await db.users.find_one({"email": email_str})
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found with this email address")
        
    token = create_reset_token(email_str)
    
    # Send email synchronously to catch SMTP errors during testing
    try:
        success = await send_reset_password_email(email_str, token, FRONTEND_URL)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to send email. Check SMTP server configuration or App Password.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SMTP Error: {str(e)}")
    
    return {"message": "Reset link has been sent to your email successfully"}

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
