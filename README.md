# SIH 2026 – Portal for Academia–Industry Collaboration (SIH26044)

Internal prototype for **Smart India Hackathon 2026 – Problem Statement SIH26044**: a portal for
academia–industry collaboration for **skill mapping, internships and placement**.

The prototype focuses on the core student + recruiter workflow, with **skill-gap analysis and
explainable opportunity matching** as the primary demo features. It is a full-stack application —
a modular-monolith Spring Boot backend and a Next.js frontend — with no external AI or services.

```
STUDENT → Student Profile → Skill Assessment → Skill Profile → Skill Gap Analysis
       → Recommended Opportunities → Explainable Match Score → Apply
       → Recruiter views matching candidates → Recruiter shortlists
```

## Tech stack

### Backend
- Java 21+ (project compiles on Java 25)
- Spring Boot 4.1.x (Web MVC, Data JPA, Security, Validation, Mail)
- PostgreSQL (via JDBC), JPA/Hibernate
- Maven, Lombok, ModelMapper, jjwt
- Springdoc OpenAPI (Swagger UI at `/swagger-ui.html`)
- Tests: JUnit 5 + Mockito (unit tests run against in-memory H2)

### Frontend
- **Next.js 15** (App Router) + **TypeScript**
- **Zustand** for auth state management (persisted in `sessionStorage`)
- **Axios** with request interceptors for JWT injection and 401/403 auto-logout
- **Framer Motion** for page/component animations
- **Lucide React** for icons
- **Radix UI** primitives (Button, Input, Skeleton, Badge)
- Vanilla CSS (globals) with Tailwind CSS utility classes

## Architecture

Modular monolith under `com.general_auth`:

```
com.general_auth
├── auth/          # EXISTING auth layer – reused as-is (see "Auth notes" below)
├── user/          # EXISTING User/Role – reused as-is
├── student/       # controller, dto, entity, repository, service  → StudentProfile
├── skill/         # Skill, StudentSkill, skill catalogue, skill-gap analysis
├── assessment/    # Assessment template/attempts, questions, answers, evaluation
├── opportunity/   # Opportunity (job/internship/apprenticeship/project), matching engine
├── application/   # Student applications, statuses, recruiter status updates
├── recruiter/     # Recruiter candidate matching view
└── common/        # exceptions, response wrapper, security helper, seed data
```

Controllers are thin; business logic lives in services; persistence in repositories.

## Domain entities

| Entity | Notes |
|---|---|
| `StudentProfile` | 1:1 with existing `User` (unique). College, degree, branch, graduation year, bio, `targetRole`. |
| `Skill` | Master catalogue (unique name): `TECHNICAL` / `SOFT` / `DOMAIN`. |
| `StudentSkill` | Student's own skill (proficiency 1–5, source `ASSESSMENT`/`MANUAL`/`VERIFIED`). Unique (student, skill). |
| `Assessment` | Seeded **template** (student = null) + per-student **attempt** rows (student + `templateId`), status `STARTED`/`COMPLETED`. |
| `AssessmentQuestion` | Belongs to an assessment, targets a `Skill`, has options/correct answer/weight. |
| `AssessmentAnswer` | Student's answer per question, recorded score. |
| `Opportunity` | ONE entity for internships/jobs/apprenticeships/projects. Type, work mode, status (`DRAFT`/`OPEN`/`CLOSED`), deadline. |
| `OpportunitySkill` | Required skill per opportunity (required proficiency 1–5, importance 1–5). Unique (opportunity, skill). |
| `Application` | Student ↔ Opportunity, status `APPLIED`/`SHORTLISTED`/`INTERVIEW`/`SELECTED`/`REJECTED`/`WITHDRAWN`. Unique (student, opportunity) prevents duplicates. |

## Matching algorithm (deterministic, explainable, no AI)

For each required skill of an opportunity, a student either has the skill (proficiency ≥ 1) or not:

```
matchScore = round( matched required skills / total required skills × 100 )
eligible   = matchScore >= 60   (threshold constant in OpportunityMatchingService)
```

`GET /api/opportunities/{id}/match` returns the score, matched skills, missing skills, eligibility,
and per-skill proficiency details (`currentProficiency` vs `requiredProficiency`) so the score is
fully explainable. The service is structured so proficiency- or importance-weighted scoring can be
added later without changing the response contract.

Flagship seeded scenario: student has `Java, Spring Boot, SQL, Git`; opportunity requires
`Java, Spring Boot, SQL, Git, Docker` → **80% match, missing only Docker**.

## API summary

All endpoints are JWT-protected (`Authorization: Bearer <accessToken>`) except `/auth/**` and docs.

### Auth (existing, unchanged behaviour)
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | Optional `"role": "STUDENT" \| "RECRUITER" \| "USER"` (default USER; ADMIN cannot self-register) |
| POST | `/auth/login` | Returns `accessToken` + `refreshToken` (HttpOnly cookie) |
| POST | `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, GET `/auth/verify-email` | existing |

### Student & skills
| Method | Path | Role |
|---|---|---|
| GET | `/api/students/me` | STUDENT |
| PUT | `/api/students/me` | STUDENT – create/update profile (set `targetRole` here) |
| GET | `/api/students/me/skill-gaps` | STUDENT |
| GET | `/api/skills` | any authenticated |
| GET / POST | `/api/students/me/skills` | STUDENT |
| PUT | `/api/students/me/skills/{skillId}` | STUDENT |

### Assessment
| Method | Path | Role |
|---|---|---|
| GET | `/api/assessments/{id}` | STUDENT – template questions (answers never exposed) |
| POST | `/api/assessments/{id}/start` | STUDENT |
| POST | `/api/assessments/{id}/submit` | STUDENT – evaluates, computes skill scores, updates `StudentSkill` |

Submit body: `{ "answers": [ { "questionId": 1, "answer": "Spring Boot" }, ... ] }`

### Opportunities & matching
| Method | Path | Role |
|---|---|---|
| POST | `/api/opportunities` | RECRUITER – body includes `skills: [{skillId, requiredProficiency, importance}]` |
| GET | `/api/opportunities` | any authenticated – students see OPEN only, recruiters see all |
| GET | `/api/opportunities/{id}` | any authenticated |
| PUT | `/api/opportunities/{id}` | RECRUITER (owner) |
| GET | `/api/opportunities/recommended` | STUDENT – OPEN opportunities sorted by match score desc |
| GET | `/api/opportunities/{id}/match` | STUDENT – explainable match |
| POST | `/api/opportunities/{id}/apply` | STUDENT |

### Applications & recruiter
| Method | Path | Role |
|---|---|---|
| GET | `/api/applications/me` | STUDENT – includes match score per application |
| PATCH | `/api/applications/{id}/withdraw` | STUDENT (owner) |
| PATCH | `/api/applications/{id}/status` | RECRUITER (owner of the opportunity) – e.g. `{"status":"SHORTLISTED"}` |
| GET | `/api/recruiter/opportunities/{id}/candidates` | RECRUITER (owner) – sorted by match score desc |

All responses use the existing `ApiResponse { success, message, data }` envelope; errors use `ApiError`.

## Seed data (created automatically on startup)

`DataSeeder` runs when the database is empty (fresh `ddl-auto: create-drop`).

- **22 skills** (technical/soft/domain), **4 target roles** (Backend/Frontend/Full-Stack Developer, Data Analyst) with required skills
- **3 demo accounts** (password `Demo@123`):

| Email | Role | Skills / target |
|---|---|---|
| `student@demo.com` (Aarav Mehta) | STUDENT | Java 4, Spring Boot 4, SQL 3, Git 3 → target **Backend Developer** |
| `student2@demo.com` (Ananya Patel) | STUDENT | Python, SQL, React, Excel, Communication, Leadership → target **Data Analyst** |
| `recruiter@demo.com` (Riya Sharma) | RECRUITER | owns 8 opportunities |

- **8 opportunities** with required skills, including the flagship 80% scenario and a CLOSED one
- **1 assessment template** (10 questions across Java, Spring Boot, SQL, Git, Docker, Communication)
- **3 applications** so the recruiter candidates screen is populated immediately

## Frontend architecture

The frontend lives in `frontend/` and is a **Next.js 15 App Router** application:

```
frontend/src/
├── app/
│   ├── login/               # /login
│   ├── register/            # /register
│   ├── student/
│   │   ├── profile/         # /student/profile — read-only + edit mode with avatar
│   │   ├── skills/          # /student/skills — catalogue + my skills + add/edit
│   │   ├── opportunities/   # /student/opportunities + /student/opportunities/:id
│   │   ├── recommended/     # /student/recommended — match score cards
│   │   └── applications/    # /student/applications — apply, withdraw, status
│   └── recruiter/
│       ├── dashboard/       # /recruiter/dashboard — opportunities overview
│       └── opportunities/
│           ├── new/         # /recruiter/opportunities/new — create
│           ├── [id]/edit/   # /recruiter/opportunities/:id/edit
│           └── [id]/candidates/ # /recruiter/opportunities/:id/candidates — ranked list
├── components/
│   ├── Navbar.tsx           # Role-aware top navigation bar
│   ├── RouteGuard.tsx       # Role-based route protection
│   ├── OpportunityForm.tsx  # Shared create/edit form for recruiters
│   └── ui/                  # Button, Input, Skeleton, Badge primitives
├── context/
│   └── AuthContext.tsx      # Zustand store — user, accessToken, setAuth, logout
└── lib/
    ├── api.ts               # Axios instances (api → /api, authApi → /auth)
    └── utils.ts             # Shared helpers
```

### Key frontend behaviours
- **Auth**: `accessToken` stored in `sessionStorage` via Zustand + `persist`. Axios request interceptor attaches `Authorization: Bearer` header on every `/api` call. On `401` response, the interceptor calls `logout()` and redirects to `/login`.
- **Route protection**: `RouteGuard` wraps each layout — unauthenticated users are sent to `/login`; wrong-role users are redirected to their home.
- **Profile**: Defaults to a read-only view (circular avatar, academic details, bio). "Edit Profile" button toggles an inline edit form that can also change the display name via `PATCH /api/users/me`.
- **Toast notifications**: Success/error messages auto-dismiss after 10 seconds and have an `×` close button with Framer Motion `AnimatePresence` transitions.
- **Match display**: Recommended and detail pages show match score with green (≥60%) / amber (<60%) badges, plus matched/missing skill chips.

## Running locally

### 1. Backend

1. PostgreSQL running locally with a database (default URL: `jdbc:postgresql://localhost:5432/AI-Vulnerability-Prioritizer` — adjust in `backend/src/main/resources/application.yaml` if needed).
2. Set environment variables:
   ```bash
   export DB_USERNAME=postgres
   export DB_PASSWORD=yourpassword
   export JWT_SECRET="<base64 key, at least 32 bytes>"   # e.g. openssl rand -base64 48
   export MAIL_USERNAME=you@gmail.com                    # only needed for email flows
   export MAIL_PASSWORD=yourapppassword
   export BASE_URL=http://localhost:8080
   ```
3. Run:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
4. Open Swagger UI: http://localhost:8080/swagger-ui.html

> `ddl-auto` is `create-drop` for the prototype, so the schema + seed data are recreated on every restart.

### 2. Frontend

Requires Node.js 18+. The frontend expects the backend at `http://localhost:8080`.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Log in with one of the seeded demo accounts (password `Demo@123`):

| Email | Role |
|---|---|
| `student@demo.com` | STUDENT (Aarav Mehta) |
| `student2@demo.com` | STUDENT (Ananya Patel) |
| `recruiter@demo.com` | RECRUITER (Riya Sharma) |

## Testing

```bash
cd backend
./mvnw test
```

23 tests cover: the matching engine (60% and 80% scenarios, eligibility threshold), recommended
opportunity sorting, skill-gap analysis, duplicate-application prevention, recruiter ownership,
application withdraw rules, and assessment → `StudentSkill` updates. The Spring context test runs
against in-memory H2 (`src/test/resources/application.yaml`), so `mvn test` needs no database.

## Auth notes (minimal changes to the existing auth layer)

The existing auth implementation was reused as-is with only these small changes, all required to make
the prototype's authenticated endpoints work:

1. **`Role` enum**: added `STUDENT` and `RECRUITER` (existing `USER`/`ADMIN` untouched).
2. **`SignUpInputModel` + `UserService.signUp`**: optional `role` field so accounts can be created as STUDENT/RECRUITER (ADMIN not allowed).
3. **`WebSecurityConfig`**: registered the existing `JWTFilter` in the security chain (`addFilterBefore`) — it was a `@Component` but never wired into the chain, so no JWT-authenticated endpoint worked.
4. **Two pre-existing auth bug fixes** (without these, every authenticated request returned 403):
   - `JwtAuthService`: `1000*60*60*24*90` overflowed 32-bit `int` to a negative value, making refresh tokens expired on arrival → changed to `90L * 24 * 60 * 60 * 1000`.
   - `AuthService.login`: `new LoginResponse(..., accessToken, refreshToken)` passed the tokens in the wrong order (the JSON `accessToken` actually contained the refresh token) → corrected to `(..., refreshToken, accessToken)`.
5. **`GlobalExceptionHandler`**: added handlers for `ForbiddenException` (403), `DuplicateApplicationException` (409), `MethodArgumentNotValidException` and `HttpMessageNotReadableException` (400). Existing handlers untouched.

## Deliberately left for future work

- Academician/institution portals, FDP, mentorship, research collaboration, learning-platform and certification integrations, notifications, document management, advanced analytics
- AI/LLM-based resume→skill and JD→skill extraction, semantic skill matching (the deterministic engine does not depend on any AI)
- Proficiency/importance-weighted matching (hooks are already in place)
- Opportunity filtering/pagination, student search for recruiters, admin dashboards
