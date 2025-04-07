
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)

try:
    client.admin.command('ping')
    print("Connected successfully!")
except Exception as e:
    print(f"Error: {e}")
    
db = client[MONGO_DB_NAME]

def get_db():
    return db