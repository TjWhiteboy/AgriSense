# AgriSense (Improved)

AgriSense is a smart agricultural intelligence system designed to empower farmers and agricultural enthusiasts with AI-backed crop analysis, real-time weather monitoring, and regional analytics. This repository contains the improved, modular structure of the AgriSense platform.

## Project Structure

The project is structured as a monorepo containing two main parts:

```
agrisense/
├── backend/      # Express API Server
└── frontend/     # React + Vite Web Client
```

---

## Getting Started

### 1. Backend Setup

The backend is built with **Node.js** and **Express.js**, using **MongoDB** for storage and integrates with Google's **Gemini AI** and **OpenWeather** APIs.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   GEMINI_API_KEY=your_google_gemini_api_key
   JWT_SECRET=your_jwt_signing_secret
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```
4. Run the development server (runs nodemon):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

The frontend is a modern SPA powered by **React 19**, **Vite**, **TypeScript**, and **Framer Motion** for premium glassmorphism layouts and transitions.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Key Features & Technologies

### Backend (`/backend`)
- **Express.js / Node.js**: Core API development.
- **Google Gen AI SDK (`@google/generative-ai`)**: Powering crop advice and AI chats.
- **Mongoose / MongoDB**: Database modeling and data persistence.
- **Express Rate Limit & Helmet**: Security headers and API protection.
- **Joi**: API payload validation schemas.

### Frontend (`/frontend`)
- **Vite & React 19**: Ultra-fast build toolchain and rendering.
- **Framer Motion**: Smooth interface transitions and animations.
- **Lucide Icons**: Modern vector icon set.
- **Glassmorphism UI**: Beautiful aesthetic styles customized for agricultural stats.
