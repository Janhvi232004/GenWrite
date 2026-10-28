"""
app.py
======
GenWrite AI - Flask backend.

Endpoints
---------
GET    /              -> health check
POST   /generate      -> generate content with AI and save it
GET    /history       -> list saved content (optional ?q=search)
DELETE /delete/<id>   -> delete one history item

Run with:  python backend/app.py
"""

import os
import sqlite3
from contextlib import closing
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request

from ai_service import CONTENT_TYPES, TONES, AIServiceError, generate_content

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

# Load NVIDIA_API_KEY etc. from GenWrite_AI/.env
load_dotenv(os.path.join(ROOT_DIR, ".env"))

DB_DIR = os.path.join(ROOT_DIR, "database")
DB_PATH = os.path.join(DB_DIR, "content.db")
MAX_TOPIC_LENGTH = 500

app = Flask(__name__)


# ---------------------------------------------------------------------------
# Database helpers (plain sqlite3 - no ORM, easy to explain in a viva)
# ---------------------------------------------------------------------------
def get_connection():
    """Open a connection that returns rows we can turn into dictionaries."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the database folder and the `history` table if missing."""
    os.makedirs(DB_DIR, exist_ok=True)
    with closing(get_connection()) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS history (
                id                INTEGER PRIMARY KEY AUTOINCREMENT,
                topic             TEXT NOT NULL,
                content_type      TEXT NOT NULL,
                tone              TEXT NOT NULL,
                generated_content TEXT NOT NULL,
                created_at        TEXT NOT NULL
            )
            """
        )
        conn.commit()


def row_to_dict(row):
    return {key: row[key] for key in row.keys()}


# ---------------------------------------------------------------------------
# CORS - lets the React dev server (localhost:5173) call this API
# ---------------------------------------------------------------------------
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
    return response


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/", methods=["GET"])
def index():
    """Simple health check so you can confirm the server is running."""
    return jsonify(
        {
            "name": "GenWrite AI API",
            "status": "running",
            "content_types": CONTENT_TYPES,
            "tones": TONES,
        }
    )


@app.route("/generate", methods=["POST"])
def generate():
    """Validate input -> call the AI -> save to SQLite -> return the record."""
    data = request.get_json(silent=True) or {}

    topic = str(data.get("topic", "")).strip()
    content_type = str(data.get("content_type", "")).strip()
    tone = str(data.get("tone", "")).strip()

    # --- validation ---
    if len(topic) < 3:
        return jsonify({"error": "Please enter a topic (at least 3 characters)."}), 400
    if len(topic) > MAX_TOPIC_LENGTH:
        return jsonify({"error": f"Topic is too long (max {MAX_TOPIC_LENGTH} characters)."}), 400
    if content_type not in CONTENT_TYPES:
        return jsonify({"error": f"content_type must be one of: {', '.join(CONTENT_TYPES)}."}), 400
    if tone not in TONES:
        return jsonify({"error": f"tone must be one of: {', '.join(TONES)}."}), 400

    # --- AI generation ---
    try:
        content = generate_content(topic, content_type, tone)
    except AIServiceError as error:
        return jsonify({"error": str(error)}), error.status_code

    # --- save to database ---
    created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with closing(get_connection()) as conn:
        cursor = conn.execute(
            """
            INSERT INTO history (topic, content_type, tone, generated_content, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (topic, content_type, tone, content, created_at),
        )
        conn.commit()
        new_id = cursor.lastrowid

    return (
        jsonify(
            {
                "id": new_id,
                "topic": topic,
                "content_type": content_type,
                "tone": tone,
                "generated_content": content,
                "created_at": created_at,
            }
        ),
        201,
    )


@app.route("/history", methods=["GET"])
def history():
    """Return all saved content, newest first. Optional ?q= text search."""
    query = request.args.get("q", "").strip()

    sql = "SELECT * FROM history"
    params = ()
    if query:
        like = f"%{query}%"
        sql += " WHERE topic LIKE ? OR content_type LIKE ? OR tone LIKE ? OR generated_content LIKE ?"
        params = (like, like, like, like)
    sql += " ORDER BY id DESC"

    with closing(get_connection()) as conn:
        rows = conn.execute(sql, params).fetchall()

    return jsonify([row_to_dict(row) for row in rows])


@app.route("/delete/<int:item_id>", methods=["DELETE"])
def delete(item_id):
    """Delete one history item by its id."""
    with closing(get_connection()) as conn:
        cursor = conn.execute("DELETE FROM history WHERE id = ?", (item_id,))
        conn.commit()
        deleted = cursor.rowcount

    if deleted == 0:
        return jsonify({"error": "Item not found."}), 404
    return jsonify({"message": "Deleted successfully.", "id": item_id})


# ---------------------------------------------------------------------------
# Error handlers - always answer with JSON, never an HTML error page
# ---------------------------------------------------------------------------
@app.errorhandler(404)
def not_found(_error):
    return jsonify({"error": "Route not found."}), 404


@app.errorhandler(405)
def method_not_allowed(_error):
    return jsonify({"error": "Method not allowed."}), 405


@app.errorhandler(500)
def server_error(_error):
    return jsonify({"error": "Something went wrong on the server."}), 500


# Create the table when the app starts (works with `flask run` too).
init_db()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
