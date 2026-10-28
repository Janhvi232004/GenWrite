# GenWrite AI

> **Generate exceptional content with AI in seconds.**

GenWrite AI is a premium AI content generator. Enter a **topic**, pick a **content type** and a **tone**, and get high-quality blogs, LinkedIn posts, Instagram captions, product descriptions or emails, written by the **NVIDIA Nemotron** model through the **NVIDIA NIM API**.

It pairs a futuristic React interface (glassmorphism, aurora gradients, a floating AI orb, particle background) with a deliberately **simple Flask + SQLite backend**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Folder Structure](#folder-structure)
5. [Installation](#installation)
6. [Running Guide](#running-guide)
7. [API Reference](#api-reference)
8. [How It Works](#how-it-works-viva-notes)
9. [Screenshots](#screenshots)
10. [Troubleshooting](#troubleshooting)
11. [Future Scope](#future-scope)

---

## Project Overview

| | |
|---|---|
| **Problem** | Writing marketing and social content is slow and repetitive. |
| **Solution** | A single workspace that turns a topic into ready-to-publish content in seconds. |
| **AI model** | `nvidia/nemotron-3.5-lightning-30b-a3b` via NVIDIA NIM (no OpenAI) |
| **Data flow** | User input → Flask API → NVIDIA NIM → Nemotron → SQLite → React UI |

---

## Features

**AI & content**
- AI content generation from topic + content type + tone
- 5 content types: Blog, LinkedIn Post, Instagram Caption, Product Description, Email
- 5 tones: Professional, Casual, Friendly, Creative, Marketing
- Regenerate with one click (same inputs, fresh output)
- Live word count and character count
- Copy to clipboard and download as `.txt`

**History**
- Every generation is saved automatically to SQLite
- Dedicated History page with search, content-type filter, view modal and delete (with confirm step)
- "Use again" re-opens a saved item in the workspace

**Dashboard**
- Animated counters: Total Generations, Words Generated, Saved Content, Recent Activity

**Premium UI / UX**
- Landing page with animated hero, particle network, aurora gradients, floating shapes and a floating AI orb
- Glassmorphism cards with neon borders and a cursor-following spotlight
- Mouse glow that trails the cursor
- Typewriter output, AI "thinking" loader (orb, rotating status, typing dots, progress bar, skeletons)
- Smooth page transitions, scroll-reveal animations, toast notifications
- Beautiful empty states and error states
- Dark mode (default) and light mode with a smooth theme transition
- Fully responsive (mobile, tablet, laptop, desktop) with no horizontal scrolling
- Keyboard-accessible custom dropdowns, reduced-motion support

---

## Technologies Used

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router |
| UI primitives | ShadCN-style components (`class-variance-authority`, `clsx`, `tailwind-merge`) |
| Backend | Python, Flask, Requests, python-dotenv |
| Database | SQLite (Python's built-in `sqlite3`) |
| AI | NVIDIA NIM API, model `nvidia/nemotron-3.5-lightning-30b-a3b` |

---

## Folder Structure

```
GenWrite_AI/
├── backend/
│   ├── app.py               # Flask app: routes, validation, SQLite
│   └── ai_service.py        # All AI logic (prompt + NVIDIA NIM call)
├── database/
│   └── content.db           # SQLite file (created automatically)
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── components.json      # ShadCN config
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.jsx         # Entry point
│       ├── App.jsx          # Layout, routes, page transitions
│       ├── index.css        # Theme tokens, glass, aurora, animations
│       ├── components/
│       │   ├── ui/button.jsx            # ShadCN-style button
│       │   ├── landing/                 # Hero, Marquee, Features, HowItWorks, Showcase, CTA
│       │   ├── Background.jsx           # Aurora + particles + shapes
│       │   ├── ParticleField.jsx        # Canvas particle network
│       │   ├── FloatingShapes.jsx
│       │   ├── MouseGlow.jsx
│       │   ├── AIOrb.jsx / FloatingOrb.jsx
│       │   ├── Navbar.jsx / Footer.jsx / Logo.jsx / ThemeToggle.jsx
│       │   ├── GlassCard.jsx / Reveal.jsx / Toaster.jsx
│       │   ├── GeneratorCard.jsx / CustomSelect.jsx
│       │   ├── LoadingState.jsx / OutputCard.jsx / MarkdownText.jsx
│       │   ├── StatsGrid.jsx / AnimatedNumber.jsx
│       │   ├── HistoryCard.jsx / ViewModal.jsx / EmptyState.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Workspace.jsx            # Dashboard + generator + output
│       │   └── History.jsx
│       ├── hooks/
│       │   ├── useTheme.js / useHistory.js / useStats.js
│       │   ├── useTypewriter.js / useToast.js
│       ├── services/
│       │   └── api.js                   # The only file that calls the backend
│       └── lib/
│           ├── utils.js                 # cn(), word count, download, copy, dates
│           └── constants.js             # Content types and tones
├── public/
├── .env.example
├── requirements.txt
└── README.md
```

---

## Installation

### Prerequisites
- **Python 3.9+**
- **Node.js 18+** (with npm)
- A free **NVIDIA NIM API key** from <https://build.nvidia.com>

### 1. Backend

```bash
cd GenWrite_AI

# (recommended) create a virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

Create your environment file:

```bash
cp .env.example .env              # Windows: copy .env.example .env
```

Open `.env` and paste your key:

```
NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxxxxxxxxx
```

### 2. Frontend

```bash
cd frontend
npm install
```

---

## Running Guide

Use **two terminals**.

**Terminal 1: backend** (runs on <http://127.0.0.1:5000>)

```bash
cd GenWrite_AI
python backend/app.py
```

**Terminal 2: frontend** (runs on <http://localhost:5173>)

```bash
cd GenWrite_AI/frontend
npm run dev
```

Open **<http://localhost:5173>**, click **Start Generating**, and create your first piece of content.

To check the backend on its own, open <http://127.0.0.1:5000/>. You should see `{"status": "running", ...}`.

**Production build of the frontend**

```bash
cd frontend
npm run build      # outputs to frontend/dist
npm run preview
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/generate` | Generate content and save it |
| `GET` | `/history` | List saved content (newest first). Optional `?q=` search |
| `DELETE` | `/delete/<id>` | Delete one item |

**POST `/generate`**

```json
{ "topic": "Benefits of remote work", "content_type": "LinkedIn Post", "tone": "Professional" }
```

Returns `201`:

```json
{
  "id": 1,
  "topic": "Benefits of remote work",
  "content_type": "LinkedIn Post",
  "tone": "Professional",
  "generated_content": "...",
  "created_at": "2026-10-28T18:11:30+00:00"
}
```

Errors always return JSON: `{ "error": "message" }` with status `400` (bad input), `429` (rate limit), `500`/`502`/`503`/`504` (server or AI problems).

**Database table `history`**

| Column | Type |
|---|---|
| id | INTEGER, primary key |
| topic | TEXT |
| content_type | TEXT |
| tone | TEXT |
| generated_content | TEXT |
| created_at | TEXT (ISO 8601, UTC) |

---

## How It Works (Viva Notes)

1. **User input**: the React form sends `topic`, `content_type`, `tone` to `POST /generate` (via `services/api.js`).
2. **Flask API** (`app.py`) validates the input against the allowed lists.
3. **AI service** (`ai_service.py`) fills the prompt template and calls the NVIDIA NIM chat-completions endpoint with the Nemotron model.
4. **Storage**: the result is saved to the SQLite `history` table with a timestamp.
5. **Frontend display**: the record is returned to React, which shows it with a typewriter effect, updates the dashboard stats, and adds it to History.

**Design decisions worth mentioning**
- *Separation of concerns*: AI logic is isolated in `ai_service.py`, so the model can be swapped without touching routes. The model name can also be changed with `NVIDIA_MODEL` in `.env`.
- *Simple backend*: plain `sqlite3` with four routes, with no ORM or authentication to explain.
- *Single API layer on the frontend*: components never call `fetch` directly.
- *Theme system*: colours are CSS variables (`--bg`, `--fg`), so light and dark mode need no duplicated component styles.
- *Dashboard stats* are computed in the browser from the history list. "Total Generations" is a lifetime counter (kept in `localStorage`), so it doesn't drop when you delete items; "Saved Content" is what is currently in the library.

---

## Screenshots

> Add your screenshots to a `docs/screenshots/` folder and link them here.

| Landing page | Workspace |
|---|---|
| `![Landing](docs/screenshots/landing.png)` | `![Workspace](docs/screenshots/workspace.png)` |

| History | Light mode |
|---|---|
| `![History](docs/screenshots/history.png)` | `![Light](docs/screenshots/light.png)` |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| *"Cannot reach the GenWrite server"* | Start the backend: `python backend/app.py` (port 5000). |
| *"NVIDIA_API_KEY is not set"* | Create `.env` from `.env.example` in the **project root** (next to `requirements.txt`), add your key, restart Flask. |
| *"The NVIDIA API key was rejected"* | Check the key at build.nvidia.com and that it has no extra spaces or quotes. |
| *Model not found / 404-style errors* | Confirm the exact model ID on build.nvidia.com and set `NVIDIA_MODEL` in `.env`. |
| Backend on a different port | Create `frontend/.env` with `VITE_API_URL=http://127.0.0.1:YOUR_PORT`. |
| `pip` / `npm` command not found | Install Python and Node.js, then reopen the terminal. |

---

## Future Scope

- User accounts and authentication (JWT) with per-user history
- Streaming responses (token-by-token output)
- Favourites, folders and tags for saved content
- Export to PDF / DOCX and one-click publish to LinkedIn / Instagram
- More content types (ad copy, YouTube scripts, SEO meta tags) and multi-language output
- Brand-voice presets and prompt templates
- Usage analytics charts and team workspaces
- Deployment with Docker, Gunicorn and a PostgreSQL database

---

*Built with React, Flask and NVIDIA NIM.*
