import os

from motor.motor_asyncio import AsyncIOMotorClient


MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI must be configured before starting the API")

client = AsyncIOMotorClient(MONGO_URI)
db = client[os.getenv("MONGO_DATABASE", "missionflow")]


async def get_db():
    return db
