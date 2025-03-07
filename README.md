# iMovie Recommender

[Live Demo](https://imovierecommender.vercel.app)

## Overview

iMovie Recommender is an advanced web application designed to enhance your movie-watching experience. Built using **Next.js** and **React**, the platform offers a seamless interface for users to **search, rate, and receive curated movie recommendations**. By analyzing user ratings and interfacing with a sophisticated **RESTful API**, the app intelligently suggests films that align with individual preferences.

---

## Features

- **Movie Search**: Find movies by title, genre, or popularity.
- **Personalized Recommendations**: AI-powered suggestions based on user ratings.
- **User Ratings**: Rate movies to improve recommendation accuracy.
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices.
- **Secure API Integration**: FastAPI backend for efficient data handling.

---

## Tech Stack

### Frontend:
- **Next.js** - React framework for server-side rendering and routing.
- **React** - Component-based UI for a dynamic user experience.
- **Tailwind CSS** - Utility-first CSS framework for styling.

### Backend:
- **FastAPI** - High-performance Python framework for API development.
- **Oracle Cloud** - Cloud-based infrastructure for hosting.
- **Docker** - Containerized deployment for scalability and reliability.

---

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- Docker (for containerized deployment)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/imovie-recommender.git
   cd imovie-recommender
   ```

2. **Set up the Frontend**:
   ```bash
   cd frontend
   npm install
   ```

3. **Set up the Backend**:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Run the Backend**:
   ```bash
   uvicorn main:app --reload
   ```

5. **Run the Frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Access the App**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
---
