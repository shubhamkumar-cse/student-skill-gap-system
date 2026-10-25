# Student Skill Gap Analysis and Personalized Career Roadmap System

A full-stack web application that helps a student pick a target career role,
compares it against their current skills, shows exactly what is missing,
calculates a skill-match percentage, and generates a personalized,
trackable learning roadmap.

---

## 1. Project Overview

| | |
|---|---|
| **Project** | Student Skill Gap Analysis and Personalized Career Roadmap System |
| **Domain** | Web Development / Software Engineering / Skill Analytics |
| **Type** | Full-stack web application (real database, real auth, real CRUD) |

Core idea: a student selects a career role (e.g. *Java Developer*), the system
compares the role's required skills against the student's own skills, and
splits them into **Available**, **Partially Known**, and **Missing**. A
match percentage is calculated, and a roadmap is generated for everything
that isn't fully available yet.

## 2. Features

**Student**
- Register / Login (JWT-based)
- Edit profile (college, branch, semester, bio)
- Add / update / delete personal skills with a proficiency status
- Select a target career role
- View required skills for that role
- Run skill-gap analysis (available / partially known / missing + match %)
- Generate a personalized roadmap from the gap
- Track roadmap progress (0% → 25% → 50% → 75% → 100%)
- Dashboard summarizing all of the above

**Admin**
- Admin login (role-based, separate from student registration)
- Manage career roles (add / edit / delete)
- Manage the master skill list (add / edit / delete)
- Assign/remove required skills to/from a career role, with priority
- Manage learning resources, linked to a skill
- View registered students and their skill profiles
- Dashboard with system-wide statistics

## 3. Technology Stack

- **Frontend:** React.js (Vite), React Router, plain CSS
- **Backend:** Node.js, Express.js, REST API
- **Database:** MySQL
- **Auth:** JWT + bcrypt password hashing, Role-Based Access Control (STUDENT / ADMIN)
- **Tools:** VS Code, Git/GitHub

## 4. System Architecture

```
React (frontend, port 5173)
        │  REST API calls (fetch, JSON, JWT in Authorization header)
        ▼
Express.js (backend, port 5000)
   routes → middleware (auth, role) → controllers → services → models
        │
        ▼
MySQL (skill_gap_system database)
```

The backend uses a layered structure:
- **routes/** – maps a URL + HTTP method to a controller function
- **middleware/** – auth check, role check, centralized error handling
- **controllers/** – reads the request, calls models/services, sends the response
- **services/** – reusable business logic (skill-gap calculation, roadmap generation)
- **models/** – raw SQL queries against MySQL (via `mysql2/promise`)

### Student workflow

```
Register/Login → Student Dashboard → Complete Profile → Add Existing Skills
  → Select Career Role → View Required Skills → Skill Gap Analysis
  → Skill Match % → Personalized Roadmap → Track Progress → Dashboard
```

### Admin workflow

```
Admin Login → Admin Dashboard
  → Career Management (CRUD)
  → Skill Management (CRUD)
  → Assign Skills to Careers (with priority)
  → Learning Resource Management (CRUD)
  → Student Management (view profiles & skills)
```

## 5. Database Design (ER overview)

```
users (1) ───── (1) student_profiles ───── (0..1) career_roles [selected_career_id]
users (1) ───── (M) student_skills ───── (1) skills
career_roles (1) ─ (M) career_required_skills ─ (1) skills   [many-to-many]
skills (1) ───── (M) learning_resources
users (1) ───── (M) roadmaps ───── (1) career_roles
roadmaps (1) ───── (M) roadmap_items ───── (1) skills
roadmap_items (1) ───── (1) progress
roadmap_items (M) ───── (0..1) learning_resources
```

**Tables:** `users`, `student_profiles`, `skills`, `career_roles`,
`career_required_skills`, `student_skills`, `learning_resources`,
`roadmaps`, `roadmap_items`, `progress`.

Full column definitions, primary/foreign keys, and constraints are in
[`database/schema.sql`](./database/schema.sql).

**Key relationships explained:**
- A **user** is either a STUDENT or an ADMIN (`users.role`).
- A STUDENT has exactly one **student_profiles** row (1-to-1), which
  optionally points at one selected **career_roles** row.
- **career_required_skills** is the many-to-many bridge between
  `career_roles` and `skills` (a career needs many skills; a skill can be
  required by many careers), with a `priority` (HIGH/MEDIUM/LOW).
- **student_skills** is the student's own version of that bridge table —
  which skills they have, and at what `status` (AVAILABLE / PARTIALLY_KNOWN / MISSING).
- A **roadmap** belongs to one student and one career. It contains many
  **roadmap_items** (one per missing/weak skill), each optionally linked
  to a **learning_resources** row, and each with its own **progress** row
  (percentage 0–100).

## 6. Skill-Gap Calculation Logic

Implemented as a pure, reusable function in
[`backend/services/skillGapService.js`](./backend/services/skillGapService.js):

```
matchPercentage = (matched required skills / total required skills) * 100
```

- A required skill counts as **matched** only if the student has it with
  status `AVAILABLE`.
- `PARTIALLY_KNOWN` and skills the student never added both count as a
  **gap** (not matched) — `PARTIALLY_KNOWN` is shown separately from
  `MISSING` so the student can see what to *improve* vs. what to *learn
  from scratch*.
- Result is rounded to 2 decimal places.

## 7. Roadmap Generation Logic

Implemented in
[`backend/services/roadmapService.js`](./backend/services/roadmapService.js):

1. Run the skill-gap calculation for the student + chosen career.
2. Combine `partiallyKnown` + `missing` skills into one gap list.
3. Sort by priority: HIGH → MEDIUM → LOW.
4. Create one roadmap item per gap skill, in that order, each carrying:
   skill, description, priority, a linked learning resource (if one
   exists for that skill), and a status (`NOT_STARTED` by default).
5. Re-generating a roadmap for the same student + career replaces the
   old one, so the roadmap always matches the latest skill-gap analysis.

Progress per item is tracked separately (0/25/50/75/100%). Reaching
100% automatically marks the item `COMPLETED`; 1–99% marks it
`IN_PROGRESS`; 0% is `NOT_STARTED`. The dashboard shows the **average**
of all item percentages as overall roadmap progress.

## 8. Folder Structure

```
project-root/
├── database/
│   ├── schema.sql        # all tables, keys, constraints
│   └── seed.sql           # career roles, skills, mappings, sample resources
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scripts/createAdmin.js
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/student/
│   │   ├── pages/admin/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## 9. API Documentation

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Creates a STUDENT account, returns JWT |
| POST | `/auth/login` | Public | Logs in STUDENT or ADMIN, returns JWT |

### Students (requires STUDENT token)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/students/profile` | Get own profile |
| PUT | `/students/profile` | Update profile |
| PUT | `/students/career` | Select/change target career |
| GET | `/students/skills` | List own skills |
| POST | `/students/skills` | Add a skill |
| PUT | `/students/skills/:id` | Update a skill's status |
| DELETE | `/students/skills/:id` | Remove a skill |

### Careers & Skills (any logged-in user)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/careers` | List all career roles |
| GET | `/careers/:id` | Career details + required skills |
| GET | `/skills` | List the master skill list |

### Skill Gap / Roadmap / Progress (STUDENT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/skill-gap/:careerId` | Run skill-gap analysis |
| GET | `/roadmap` | Get the student's latest roadmap |
| POST | `/roadmap/generate` | Generate/regenerate a roadmap (`{ careerId }`) |
| PUT | `/roadmap/items/:id` | Update a roadmap item's status |
| PUT | `/progress/:roadmapItemId` | Update progress % for a roadmap item |

### Admin (requires ADMIN token)
| Method | Endpoint | Description |
|---|---|---|
| POST/PUT/DELETE | `/admin/careers[/:id]` | Career CRUD |
| POST/PUT/DELETE | `/admin/skills[/:id]` | Skill CRUD |
| POST/DELETE | `/admin/career-skills` | Assign/remove a skill from a career |
| PUT | `/admin/career-skills/priority` | Change a required skill's priority |
| GET/POST/PUT/DELETE | `/admin/resources[/:id]` | Learning resource CRUD |
| GET | `/admin/students` | List all students |
| GET | `/admin/students/:id` | One student's profile + skills |
| GET | `/admin/stats` | Dashboard counts |

All protected routes expect: `Authorization: Bearer <token>`

## 10. Installation & Setup

### Step 1 — Install prerequisites

**Node.js (v18 or higher)** — download from [nodejs.org](https://nodejs.org)
(pick the LTS version). Verify:
```bash
node -v
npm -v
```

**MySQL Server (v8+)** — download from
[dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/)
(Windows), `brew install mysql` (Mac), or `sudo apt install mysql-server`
(Linux). During install you'll set a **root password** — remember it,
you'll need it in Step 3. Verify:
```bash
mysql --version
```

**Git** — [git-scm.com](https://git-scm.com), to manage the project.

Optional: **VS Code** with its **MySQL** extension, to browse tables visually.

### Step 2 — Get the project files

Unzip/clone the project anywhere, e.g. `Desktop/skill-gap-system/`, and
open that folder in VS Code (`code .`).

### Step 3 — Create the database

From a terminal **inside the project root**. The command differs slightly
by shell:

**Mac/Linux, or Windows Command Prompt (cmd.exe):**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

**Windows PowerShell** (the `<` redirection above isn't supported here):
```powershell
Get-Content database/schema.sql | mysql -u root -p
Get-Content database/seed.sql | mysql -u root -p
```

Either way, enter your MySQL root password when prompted. The first
command creates the `skill_gap_system` database and all 10 tables; the
second fills in the 5 career roles, 24 skills, and their mappings.

**Verify it worked:**
```bash
mysql -u root -p -e "USE skill_gap_system; SHOW TABLES;"
```
You should see all 10 table names.

### Step 4 — Backend setup

```bash
cd backend
npm install
```
This downloads Express, the MySQL driver, bcrypt, JWT, etc.

Create your real environment file:
```bash
cp .env.example .env
```
(Windows Command Prompt: `copy .env.example .env`)

Open `.env` and fill it in:

| Variable | What to put |
|---|---|
| `DB_HOST` | `localhost` (leave as-is) |
| `DB_USER` | `root` (leave as-is, unless you made a separate MySQL user) |
| `DB_PASSWORD` | **your actual MySQL root password** |
| `DB_NAME` | `skill_gap_system` (leave as-is) |
| `JWT_SECRET` | any long random string — this signs login tokens; never share it |
| `PORT` | `5000` (leave as-is unless that port is busy) |

Create your first admin account (public registration only ever creates
students, on purpose, so this is the only way to get an admin):
```bash
npm run create-admin
# or with your own values:
node scripts/createAdmin.js "Your Name" "admin@yourcollege.edu" "yourStrongPassword"
```

Start the backend:
```bash
npm run dev     # with nodemon, auto-restarts on changes
# or
npm start
```
You should see `Skill Gap API listening on http://localhost:5000`.

**Verify it's working:** open `http://localhost:5000/api/health` in a
browser — it should return `{"status":"ok", ...}`. If you see a database
error instead, your `.env` password is likely wrong, or MySQL isn't running.

### Step 5 — Frontend setup

In a **second terminal** (keep the backend running in the first):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open the printed URL (usually `http://localhost:5173`).

### Step 6 — Test the full flow

1. Register a student account from the landing page
2. Go to **My Skills** and add a few skills
3. Go to **Career Selection** and pick a role
4. Go to **Skill Gap Analysis** — check available/missing skills and match %
5. Click **Generate Personalized Roadmap**
6. Go to **Progress** and update a step's percentage
7. Logout, log back in with your **admin** credentials from Step 4 —
   you should land on the Admin Dashboard

### Test Credentials
- **Admin:** whatever you set in Step 4 (`npm run create-admin`)
- **Student:** register a new account from the app's Register page —
  any email/password works, no email verification is required

### Troubleshooting

| Problem | Fix |
|---|---|
| `ECONNREFUSED` or "Access denied" on backend start | MySQL isn't running, or `DB_PASSWORD` in `.env` is wrong |
| `ER_BAD_DB_ERROR: Unknown database` | You skipped Step 3 — run `schema.sql` again |
| Backend runs but frontend shows network errors | Confirm the backend terminal is still running on port 5000, and `frontend/.env` has `VITE_API_URL=http://localhost:5000/api` |
| "Port already in use" | Something else is using 5000 or 5173 — change `PORT` in backend `.env`, or stop the other process |
| CORS error in browser console | Make sure `CLIENT_ORIGIN` in backend `.env` matches your frontend URL exactly (`http://localhost:5173`) |
| Login works but admin pages redirect you away | You logged in with a student account — admin accounts can only be created with `npm run create-admin` |

## 11. Testing Checklist

**Authentication**
- [ ] Register a new student → redirected to student dashboard
- [ ] Register with an already-used email → rejected with a clear message
- [ ] Login with wrong password → rejected
- [ ] Access `/student/*` while logged out → redirected to `/login`
- [ ] Access `/admin/*` while logged in as a student → redirected away

**Student**
- [ ] Add / update / delete a skill
- [ ] Select a career role
- [ ] Skill-gap analysis shows correct available/partial/missing split and %
- [ ] Generate roadmap → one item per gap skill, sorted by priority
- [ ] Update progress on an item → status changes NOT_STARTED → IN_PROGRESS → COMPLETED

**Admin**
- [ ] Career CRUD (add/edit/delete)
- [ ] Skill CRUD (add/edit/delete)
- [ ] Assign/remove a required skill on a career
- [ ] Resource CRUD
- [ ] View a student's profile and skills

**Edge cases**
- [ ] Invalid input (e.g. missing fields) returns a 400 with a message
- [ ] Deleting a career a student has a roadmap for doesn't crash the app
      (cascading deletes are configured in the schema)

## 12. Screenshots Checklist (for your report/viva)

1. Landing page
2. Register / Login pages
3. Student dashboard
4. My Skills page (with a few skills added)
5. Career Selection page
6. Skill Gap Analysis results (available/partial/missing + match %)
7. Generated Roadmap
8. Progress tracking in action (before/after updating %)
9. Admin dashboard
10. Admin Career/Skill management screens
11. Admin Student Management (viewing a student's profile)
12. MySQL Workbench / CLI screenshot of the database tables

## 13. Future Scope

(Deliberately **not** built into the core version — keep these as
future-scope talking points for your viva, per the synopsis.)
- Resume parsing to auto-detect existing skills
- NLP-based skill extraction from job descriptions
- AI-based roadmap recommendations
- Integration with external learning platforms (Coursera, YouTube API, etc.)
- Dynamic, continuously-updated industry skill data
- Richer analytics (time-to-completion predictions, peer comparison)

## 14. Limitations

- Skill-gap calculation only considers binary "does the student have this
  skill" matching (AVAILABLE vs not) for the percentage — proficiency
  depth within "Available" isn't weighted.
- No email verification or password-reset flow (out of scope for a
  college mini-project).
- Learning resources are manually curated by the admin, not fetched live.
- Single learning resource per roadmap item (the oldest one added for
  that skill) — no resource ranking/recommendation logic.
