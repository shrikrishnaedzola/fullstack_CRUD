import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException

from database import get_connection, init_db

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class ItemCreate(BaseModel):
    name: str


@app.get("/")
def home():
    return {"message":"API is running..."}

@app.get("/items")
def get_item():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM items")
    items = cursor.fetchall()
    cursor.close()
    conn.close()
    return items


@app.post("/items")
def add_item(item: ItemCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO items (name) VALUES (%s)",
        (item.name,)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return {"id": new_id, "name": item.name}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: ItemCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM items WHERE id = %s", (item_id,))
    if cursor.fetchone() is None:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")

    cursor.execute(
        "UPDATE items SET name = %s WHERE id = %s",
        (item.name, item_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"id": item_id, "name": item.name}


@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM items WHERE id = %s", (item_id,))
    if cursor.fetchone() is None:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Item not found")

    cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Item deleted successfully"}
