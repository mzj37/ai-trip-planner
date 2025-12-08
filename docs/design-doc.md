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
- As a user, I want the AI to remember our conversation so that I can make incremental changes.

### Trip Planning - Form Mode
- As a user, I want to fill out a simple form so that I can quickly generate a structured itinerary.
- As a user, I want to select multiple travel styles so that my trip matches my interests.
- As a user, I want to specify my budget so that I get realistic cost estimates.

### Trip Planning - Surprise Mode
- As a user, I want to enter just my budget and desired vibe so that AI can surprise me with a destination.
- As a user, I want to regenerate a surprise trip so that I can see alternative destination options.

### Trip Management
- As a user, I want to save generated trips so that I can access them later.
- As a user, I want to view all my saved trips so that I can review my travel plans.
- As a user, I want to delete trips I no longer need so that my list stays organized.
- As a user, I want to share my trip via a public link so that friends can see my itinerary.
- As a user, I want to view detailed itineraries with activities, times, and costs so that I can plan my days effectively.

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
│ email (unique)  │   │   │ userId (FK)─────│───┘   │ tripId (FK)─────│───┘
│ password        │   │   │ destination     │       │ dayNumber       │
│ name            │   │   │ startDate       │       │ timeSlot        │
│ createdAt       │   │   │ endDate         │       │ activityName    │
│ updatedAt       │   └──→│ budget          │       │ description     │
└─────────────────┘       │ styles          │       │ estimatedCost   │
                          │ aiResponse      │       │ location        │
                          │ shareId         │       │ category        │
                          │ createdAt       │       │ orderIndex      │
                          │ updatedAt       │       │ createdAt       │
                          └─────────────────┘       │ updatedAt       │
                                                    └─────────────────┘

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
| password | VARCHAR(255) | NOT NULL (hashed with bcryptjs) |
| name | VARCHAR(100) | NOT NULL |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

**Trips**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| userId | INTEGER | FOREIGN KEY → Users(id), NOT NULL |
| destination | VARCHAR(255) | NOT NULL |
| startDate | DATE | |
| endDate | DATE | |
| budget | INTEGER | |
| styles | VARCHAR(255) | Comma-separated: "foodie,cultural" |
| aiResponse | TEXT | Full AI conversation/response |
| shareId | UUID | UNIQUE, for shareable links |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

**Activities**
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| tripId | INTEGER | FOREIGN KEY → Trips(id), NOT NULL |
| dayNumber | INTEGER | NOT NULL |
| timeSlot | VARCHAR(20) | e.g., "9:00 AM" |
| activityName | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| estimatedCost | INTEGER | |
| location | VARCHAR(255) | |
| category | VARCHAR(50) | meal/attraction/transport/accommodation |
| orderIndex | INTEGER | For ordering activities |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

### Notes on Database Design

1. **Sequelize ORM**: Uses camelCase for field names (userId, startDate) which are automatically mapped to snake_case in PostgreSQL (user_id, start_date).

2. **Cascade Deletion**: When a Trip is deleted, all associated Activities are automatically deleted to maintain data integrity.

3. **Share ID**: Generated using UUID to create unique, non-guessable links for sharing trips publicly without authentication.

4. **Activity Ordering**: The `orderIndex` field ensures activities display in the correct order within each day, as they may not always be chronological by time slot.

5. **Budget Storage**: Stored as INTEGER (cents) to avoid floating-point precision issues. Display layer handles conversion to dollars.