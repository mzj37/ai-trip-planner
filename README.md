# AI-Powered Trip Planner

An intelligent travel planning application that uses AI to generate personalized trip itineraries based on your destination, budget, and preferences.

## 🚀 Live Demo

- **Frontend:** [Coming soon - will be Vercel URL]
- **Backend:** [Coming soon - will be Render URL]

## 👥 Team

- Zijie Mu (mu.zi@northeastern.edu)
- Meixuan Li (li.meixua@northeastern.edu)

## ✨ Features

- **AI Itinerary Generation** - Enter destination, dates, budget, and travel style to get a complete trip plan
- **User Authentication** - Secure signup and login
- **Trip Management** - Save, view, edit, and delete your trips
- **Activity Tracking** - See daily activities with times, locations, and estimated costs
- **Budget Tracking** - Monitor total trip costs
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| AI | Google Gemini API |
| Authentication | JWT (JSON Web Tokens) |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

## 📁 Project Structure
```
ai-trip-planner/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API call functions
│   │   └── context/        # Auth context
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── services/           # AI service
└── docs/                   # Documentation
```

## ⚙️ Local Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database (or use Render's free tier)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/mzj37/ai-trip-planner.git
cd ai-trip-planner
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 API Documentation

See [docs/api-docs.md](docs/api-docs.md) for full API documentation.

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create new user |
| POST | /api/auth/login | Login user |
| GET | /api/trips | Get user's trips |
| POST | /api/trips | Create new trip |
| GET | /api/trips/:id | Get single trip |
| PUT | /api/trips/:id | Update trip |
| DELETE | /api/trips/:id | Delete trip |
| POST | /api/ai/generate | Generate AI itinerary |

## 🗄️ Database Schema

See [docs/design-doc.md](docs/design-doc.md) for full ERD and user stories.

### Tables

**Users**
- id, email, password_hash, name, created_at

**Trips**
- id, user_id (FK), destination, start_date, end_date, budget, style, created_at

**Activities**
- id, trip_id (FK), day_number, time_slot, activity_name, description, estimated_cost, location, category

## 🔒 Environment Variables

Never commit `.env` files! Use `.env.example` as a template.

| Variable | Description |
|----------|-------------|
| PORT | Backend server port |
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret for signing tokens |
| GEMINI_API_KEY | Google Gemini API key |
| VITE_API_URL | Backend API URL for frontend |

## 📄 License

This project is for educational purposes - CS5610 Web Development Final Project.