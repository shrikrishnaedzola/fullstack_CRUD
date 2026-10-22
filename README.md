# Fullstack Item Manager

A fullstack CRUD application — a **FastAPI** (Python) backend connected to a **MySQL** database, paired with a plain HTML/CSS/JS frontend.

---

## Project Structure

```
fullstack/
├── backend/
│   ├── main.py            ← FastAPI app & all API routes
│   ├── database.py        ← MySQL connection & table setup
│   ├── requirements.txt   ← Python dependencies
│   ├── .env               ← Local secrets (not committed)
│   └── .env.example       ← Template for environment variables
├── frontend/
│   ├── index.html         ← Main page
│   ├── style.css          ← Styles (including Edit/Delete buttons)
│   └── script.js          ← Full CRUD API calls & DOM logic
├── .gitignore
└── README.md
```

---

## Requirements

- Python 3.10+
- MySQL 8+ (running locally or remotely)
- A modern browser (for the frontend)

---

## Backend Setup

### 1. Create & activate a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Configure environment variables

```bash
# Windows
copy backend\.env.example backend\.env

# macOS / Linux
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
ALLOWED_ORIGINS=http://127.0.0.1:5500
```

### 4. Start the server

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000**

---

## API Endpoints

| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| GET    | `/`                | Health check             |
| GET    | `/items`           | List all items           |
| POST   | `/items`           | Create a new item        |
| PUT    | `/items/{item_id}` | Update an existing item  |
| DELETE | `/items/{item_id}` | Delete an item           |

### Examples

**Create an item**
```bash
curl -X POST http://127.0.0.1:8000/items \
     -H "Content-Type: application/json" \
     -d "{\"name\": \"My first item\"}"
```

**Update an item**
```bash
curl -X PUT http://127.0.0.1:8000/items/1 \
     -H "Content-Type: application/json" \
     -d "{\"name\": \"Updated name\"}"
```

**Delete an item**
```bash
curl -X DELETE http://127.0.0.1:8000/items/1
```

> Endpoints that target a non-existent `item_id` return **404 Not Found**.

---

## Frontend Setup

Open `frontend/index.html` directly in your browser, or serve it with a static file server:

```bash
# From the project root
python -m http.server 5500 --directory frontend
```

Then visit **http://localhost:5500**

The frontend supports:
- **Add** — type a name and click Add
- **Edit** — click the Edit button next to an item (uses a prompt dialog)
- **Delete** — click the Delete button next to an item (asks for confirmation)

> Make sure `ALLOWED_ORIGINS` in your `.env` matches the URL you open the frontend from.

---

## Environment Variables

| Variable          | Example              | Description                                    |
|-------------------|----------------------|------------------------------------------------|
| `DB_HOST`         | `localhost`          | MySQL server host                              |
| `DB_PORT`         | `3306`               | MySQL server port                              |
| `DB_USER`         | `root`               | MySQL username                                 |
| `DB_PASSWORD`     | `secret`             | MySQL password                                 |
| `DB_NAME`         | `itemsdb`            | MySQL database name                            |
| `ALLOWED_ORIGINS` | `http://127.0.0.1:5500` | Comma-separated list of allowed CORS origins |

---

## Git — What Is Ignored

- `venv/` — virtual environment
- `.env` — local secrets
- `*.db` / `*.sqlite` — database files
- `__pycache__/` — Python bytecode
- OS & editor files (`.DS_Store`, `.vscode/`, etc.)
