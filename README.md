# TrackFlow

A multi-user project and issue tracking system built with
the MERN stack. Resembles a simplified Jira / Linear.

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Context API  |
| Backend   | Node.js, Express.js (ES Modules)              |
| Database  | MongoDB, Mongoose                             |
| Auth      | JWT (15 min) + Refresh Token rotation         |
| Styling   | CSS Modules, custom design token system       |

## Features

- JWT authentication with refresh token rotation
- Organization-based multi-tenancy
- Role-based access control (Admin / Member)
- Project management with member assignment
- Issue tracking with Kanban board
- Real-time-like optimistic UI updates
- Full activity log with timeline UI
- Comment system with edit / delete + edited badge
- Centralized error handling and authorization guards
- Aggregation queries for stats and overdue issues
- Responsive dark-theme UI

## Project Structure

trackflow/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── api/         # Axios API modules
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Route-level pages
│   │   └── utils/       # Helper utilities
│   └── .env.example
├── server/          # Express backend
│   ├── controllers/ # Route handlers (thin layer)
│   ├── middleware/  # Auth, role, org, error guards
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routers
│   ├── seeders/     # DB seed scripts
│   ├── services/    # Business logic layer
│   └── utils/       # Token, logger, sanitize
├── .gitignore
└── README.md

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- MongoDB running locally OR a MongoDB Atlas URI
- npm v9+

### 1. Clone the repository
```bash
git clone https://github.com/your-username/trackflow.git
cd trackflow
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm install
npm run seed     # Creates default roles and users
npm run dev      # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd client
cp .env.example .env
# Edit .env if your API runs on a different port
npm install
npm run dev      # Starts on http://localhost:5173
```

### 4. Default credentials (after seeding)

| Email                    | Password     | Role   |
|--------------------------|--------------|--------|
| admin@trackflow.dev      | Admin@1234   | Admin  |
| member@trackflow.dev     | Member@1234  | Member |

## API Overview

All endpoints are prefixed with `/api/v1`

| Method | Path                                          | Access        |
|--------|-----------------------------------------------|---------------|
| POST   | /auth/register                                | Public        |
| POST   | /auth/login                                   | Public        |
| POST   | /auth/refresh                                 | Public        |
| POST   | /auth/logout                                  | Auth          |
| GET    | /auth/me                                      | Auth          |
| POST   | /organizations                                | Auth          |
| GET    | /organizations/me                             | Member        |
| POST   | /organizations/invite                         | Admin         |
| GET    | /organizations/invite/accept/:token           | Public        |
| DELETE | /organizations/members/:userId                | Admin         |
| GET    | /projects                                     | Member        |
| POST   | /projects                                     | Admin         |
| GET    | /projects/:id                                 | Member        |
| PATCH  | /projects/:id                                 | Admin         |
| DELETE | /projects/:id                                 | Admin         |
| POST   | /projects/:id/members                         | Admin         |
| DELETE | /projects/:id/members/:userId                 | Admin         |
| GET    | /projects/:projectId/issues                   | Member        |
| POST   | /projects/:projectId/issues                   | Member        |
| GET    | /projects/:projectId/issues/:issueId          | Member        |
| PATCH  | /projects/:projectId/issues/:issueId          | Member        |
| DELETE | /projects/:projectId/issues/:issueId          | Admin         |
| POST   | /projects/:projectId/issues/:issueId/comments | Member        |
| PATCH  | .../comments/:commentId                       | Comment owner |
| DELETE | .../comments/:commentId                       | Owner / Admin |
| GET    | /activity/me                                  | Auth          |
| GET    | /activity/projects/:projectId                 | Member        |

## Assumptions

1. An organization has exactly one level — no sub-orgs
2. A user belongs to at most one organization at a time
3. Project membership is managed manually by admins
4. Refresh tokens expire after 7 days of inactivity
5. Email delivery is mocked — invite links are returned
   in the API response for the admin to share manually
6. File attachments on issues are out of scope for v1
7. Real-time updates (WebSocket) are out of scope —
   optimistic UI is used instead

## Possible Improvements

### Short-term
- Email delivery for invitations (Nodemailer / Resend)
- Avatar upload with cloud storage (Cloudinary / S3)
- Issue ordering within Kanban columns (drag and drop)
- Markdown support in issue descriptions and comments
- @mention system in comments with notifications

### Medium-term  
- WebSocket real-time updates (Socket.io)
- Issue labels and custom fields
- Sprint / milestone grouping
- File attachments on issues
- Search across issues and comments (MongoDB text index)

### Long-term
- Webhook integrations
- Public API with API key auth
- Mobile app (React Native)
- Audit log export (CSV / PDF)
- SSO / OAuth login

## Authorization Model
Organization
└── Admin  → full CRUD on projects, issues, members
└── Member → read + create issues, update own issues,
comment, view assigned projects only
Cross-organization access → 403 at middleware level
Invalid ObjectIds         → 400 before any DB query
Comment edit by non-owner → 403 at middleware level
Issue update by non-member→ 403 at middleware level
