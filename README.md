# 🚀 LeadDesk Mini

A lightweight lead-capture CRM — public landing page for prospects to submit inquiries, and a secured admin dashboard to manage, search, and triage those leads in real time.

**🌐 Live App:** [lead-desk-mini-omega.vercel.app](https://lead-desk-mini-omega.vercel.app)
**🔐 Admin Login:** [lead-desk-mini-omega.vercel.app/login](https://lead-desk-mini-omega.vercel.app/login)
**⚙️ Backend API:** [leaddesk-backend-2rjq.onrender.com](https://leaddesk-backend-2rjq.onrender.com)
**📦 Repository:** [github.com/Khushi288-creator/LeadDesk-Mini](https://github.com/Khushi288-creator/LeadDesk-Mini)

> ⏳ **Note:** The backend runs on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–50 seconds to respond — this is expected and not a bug.

**Test credentials:**
```
Email:    khushi@gmail.com
Password: 123456
```

---

## 📖 Overview

LeadDesk Mini solves a simple, common problem: a business needs a way for visitors to submit project inquiries, and a way for the team to triage those inquiries without digging through email. The app is split into two clearly separated surfaces:

- **Public side (`/`)** — anyone can submit a lead through a validated form. No login required.
- **Admin side (`/login` → `/dashboard`, `/leads`)** — authenticated staff can view stats, search/filter leads, and move each one through a status pipeline (`New → Contacted → Closed`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Routing | React Router DOM |
| HTTP Client | Axios (with request interceptor for auth) |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| Deployment | Vercel (frontend) · Render (backend) · MongoDB Atlas (database) |

---

## 🏗️ Architecture

```
┌─────────────────┐         HTTPS          ┌──────────────────┐        ┌─────────────────┐
│   React Client    │  ───────────────────▶  │   Express API      │  ────▶  │  MongoDB Atlas    │
│   (Vercel)         │  ◀───────────────────  │   (Render)          │  ◀────  │  (leaddeskmini)    │
└─────────────────┘      JWT in headers      └──────────────────┘        └─────────────────┘
```

- The client never talks to MongoDB directly — all reads/writes go through the Express API.
- The API validates and authorizes every request before touching the database.
- The admin JWT is generated at login and sent as a Bearer token on every subsequent protected request via an Axios interceptor.

---

## 🗄️ Data Model

### `Admin` collection
| Field | Type | Notes |
|---|---|---|
| `name` | String | Admin's display name |
| `email` | String | Unique, used for login |
| `password` | String | Hashed with bcrypt before storage — plaintext is never persisted |
| `createdAt` / `updatedAt` | Date | Auto-managed by Mongoose timestamps |

### `Lead` collection
| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, validated |
| `budget` | Number | Selected from a fixed budget-range list on the client |
| `message` | String | Required |
| `status` | Enum | `New` \| `Contacted` \| `Closed` — defaults to `New` |
| `source` | String | Defaults to `Website` (kept extensible for future lead sources, e.g. referral, ad campaign) |
| `createdAt` / `updatedAt` | Date | Auto-managed by Mongoose timestamps |

**Design reasoning:**
- Two collections were kept deliberately separate — `Admin` (internal, authenticated users) and `Lead` (external, public-submitted data) — so their access patterns and validation rules never overlap or leak into each other.
- `status` is an enum rather than a free-text field, so the admin pipeline (`New → Contacted → Closed`) stays consistent and query/filterable — no risk of typos like `"contactd"` breaking dashboard stats.
- `source` defaults to `"Website"` but isn't hardcoded into the schema logic, so adding new lead sources later (e.g. a referral form, a chatbot) won't require a schema migration.

---

## 🔐 Authentication Approach

Authentication is handled with **JWT (JSON Web Tokens)** rather than sessions, since the API is stateless and the frontend/backend are deployed independently on different domains.

**Flow:**
1. Admin submits email + password to `POST /api/auth/login`.
2. Backend looks up the admin by email, compares the submitted password against the stored bcrypt hash using `bcrypt.compare()`.
3. On success, the backend signs a JWT (containing the admin's ID) with a server-side secret (`JWT_SECRET`, stored only in environment variables — never committed to the repo) and returns it to the client.
4. The client stores the token and attaches it as a `Bearer` token on every subsequent request via an Axios request interceptor.
5. Protected routes (`/api/leads/*`) run through `authMiddleware.ts`, which verifies the JWT signature and expiry before allowing the request through. Requests without a valid token receive a `401 Access denied` response.
6. On the frontend, `ProtectedRoute.tsx` checks for a token in storage before rendering any admin page, redirecting unauthenticated users back to `/login`.

**Why not a hardcoded string or plain sessions:**
- Passwords are never stored or compared in plaintext — bcrypt's salted hashing means even a database leak wouldn't expose usable credentials.
- JWTs let the backend stay stateless (no server-side session store needed), which fits a small deployment on a free-tier host cleanly.
- The secret used to sign tokens lives only in environment variables on Render, not in the codebase.

---

## ✅ Validation

- **Client-side:** The public lead form validates required fields, email format, and budget selection before allowing submission, giving instant feedback without a round trip to the server.
- **Server-side:** The same rules are enforced again in the Express controller — the API never trusts client input alone, so a request sent directly to the API (bypassing the UI) is still validated before touching the database.

---

## 📂 Project Structure

```
LeadDesk-Mini/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/           # Home (public form), Login, Dashboard, Leads
│   │   ├── components/      # Sidebar, LeadForm, LeadTable, StatusBadge, Toast, etc.
│   │   ├── services/        # api.ts, authService.ts, leadService.ts
│   │   └── types/           # Shared TypeScript interfaces
│   └── vercel.json          # SPA routing config for client-side routes
├── server/                  # Node + Express + TypeScript backend
│   ├── src/
│   │   ├── models/           # Admin.ts, Lead.ts (Mongoose schemas)
│   │   ├── controllers/      # authController.ts, leadController.ts
│   │   ├── middleware/        # authMiddleware.ts
│   │   ├── routes/            # authRoutes.ts, leadRoutes.ts
│   │   └── app.ts / server.ts
├── .env.example
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Create an admin account | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |

### Leads
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/leads` | Submit a new lead (public form) | No |
| GET | `/api/leads` | List all leads | Yes |
| PATCH | `/api/leads/:id` | Update a lead's status | Yes |
| GET | `/api/leads/stats` | Dashboard summary stats | Yes |

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas connection string (or local MongoDB instance)

### 1. Clone the repo
```bash
git clone https://github.com/Khushi288-creator/LeadDesk-Mini.git
cd LeadDesk-Mini
```

### 2. Backend setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

### 3. Frontend setup
```bash
cd ../client
npm install
```
Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## ☁️ Deployment

| Component | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root directory: `client`. `VITE_API_URL` set as a production environment variable. `vercel.json` rewrites all routes to `index.html` to support client-side routing. |
| Backend | Render | Root directory: `server`. Build: `npm install && npm run build`. Start: `npm start`. Free tier — cold starts after inactivity. |
| Database | MongoDB Atlas | Cloud-hosted, connected via `MONGODB_URI`. |

CORS on the backend is explicitly restricted to the known frontend origins (`localhost:5173` for local dev, the Vercel production URL) rather than left open, so the API only accepts requests from the app itself.

---

## 🎥 Walkthrough

A Loom recording covering the full flow — public form submission → admin login → dashboard stats → lead search/filter → status update — is linked here: [**[Loom link]**](https://loom.com/share/226dc9019eb74c2ea2a8d3ecf180bf7d)

---

## 🔮 Future Improvements

- Rate-limiting on the public lead-submission endpoint to prevent spam
- Refresh tokens / token expiry handling with automatic re-login prompts
- Pagination on the leads table for larger datasets
- Email notification to admin on new lead submission
