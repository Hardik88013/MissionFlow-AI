import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr

MAIL_USERNAME = os.getenv("MAIL_USERNAME", "dummy@example.com")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "dummy")
MAIL_FROM = os.getenv("MAIL_FROM", "noreply@missionflow.ai")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_reset_password_email(email: EmailStr, token: str, frontend_url: str):
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    html = f"""
    <p>Hi there,</p>
    <p>You requested to reset your password. Click the link below to set a new password:</p>
    <p><a href="{reset_link}">Reset Password</a></p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thanks,<br>MissionFlow AI Team</p>
    """

    message = MessageSchema(
        subject="MissionFlow AI - Password Reset",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
