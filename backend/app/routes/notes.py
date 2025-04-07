# backend/routes/notes.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.database import get_db
from app.models.note import NoteCreate, NoteInDB
from app.models.user import UserInDB
from app.routes.auth import get_current_user
from datetime import datetime
import uuid

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", response_model=NoteInDB)
async def create_note(note: NoteCreate, db=Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    db_note = {
        "_id": str(uuid.uuid4()),
        "note_title": note.note_title,
        "note_content": note.note_content,
        "last_update": datetime.utcnow(),
        "created_on": datetime.utcnow(),
        "user_id": current_user.user_id
    }
    await db.notes.insert_one(db_note)
    created_note = await db.notes.find_one({"_id": db_note["_id"]})
    created_note["note_id"] = str(created_note["_id"])
    del created_note["_id"]
    return NoteInDB(**created_note)

@router.get("/", response_model=list[NoteInDB])
async def get_notes(db=Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    notes = []
    async for note in db.notes.find({"user_id": current_user.user_id}):
        note["note_id"] = str(note["_id"])
        del note["_id"]
        notes.append(NoteInDB(**note))
    return notes

@router.put("/{note_id}", response_model=NoteInDB)
async def update_note(note_id: str, note: NoteCreate, db=Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    existing_note = await db.notes.find_one({"_id": note_id, "user_id": current_user.user_id})
    if not existing_note:
        raise HTTPException(status_code=404, detail="Note not found or not authorized")
    
    updated_note = {
        "note_title": note.note_title,
        "note_content": note.note_content,
        "last_update": datetime.utcnow()
    }
    await db.notes.update_one({"_id": note_id}, {"$set": updated_note})
    updated_note_db = await db.notes.find_one({"_id": note_id})
    updated_note_db["note_id"] = str(updated_note_db["_id"])
    del updated_note_db["_id"]
    return NoteInDB(**updated_note_db)

@router.delete("/{note_id}")
async def delete_note(note_id: str, db=Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    result = await db.notes.delete_one({"_id": note_id, "user_id": current_user.user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found or not authorized")
    return {"message": "Note deleted successfully"}