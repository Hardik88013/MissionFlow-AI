import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://mehtahardik88013_db_user:MissionFlowAi@adityawellness.esye8g8.mongodb.net/?appName=adityawellness")
client = AsyncIOMotorClient(MONGO_URI)
db = client.missionflow

async def get_db():
    return db
