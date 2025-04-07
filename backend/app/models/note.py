# backend/models/note.py
from pydantic import BaseModel
from datetime import datetime
import uuid

class NoteBase(BaseModel):
    note_title: str
    note_content: str

class NoteCreate(NoteBase):
    pass

class NoteInDB(NoteBase):
    note_id: str
    last_update: datetime
    created_on: datetime
    user_id: str

    class Config:
        from_attributes = True