from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid


class UserBase(BaseModel):
    user_email: EmailStr
    user_name: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    user_id: str
    password: str
    last_update: datetime
    create_on: datetime

    class Config:
        from_attributes = True