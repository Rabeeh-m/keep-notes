# Keep Notes Application

A full-stack notes taking application built with FastAPI (Python) backend and Next.js (TypeScript) frontend, featuring user authentication, rich text editing, and MongoDB storage.

## Features

- **User Authentication**: Secure JWT-based login/registration
- **Rich Text Notes**: Create and edit notes with formatting options
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Tech Stack**: 
  - FastAPI backend with MongoDB
  - Next.js frontend with TypeScript
  - Redux for state management
  - TipTap rich text editor

## Tech Stack

### Backend
- **Python** with FastAPI framework
- **MongoDB** database with Motor async driver
- **JWT** authentication
- **Pydantic** for data validation
- **Uvicorn** ASGI server

### Frontend
- **Next.js** (React framework)
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **TipTap** rich text editor
- **Axios** for API calls
- **Framer Motion** for animations

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v16 or later)
- Python (3.8 or later)
- MongoDB (local or Atlas cluster)
- Git

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/notes-app.git
   cd notes-app/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a .env file in the backend directory with:
   ```bash
   MONGO_URI=mongodb://localhost:27017  # or your MongoDB Atlas URI
   MONGO_DB_NAME=notes_app
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
3. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env.local file in the frontend directory with:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
  ```bash
   keep-notes/
    ├── backend/
    │   ├── app/
    │   │   ├── main.py            # FastAPI application setup
    │   │   ├── models/             # Pydantic models
    │   │   ├── routes/             # API endpoints
    │   │   ├── schemas/            # Request/response schemas
    │   │   ├── utils/              # Utility functions
    │   ├── requirements.txt        # Python dependencies
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── app/                # Next.js pages
    │   │   ├── components/         # React components
    │   │   ├── context/            # Auth context
    │   │   ├── store/              # Redux store
    │   │   ├── utils/              # Utility functions
    │   ├── public/                 # Static assets
    │   ├── package.json            # Frontend dependencies
   ```

## API Endpoints Reference

### Authentication

| Method | Endpoint            | Description                      | Request Body                                                                 | Success Response                                                                 | Authentication Required |
|--------|---------------------|----------------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------|-------------------------|
| POST   | `/auth/register`    | Register a new user              | `{ "user_name": "string", "user_email": "string", "password": "string" }`    | `{ "user_id": "string", "user_name": "string", "user_email": "string", ... }`    | No                      |
| POST   | `/auth/token`       | Login and get access token       | `{ "email": "string", "password": "string" }`                                | `{ "access_token": "string", "token_type": "bearer" }`                           | No                      |
| GET    | `/auth/me`          | Get current user details         | -                                                                            | `{ "user_id": "string", "user_name": "string", "user_email": "string", ... }`    | Yes (Bearer Token)      |

### Notes

| Method | Endpoint            | Description                      | Request Body                                                                 | Success Response                                                                 | Parameters              |
|--------|---------------------|----------------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------|-------------------------|
| GET    | `/notes/`           | Get all user's notes             | -                                                                            | `[{ "note_id": "string", "note_title": "string", "note_content": "string", ... }]`| Requires Auth          |
| POST   | `/notes/`           | Create a new note                | `{ "note_title": "string", "note_content": "string" }`                       | `{ "note_id": "string", "note_title": "string", "note_content": "string", ... }`  | Requires Auth          |
| PUT    | `/notes/{note_id}`  | Update a specific note           | `{ "note_title": "string", "note_content": "string" }`                       | `{ "note_id": "string", "note_title": "string", "note_content": "string", ... }`  | Requires Auth + Ownership|
| DELETE | `/notes/{note_id}`  | Delete a specific note           | -                                                                            | `{ "message": "Note deleted successfully" }`                                      | Requires Auth + Ownership|
