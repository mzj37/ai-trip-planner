# AI-Powered Trip Planner

An intelligent travel planning application that uses Google Gemini AI to generate personalized trip itineraries. Features three unique planning modes: conversational chat, structured form, and surprise destination selection.

## 👥 Team

- Zijie Mu (mu.zi@northeastern.edu)
- Meixuan Li (li.meixua@northeastern.edu)

## ✨ Features

### Three Planning Modes
- **💬 Chat Mode** - Have a natural conversation with WanderAI to plan your trip
- **📝 Form Mode** - Fill out a structured form with destination, dates, budget, and travel styles
- **🎲 Surprise Mode** - Enter your budget and vibe, let AI pick the perfect destination for you

### Core Functionality
- **AI Itinerary Generation** - Detailed day-by-day plans with activities, times, locations, and costs
- **User Authentication** - Secure signup and login with JWT
- **Trip Management** - Save, view, and delete your generated trips
- **Beautiful Itinerary Display** - Clean, visual timeline format for activities
- **Trip Sharing** - Share your itineraries via public links
- **Budget Tracking** - Real-time cost estimates for all activities
- **Responsive Design** - Fully mobile-friendly interface

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18.2 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router 6 |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| AI | Google Gemini API (gemini-2.5-flash-lite) |
| Authentication | JWT + bcryptjs |
| HTTP Client | Axios |

## 📁 Project Structure
```
ai-trip-planner/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── ItineraryDisplay.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── TripCard.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TripPlanner.jsx
│   │   │   ├── MyTrips.jsx
│   │   │   ├── TripDetail.jsx
│   │   │   └── SharedTrip.jsx
│   │   ├── context/           # Auth context
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
├── server/                     # Express backend
│   ├── config/
│   │   └── database.js        # Sequelize config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   └── aiController.js
│   ├── models/                # Sequelize models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Activity.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── services/
│   │   └── geminiService.js   # AI integration
│   ├── server.js
│   ├── package.json
│   └── .env
└── docs/
    ├── design-doc.md          # Design document
    └── api-docs.md            # API documentation
```

## ⚙️ Local Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Google Gemini API Key** - [Get one here](https://ai.google.dev/)

### 1. Clone the Repository
```bash
git clone https://github.com/mzj37/ai-trip-planner.git
cd ai-trip-planner
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE trip_planner;
```

Or use psql:
```bash
psql -U postgres
CREATE DATABASE trip_planner;
\q
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=trip_planner
DB_PORT=5432

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000` and automatically sync the database schema.

### 4. Frontend Setup
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:
```env
# API Base URL
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📋 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

**Request Body (Register/Login):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Trip Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trips` | Get all user's trips | Yes |
| GET | `/trips/:id` | Get specific trip | Yes |
| GET | `/trips/share/:shareId` | Get shared trip (public) | No |
| POST | `/trips` | Create new trip | Yes |
| PUT | `/trips/:id` | Update trip | Yes |
| DELETE | `/trips/:id` | Delete trip | Yes |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/chat` | Chat with AI | No |
| POST | `/ai/form` | Generate itinerary from form | No |
| POST | `/ai/surprise` | Get surprise destination | No |

**Chat Request:**
```json
{
  "message": "I want to visit Paris for 3 days",
  "conversationHistory": []
}
```

**Form Request:**
```json
{
  "destination": "Paris, France",
  "days": 3,
  "budget": 1000,
  "styles": "romantic, cultural",
  "startDate": "2024-06-01"
}
```

**Surprise Request:**
```json
{
  "budget": 1000,
  "vibe": "adventurous",
  "days": 3
}
```

## 🗄️ Database Schema

See [docs/design-doc.md](docs/design-doc.md) for full ERD and user stories.

### Tables

**Users**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (hashed) |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

**Trips**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| userId | INTEGER | FOREIGN KEY → Users(id) |
| destination | VARCHAR(255) | NOT NULL |
| startDate | DATE | |
| endDate | DATE | |
| budget | INTEGER | |
| styles | VARCHAR(255) | |
| aiResponse | TEXT | |
| shareId | UUID | UNIQUE |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

**Activities**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| tripId | INTEGER | FOREIGN KEY → Trips(id) |
| dayNumber | INTEGER | |
| timeSlot | VARCHAR(50) | |
| activityName | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| estimatedCost | INTEGER | |
| location | VARCHAR(255) | |
| category | VARCHAR(50) | meal/attraction/transport/accommodation |
| orderIndex | INTEGER | |
| createdAt | TIMESTAMP | DEFAULT NOW() |

**Relationships:**
- Users → Trips: One-to-Many (one user can have many trips)
- Trips → Activities: One-to-Many (one trip has many activities)

## 🔐 Environment Variables

**Important:** Never commit `.env` files to GitHub! They are listed in `.gitignore`.

### Backend (.env in server/)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | PostgreSQL host | localhost |
| DB_USER | PostgreSQL username | postgres |
| DB_PASSWORD | PostgreSQL password | your_password |
| DB_NAME | Database name | trip_planner |
| DB_PORT | PostgreSQL port | 5432 |
| JWT_SECRET | Secret for JWT signing | random_string_here |
| GEMINI_API_KEY | Google Gemini API key | your_api_key |

### Frontend (.env in client/)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Make sure PostgreSQL is running
# On Mac: brew services start postgresql
# On Windows: Start PostgreSQL service

# Test connection
psql -U postgres -d trip_planner
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000        # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

### API Key Issues
- Verify your Gemini API key is valid
- Check if you've exceeded free tier limits at [Google AI Studio](https://ai.google.dev/)

## 📝 License

This project is for educational purposes - CS5610 Web Development Final Project at Northeastern University.

## 🙏 Acknowledgments

- Google Gemini AI for powering the trip planning features
- Northeastern University CS5610 course
- All open-source libraries used in this project

---

**Repository:** https://github.khoury.northeastern.edu/cs5610-fall2025/finalproject-ai-trip-planner.git

## 🧪 Test Accounts

For testing and grading purposes, use these pre-configured accounts:

| Email | Password | Description |
|-------|----------|-------------|
| test1@northeastern.edu | Test123! | Contains sample trips (Tokyo, Portland) |
| test2@northeastern.edu | Test123! | Empty account (test new user flow) |
| professor@northeastern.edu | Demo123! | Empty account |
| ta@northeastern.edu | Demo123! | Empty account |

**Note:** 
- `test1` has pre-saved trips so you can immediately see the "My Trips" functionality
- Other accounts are empty so you can test the full trip creation workflow
- You can also create your own account by clicking "Sign Up"