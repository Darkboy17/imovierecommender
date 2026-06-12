# iMovie Recommender

[Live Demo](https://imovierecommender.vercel.app)

iMovie Recommender is a full-stack movie recommendation app. Users create an account, search a local movie catalogue, rate films they already know, and receive a personalized watchlist backed by a FastAPI recommendation service.

The project is split into a Next.js frontend and a Python backend:

- `frontend/` contains the authenticated web app, movie search UI, poster carousel, settings modal, local session storage, and API client.
- `backend/` contains the FastAPI app, JWT authentication, MongoDB persistence, poster serving, and item-similarity recommendation logic.

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [API Reference](#api-reference)
- [Data and Model Assets](#data-and-model-assets)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- Account registration and sign-in with JWT access and refresh tokens.
- Protected recommendation workflow. Users must be signed in before requesting recommendations.
- Client-side movie search across the movie catalogue.
- Star-based ratings that shape the recommendation payload.
- Recommended movie cards with poster artwork when available.
- Poster carousel for browsing the available library.
- Configurable recommendation count from the settings modal.
- Local persistence for selected ratings, recommendation settings, and auth session.
- FastAPI backend with CORS configuration for local and deployed frontends.
- MongoDB-backed user storage with unique email indexes.
- Static poster serving from the backend.
- Dockerfile and PowerShell deployment helper for backend hosting.

## How It Works

1. A user registers or signs in from the frontend.
2. The backend validates credentials, stores user data in MongoDB, and returns an access token plus a refresh token.
3. The user searches the catalogue and rates movies from 1 to 5 stars.
4. The frontend sends the rated movies to `POST /recommendations/` with a bearer token.
5. The backend looks up each rated title in `static/item_similarity_df.csv`.
6. Similarity scores are weighted by rating using `rating - 2.5`, combined, sorted, and filtered so already-rated titles are not returned.
7. The backend returns recommended movie titles and poster URLs.
8. The frontend renders the personalized recommendations and stores the user's selected movies locally.

## Architecture

```text
Browser
  |
  | Next.js app on http://localhost:3000
  v
Frontend
  - Auth pages and protected app shell
  - Movie search from frontend/src/app/movies.json
  - Local token and preference storage
  - API calls through NEXT_PUBLIC_API_BASE_URL
  |
  | REST requests with JWT bearer token
  v
FastAPI backend on http://localhost:8000
  - /auth routes for register, login, refresh, logout, current user
  - /recommendations/ for personalized results
  - /movie-posters/ and /movie-posters-ids/ for poster URLs
  - /posters static file mount
  |
  +--> MongoDB for users and refresh token hashes
  +--> backend/movies.json for title and movie ID lookup
  +--> backend/static/item_similarity_df.csv for recommendation scores
  +--> backend/posters/*.jpg for poster artwork
```

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Icons
- Shepherd.js for guided tours
- Swiper, React Slick, and Slick Carousel dependencies for carousel-style UI

### Backend

- Python 3.10+
- FastAPI
- Uvicorn
- Pydantic and pydantic-settings
- Motor and PyMongo for MongoDB
- PyJWT for token handling
- bcrypt for password hashing
- pandas, NumPy, SciPy, scikit-learn, and torch for data/recommendation support
- Docker for containerized backend deployment

## Repository Structure

```text
.
|-- README.md
|-- backend/
|   |-- main.py
|   |-- Dockerfile
|   |-- deploy-backend.ps1
|   |-- .env.example
|   |-- movies.json
|   |-- posters/
|   |-- static/
|   |   `-- item_similarity_df.csv
|   |-- database/
|   |   `-- mongodb.py
|   |-- routes/
|   |   |-- auth.py
|   |   |-- health.py
|   |   |-- posters.py
|   |   `-- recommendations.py
|   |-- schemas/
|   |-- services/
|   `-- utils/
`-- frontend/
    |-- package.json
    |-- package-lock.json
    |-- next.config.mjs
    |-- tailwind.config.mjs
    |-- src/app/
    |   |-- page.tsx
    |   |-- auth/page.tsx
    |   |-- movies.json
    |   |-- components/
    |   |-- contexts/
    |   |-- lib/
    |   |-- types/
    |   `-- utilities/
    `-- public/
```

Note: `backend/movies.json` is required by the backend at startup. If it is generated or distributed outside git in your environment, place it at exactly `backend/movies.json` before running the API.

## Prerequisites

- Node.js 20.9.0 or newer.
- npm, included with Node.js.
- Python 3.10 or newer.
- MongoDB database or MongoDB Atlas cluster for authentication.
- Git.
- Docker, optional, for backend container builds and deployment.

## Environment Variables

### Backend

Create `backend/.env` from `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Supported backend variables:

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `MONGODB_URI` | Yes for auth | Empty | MongoDB connection string. Without this, authenticated routes cannot use the database. |
| `MONGODB_DATABASE` | No | `imovie_recommender` | Database name for user records. |
| `JWT_SECRET_KEY` | Yes in production | `change-me-in-production` | Secret used to sign access and refresh tokens. Set a strong private value. |
| `JWT_ALGORITHM` | No | `HS256` | JWT signing algorithm. |
| `ACCESS_TOKEN_MINUTES` | No | `15` | Access token lifetime in minutes. |
| `REFRESH_TOKEN_DAYS` | No | `30` | Refresh token lifetime in days. |
| `API_BASE_URL` | No | `http://localhost:8000` | Public backend URL used when building poster URLs. |
| `CORS_ORIGINS` | No | `https://imovierecommender.vercel.app,http://localhost:3000` | Comma-separated frontend origins allowed by CORS. |

### Frontend

Create `frontend/.env.local` when the backend is not running on the default URL:

```bash
cd frontend
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" > .env.local
```

On Windows PowerShell:

```powershell
Set-Content .env.local "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000"
```

Supported frontend variables:

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | No | `http://localhost:8000` | Browser-visible URL for the FastAPI backend. |

## Local Development

Clone the repository:

```bash
git clone https://github.com/Darkboy17/imovierecommender.git
cd imovierecommender
```

### 1. Start the Backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# macOS/Linux
source .venv/bin/activate

# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create `backend/.env`, set `MONGODB_URI`, set a strong `JWT_SECRET_KEY`, and confirm these files exist:

```text
backend/movies.json
backend/static/item_similarity_df.csv
backend/posters/
```

Run the API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open the health endpoint:

```text
http://localhost:8000/
```

You should see:

```text
Welcome to Movie Recommender API
```

FastAPI's interactive docs are available at:

```text
http://localhost:8000/docs
```

### 2. Start the Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend redirects unauthenticated users to `/auth`. Register a test account, search for movies, rate a few titles, and recommendations will load automatically.

## API Reference

Base URL for local development:

```text
http://localhost:8000
```

### Health

#### `GET /`

Returns a simple API welcome string.

### Authentication

#### `POST /auth/register`

Creates a user and returns tokens.

Request:

```json
{
  "email": "user@example.com",
  "password": "strong-password",
  "name": "Optional Name"
}
```

Response:

```json
{
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "mongodb-user-id",
    "email": "user@example.com",
    "name": "Optional Name"
  }
}
```

#### `POST /auth/login`

Logs in an existing user.

Request:

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

Response shape matches `/auth/register`.

#### `POST /auth/refresh`

Rotates a refresh token and returns a new token pair.

Request:

```json
{
  "refresh_token": "jwt-refresh-token"
}
```

#### `POST /auth/logout`

Requires an access token. Removes the provided refresh token from the user's stored token hashes. If no refresh token is supplied, all refresh tokens for the user are cleared.

Headers:

```text
Authorization: Bearer <access_token>
```

Request:

```json
{
  "refresh_token": "jwt-refresh-token"
}
```

#### `GET /auth/me`

Requires an access token and returns the current user.

Headers:

```text
Authorization: Bearer <access_token>
```

### Recommendations

#### `POST /recommendations/`

Requires an access token. Accepts rated movies and returns personalized recommendations.

Headers:

```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request:

```json
{
  "movies": {
    "1": {
      "title": "Toy Story (1995)",
      "rating": 5
    },
    "2": {
      "title": "Jumanji (1995)",
      "rating": 3
    }
  },
  "num_movies": 20
}
```

Response:

```json
{
  "recommended_movies": [
    "Movie Title (Year)"
  ],
  "posters": {
    "Movie Title (Year)": "http://localhost:8000/posters/123.jpg"
  }
}
```

### Posters

#### `GET /movie-posters/?limit=10&offset=0`

Returns a paginated list of poster URLs.

#### `GET /movie-posters-ids/?ids=1,2,3`

Returns poster URLs for specific movie IDs.

#### `GET /posters/{filename}`

Serves static poster files from `backend/posters/`.

## Data and Model Assets

The recommender depends on local data files:

| Asset | Used By | Purpose |
| --- | --- | --- |
| `frontend/src/app/movies.json` | Frontend | Client-side search catalogue. |
| `backend/movies.json` | Backend | Maps movie titles to `movieId` values for poster lookup. |
| `backend/static/item_similarity_df.csv` | Backend | Item-similarity matrix read into pandas at startup. |
| `backend/posters/*.jpg` | Backend | Poster files served through `/posters`. |

Backend startup imports the recommendation service, which immediately reads `backend/movies.json` and `backend/static/item_similarity_df.csv`. If either file is missing or malformed, the API will fail before it can serve requests.

The recommendation algorithm expects movie titles in request payloads to match the similarity matrix columns. The frontend uses its local catalogue to keep those titles consistent.

## Available Scripts

### Frontend

Run these from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production Next.js server after building. |
| `npm run lint` | Run ESLint. |

### Backend

Run these from `backend/`:

| Command | Description |
| --- | --- |
| `uvicorn main:app --reload --host 0.0.0.0 --port 8000` | Start the local API server. |
| `pip install -r requirements.txt` | Install Python dependencies. |
| `docker build -t imovie-recommender-api .` | Build the backend container image. |
| `docker run --env-file .env -p 8000:3001 imovie-recommender-api` | Run the backend container locally. |

The Dockerfile exposes and runs Uvicorn on container port `3001`, so map host ports accordingly.

## Deployment

### Frontend on Vercel

1. Set the Vercel project root to `frontend`.
2. Use Node.js 20.9.0 or newer.
3. Set `NEXT_PUBLIC_API_BASE_URL` to the deployed backend URL.
4. Deploy with the default Next.js build command:

```bash
npm run build
```

### Backend with Docker

The backend includes:

- `backend/Dockerfile` for building the API image.
- `backend/deploy-backend.ps1` for building, pushing, and deploying a Dockerized backend to a Linux VM over SSH.

Minimal local Docker run:

```bash
cd backend
docker build -t imovie-recommender-api .
docker run --env-file .env -p 8000:3001 imovie-recommender-api
```

When deploying to production:

- Set a strong `JWT_SECRET_KEY`.
- Set `MONGODB_URI` to a production database.
- Set `API_BASE_URL` to the public backend URL.
- Include the frontend domain in `CORS_ORIGINS`.
- Make sure `movies.json`, `static/item_similarity_df.csv`, and `posters/` are included in the backend image or mounted into the container.
- Serve the backend over HTTPS before using it from a deployed browser app.

## Troubleshooting

### `RuntimeError: MONGODB_URI is not configured`

Set `MONGODB_URI` in `backend/.env`. Auth routes and protected recommendation routes require MongoDB because users and refresh tokens are stored there.

### Backend fails at startup with a missing file error

Confirm these files exist:

```text
backend/movies.json
backend/static/item_similarity_df.csv
```

The recommender reads both files when the backend process starts.

### Browser cannot reach the backend

Check that:

- The backend is running on the URL configured by `NEXT_PUBLIC_API_BASE_URL`.
- `CORS_ORIGINS` includes the frontend origin, for example `http://localhost:3000`.
- The backend URL does not have an extra trailing slash in environment variables.
- A deployed frontend is calling an HTTPS backend URL.

### Recommendations are empty

Possible causes:

- The rated titles are not present in the similarity matrix.
- The request is made without a valid bearer token.
- `num_movies` is too low.
- The similarity matrix or movie catalogue is out of sync with the frontend catalogue.

### Poster images are missing

Check that:

- `backend/posters/{movieId}.jpg` exists for the recommended movie ID.
- `API_BASE_URL` points to the public backend URL.
- `/posters/{filename}` is reachable from the browser.

### Frontend redirects to `/auth`

This is expected when no valid session exists. Register or sign in. The app stores session data in browser local storage and refreshes tokens automatically before expiration.

## Contributing

1. Create a focused branch for your change.
2. Keep frontend and backend changes separated when practical.
3. Run the relevant checks before opening a pull request:

```bash
cd frontend
npm run lint
npm run build
```

```bash
cd backend
python -m compileall .
```

4. Do not commit secrets. Keep `.env` files local and use `.env.example` for documented configuration.
