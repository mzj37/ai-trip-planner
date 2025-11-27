# WanderAI - Design Document

## User Personas

### Persona 1: Sarah - The Busy Professional
- **Age:** 28
- **Occupation:** Marketing Manager
- **Tech Comfort:** High
- **Travel Style:** Efficient, wants quality experiences without hours of planning
- **Pain Points:** No time to research, overwhelmed by too many options
- **Goals:** Get a solid trip plan in minutes, stay within budget
- **Quote:** "I just want to tell someone where I'm going and have them figure out the rest."

### Persona 2: Mike - The Budget Traveler
- **Age:** 22
- **Occupation:** College Student
- **Tech Comfort:** High
- **Travel Style:** Adventure, street food, local experiences
- **Pain Points:** Limited budget, doesn't know where to start
- **Goals:** Maximize experiences while minimizing costs
- **Quote:** "I have $500 and 5 days off. Where can I go?"

### Persona 3: The Chen Family
- **Age:** Parents 40s, Kids 10 & 14
- **Occupation:** Working parents
- **Tech Comfort:** Medium
- **Travel Style:** Family-friendly, safe, educational
- **Pain Points:** Need activities suitable for different ages
- **Goals:** Create memorable family experiences everyone enjoys
- **Quote:** "We need something fun for teenagers AND a 10-year-old."

---

## User Stories

### Authentication
- As a user, I want to create an account so that I can save my trip plans.
- As a user, I want to log in so that I can access my saved trips.
- As a user, I want to log out so that my account stays secure.

### Trip Planning - Chat Mode
- As a user, I want to describe my trip in natural language so that I don't have to fill out forms.
- As a user, I want to refine the AI's suggestions by chatting so that I get exactly what I want.

### Trip Planning - Form Mode
- As a user, I want to fill out a simple form so that I can quickly generate a structured itinerary.
- As a user, I want to select multiple travel styles so that my trip matches my interests.

### Trip Planning - Surprise Mode
- As a user, I want to enter just my budget and get destination suggestions so that I can discover new places.

### Trip Management
- As a user, I want to save generated trips so that I can access them later.
- As a user, I want to view all my saved trips so that I can review my travel plans.
- As a user, I want to delete trips I no longer need so that my list stays organized.
- As a user, I want to share my trip via a link so that friends can see my itinerary.

### AI Interaction
- As a user, I want the AI to remember our conversation so that I can make incremental changes.
- As a user, I want to regenerate a trip so that I can see alternative options.

---

## Database Schema (ERD)
```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │     TRIPS       │       │   ACTIVITIES    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │───┐   │ id (PK)         │
│ email (unique)  │   │   │ user_id (FK)────│───┘   │ trip_id (FK)────│───┘
│ password_hash   │   │   │ destination     │       │ day_number      │
│ name            │   │   │ start_date      │       │ time_slot       │
│ created_at      │   │   │ end_date        │       │ activity_name   │
│ updated_at      │   └──→│ budget          │       │ description     │
└─────────────────┘       │ styles          │       │ estimated_cost  │
                          │ ai_response     │       │ location        │
                          │ share_id        │       │ category        │
                          │ created_at      │       │ order_index     │
                          │ updated_at      │       │ created_at      │
                          └─────────────────┘       └─────────────────┘

RELATIONSHIPS:
- Users → Trips: One-to-Many (one user can have many trips)
- Trips → Activities: One-to-Many (one trip has many activities)
```

### Table Details

**Users**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

**Trips**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| user_id | INTEGER | FOREIGN KEY → Users(id), NOT NULL |
| destination | VARCHAR(255) | NOT NULL |
| start_date | DATE | |
| end_date | DATE | |
| budget | DECIMAL(10,2) | |
| styles | VARCHAR(255) | Comma-separated: "foodie,cultural" |
| ai_response | TEXT | Full AI conversation/response |
| share_id | VARCHAR(50) | UNIQUE, for shareable links |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

**Activities**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| trip_id | INTEGER | FOREIGN KEY → Trips(id), NOT NULL |
| day_number | INTEGER | NOT NULL |
| time_slot | VARCHAR(20) | e.g., "9:00 AM" |
| activity_name | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| estimated_cost | DECIMAL(10,2) | |
| location | VARCHAR(255) | |
| category | VARCHAR(50) | meal/attraction/transport |
| order_index | INTEGER | For ordering activities |
| created_at | TIMESTAMP | DEFAULT NOW() |