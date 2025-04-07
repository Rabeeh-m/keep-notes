
from fastapi import APIRouter, Depends, HTTPException, status, Body
from datetime import timedelta, datetime
from jose import JWTError, jwt
from app.utils.security import (
    get_password_hash,
    create_access_token,
    verify_password,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ALGORITHM,
)
from app.utils.database import get_db
from app.models.user import UserCreate, UserInDB
from app.schemas.token import Token, LoginSchema
from fastapi.security import OAuth2PasswordBearer
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

async def get_user(db, user_name: str):
    user = await db.users.find_one({"user_name": user_name})
    if user:
        user["user_id"] = str(user["_id"])
        del user["_id"]
        return UserInDB(**user)
    return None

async def authenticate_user(db, user_name: str, password: str):
    user = await get_user(db, user_name)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

async def authenticate_user_by_email(db, user_email: str, password: str):
    user = await db.users.find_one({"user_email": user_email})
    if not user:
        return False
    user["user_id"] = str(user["_id"])
    del user["_id"]
    user_obj = UserInDB(**user)
    if not verify_password(password, user_obj.password):
        return False
    return user_obj

async def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="/auth/token")), db=Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"user_email": user_email})
    if user is None:
        raise credentials_exception
    user["user_id"] = str(user["_id"])
    del user["_id"]
    return UserInDB(**user)

@router.post("/register", response_model=UserInDB)
async def register(user: UserCreate, db=Depends(get_db)):
    existing_user = await db.users.find_one({
        "$or": [
            {"user_name": user.user_name},
            {"user_email": user.user_email}
        ]
    })

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = {
        "_id": str(uuid.uuid4()),  # Generate UUID for user_id
        "user_name": user.user_name,
        "user_email": user.user_email,
        "password": hashed_password,
        "last_update": datetime.utcnow(),
        "create_on": datetime.utcnow()
    }
    
    await db.users.insert_one(db_user)
    created_user = await db.users.find_one({"_id": db_user["_id"]})

    created_user["user_id"] = str(created_user["_id"])
    del created_user["_id"]

    return UserInDB(**created_user)

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: LoginSchema = Body(...),
    db=Depends(get_db)
):
    user = await authenticate_user_by_email(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserInDB)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user