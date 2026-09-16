# Rozgar Saathi — SIH 2026 Academia–Industry Collaboration Portal (SIH26044)

Internal prototype for **Smart India Hackathon 2026 – Problem Statement SIH26044**: a portal for
academia–industry collaboration for **skill mapping, internships and placement**.

The prototype focuses on the core student + recruiter workflow, with **skill-gap analysis and
explainable opportunity matching** as the primary demo features. It is a full-stack application —
a modular-monolith Spring Boot backend and a Next.js frontend — with no external AI or services.

```
STUDENT → Student Profile → Skill Assessment (API/Swagger) → Skill Profile → Skill Gap Analysis (API/Swagger)
       → Recommended Opportunities → Explainable Match Score → Apply
       → Recruiter views matching candidates → Recruiter shortlists
```

> **Note:** the Skill Assessment and Skill Gap Analysis features are fully implemented on the
> backend but have **no dedicated frontend pages yet** — exercise them via Swagger UI
> (`/swagger-ui.html`). Every other step in the flow has UI.

## Project structure

Both apps live in this single repository (monorepo) but are built and run independently:

```
.                        # repo root
├── backend/             # Spring Boot 4 REST API   (Java 25, Maven)
│   ├── src/main/java/com/general_auth/…    # modular-monolith packages (see Architecture)
│   ├── src/main/resources/application.yaml # DB/JWT/mail config
│   ├── src/test/java/…                     # JUnit 5 + Mockito tests (run on H2)
│   └── pom.xml
├── frontend/            # Next.js 16 web app      (React 19, TypeScript, Tailwind v4)
│   ├── src/app/…        # routes (detailed tree under Architecture → Frontend)
│   ├── src/components/… # Navbar, RouteGuard, forms, ui primitives
│   ├── src/context/…    # Zustand auth store
│   ├── src/lib/…        # axios instances + helpers
│   └── package.json
└── README.md
```

There is no shared build step or shared code — the backend runs via Maven on port 8080, the frontend
via npm on port 3000, and they talk only over HTTP (JSON + JWT).

## Tech stack

### Backend
- Java 25 (the Maven build targets 25)
- Spring Boot 4.1.1 (Web MVC, Data JPA, Security, Validation, Mail)
- Springdoc OpenAPI (Swagger UI at `/swagger-ui.html`)
- PostgreSQL (via JDBC), JPA/Hibernate with `ddl-auto: create-drop`
- Flyway is wired in as a dependency but **no migrations are checked in yet** (the schema is created by Hibernate)
- Maven, Lombok, ModelMapper 3.2.4, jjwt 0.13.0
- Tests: JUnit 5 + Mockito (the Spring context test runs against in-memory H2)

### Deploying the backend to Render with Docker

The backend has a multi-stage Dockerfile at `backend/Dockerfile`. In Render, create a **Web
Service**, select **Docker** as the runtime and set **Root Directory** to `backend`. Render builds
the image from that directory and provides a `PORT` environment variable; the image starts Spring
Boot on that port automatically.

Set the existing required environment variables (`DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`,
`MAIL_USERNAME`, `MAIL_PASSWORD`, and `BASE_URL`) in the Render service. For a persistent
deployment, also override the prototype's `create-drop` schema behaviour (for example, with
`SPRING_JPA_HIBERNATE_DDL_AUTO=update`) or add Flyway migrations before deploying.

### Frontend
- **Next.js 16** (App Router) + **React 19** + **TypeScript 5** — requires **Node.js 20.9+**
- **Zustand 5** for auth state (persisted in `sessionStorage`)
- **Axios** with a request interceptor for JWT injection (auto-logout on `401`)
- **Framer Motion** for page/component animations
- **Lucide React** for icons
- **Tailwind CSS v4** + shadcn-style UI primitives (`Button`, `Input`, `Skeleton`, `Badge`) built on
  `class-variance-authority`, `clsx`, `tailwind-merge` and `@radix-ui/react-slot`

## Architecture

### Backend — `backend/src/main/java/com/general_auth`

The backend is a modular monolith under the `com.general_auth` package:

```
com.general_auth
├── auth/          # EXISTING auth layer – reused as-is (see "Auth notes" below)
├── user/          # EXISTING User/Role + /users/me endpoints – reused as-is
├── admin/         # EXISTING /admin/** endpoints – reused as-is
├── student/       # controller, dto, entity, repository, service  → StudentProfile
├── skill/         # Skill, StudentSkill, skill catalogue, skill-gap analysis
├── assessment/    # Assessment template/attempts, questions, answers, evaluation
├── opportunity/   # Opportunity (job/internship/apprenticeship/project), matching engine
├── application/   # Student applications, statuses, recruiter status updates
├── recruiter/     # Recruiter candidate matching view
└── common/        # exceptions, response wrapper, security helper, seed data, config
```

Controllers are thin; business logic lives in services; persistence in repositories.
CORS is pre-configured for `http://localhost:3000` and `http://127.0.0.1:3000` (credentials allowed).

### Frontend — `frontend/src`

A **Next.js 16 App Router** application:

```
frontend/src/
├── app/
│   ├── page.tsx             # landing page (public)
│   ├── login/               # /login
│   ├── register/            # /register (STUDENT/RECRUITER toggle, then → /login)
│   ├── student/
│   │   ├── profile/         # /student/profile — read-only + edit mode with avatar
│   │   ├── skills/          # /student/skills — catalogue + my skills + add/edit (star rating)
│   │   ├── opportunities/   # /student/opportunities + /student/opportunities/:id (match sidebar + apply modal)
│   │   ├── recommended/     # /student/recommended — match score cards (linked from Opportunities page)
│   │   └── applications/    # /student/applications — status table + withdraw
│   └── recruiter/
│       ├── dashboard/       # /recruiter/dashboard — opportunities overview + stats
│       └── opportunities/
│           ├── new/         # /recruiter/opportunities/new — create
│           ├── [id]/edit/   # /recruiter/opportunities/:id/edit
│           └── [id]/candidates/ # /recruiter/opportunities/:id/candidates — ranked list
├── components/
│   ├── Navbar.tsx           # Role-aware top navigation ("Berozgar Saathi")
│   ├── RouteGuard.tsx       # Role-based route protection
│   ├── OpportunityForm.tsx  # Shared create/edit form for recruiters
│   └── ui/                  # Button, Input, Skeleton, Badge primitives
├── context/
│   └── AuthContext.tsx      # Zustand store — user, accessToken, setAuth, logout
└── lib/
    ├── api.ts               # Axios instances (api → /api, authApi → /auth) + typed ApiResponse
    └── utils.ts             # cn() and shared helpers
```

### Key frontend behaviours
- **Auth**: `accessToken` stored in `sessionStorage` via Zustand + `persist` (key `auth-storage`).
  The Axios request interceptor attaches `Authorization: Bearer` on every `/api` call. On a `401`
  response the interceptor calls `logout()` and redirects to `/login`.
- **Route protection**: `RouteGuard` wraps the root layout — unauthenticated users go to `/login`;
  wrong-role users are bounced to their role's home. `publicPaths`: `/`, `/login`, `/register`.
- **Profile**: read-only by default (initials avatar, academic details, bio). "Edit Profile" toggles
  an inline form that also updates the display name via `PATCH /users/me` — see *Known quirks*.
- **Inline banners**: success/error messages are dismissible (× button) and auto-dismiss after
  10 s on the profile page, with Framer Motion `AnimatePresence` transitions.
- **Match display**: recommended, detail and applications pages show match scores with
  green (≥60%) / amber (<60%) colouring plus matched ✓ / missing ✕ skill chips.

## Domain entities

| Entity | Notes |
|---|---|
| `StudentProfile` | 1:1 with existing `User` (unique). College, degree, branch, graduation year, bio, `targetRole`. |
| `Skill` | Master catalogue (unique name): `TECHNICAL` / `SOFT` / `DOMAIN`. |
| `StudentSkill` | Student's own skill (proficiency 1–5, source `ASSESSMENT`/`MANUAL`/`VERIFIED`). Unique (student, skill). |
| `Assessment` | Seeded **template** (student = null) + per-student **attempt** rows (student + `templateId`), status `STARTED`/`COMPLETED`. |
| `AssessmentQuestion` | Belongs to an assessment, targets a `Skill`, type `MULTIPLE_CHOICE`/`SHORT_ANSWER`, comma-separated options, correct answer, weight. |
| `AssessmentAnswer` | Student's answer per question, recorded score. |
| `Opportunity` | ONE entity for internships/jobs/apprenticeships/projects. Type `INTERNSHIP`/`JOB`/`APPRENTICESHIP`/`PROJECT`, work mode `REMOTE`/`HYBRID`/`ONSITE`, status `DRAFT`/`OPEN`/`CLOSED`, deadline. |
| `OpportunitySkill` | Required skill per opportunity (required proficiency 1–5, importance 1–5). Unique (opportunity, skill). |
| `Application` | Student ↔ Opportunity, status `APPLIED`/`SHORTLISTED`/`INTERVIEW`/`SELECTED`/`REJECTED`/`WITHDRAWN`. Unique (student, opportunity) prevents duplicates. |

Auth-side entities (pre-existing): `User`, `Role`, `RefreshToken`, `EmailVerificationToken`, `ForgotPasswordResetToken`.

## Matching algorithm (deterministic, explainable, no AI)

For each required skill of an opportunity, a student either has the skill (proficiency ≥ 1) or not:

```
matchScore = round( matched required skills / total required skills × 100 )
eligible   = matchScore >= 60   (OpportunityMatchingService.ELIGIBILITY_THRESHOLD)
```

- `GET /api/opportunities/{id}/match` returns the score, matched skills, missing skills, eligibility,
  and per-skill detail (`currentProficiency` vs `requiredProficiency`) so the score is fully explainable.
- **Proficiency is not part of the score yet**: a skill counts as matched at proficiency ≥ 1 even if
  below the required level (covered by a dedicated test). The service is structured so proficiency- or
  importance-weighted scoring can be added later without changing the response contract.
- Edge case: an opportunity with **no required skills scores 100%** (also covered by a test).
- Eligibility is a **UI-side rule**: the opportunity detail page disables "Apply" below 60%. The
  backend itself only blocks closed opportunities, expired deadlines and duplicate applications.

Flagship seeded scenario: student has `Java 4, Spring Boot 4, SQL 3, Git 3`; opportunity requires
`Java, Spring Boot, SQL, Git, Docker` → **80% match, missing only Docker**.
(Ananya vs *Data Analyst Intern* → 75%, missing `Power BI`.)

## Skill-gap analysis

`GET /api/students/me/skill-gaps` compares the student's skills against a small career ontology
(`RoleRequiredSkills`: **Backend Developer, Frontend Developer, Full Stack Developer, Data Analyst**,
with per-skill minimum proficiencies). It returns matched and missing skills with
`currentProficiency` vs `requiredProficiency`. Requires `targetRole` to be set on the profile first
(`PUT /api/students/me`); unknown roles return a 400 listing the supported ones.

## API summary

All endpoints are JWT-protected (`Authorization: Bearer <accessToken>`) except `/auth/**`, `/`,
and the docs (`/swagger-ui/**`, `/v3/api-docs/**`). Every response uses the existing
`ApiResponse { success, message, data }` envelope; errors use
`ApiError { timeStamp, error, status, path }`.

### Auth (existing, unchanged behaviour)
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/register` | Optional `"role": "STUDENT" \| "RECRUITER" \| "USER"` (default USER; ADMIN cannot self-register). New accounts are created **disabled** and must verify their email before logging in. |
| POST | `/auth/login` | Returns `accessToken` (10 min TTL) + `refreshToken` (90 days, HttpOnly cookie + DB) |
| POST | `/auth/refresh` | Exchanges the refresh cookie for a new access token |
| POST | `/auth/logout` | Revokes the refresh token, clears the cookie |
| POST | `/auth/forgot-password`, POST `/auth/reset-password` | Email-based reset (needs SMTP) |
| GET | `/auth/verify-email?token=` | Verifies a new account |

### User (pre-existing)
| Method | Path | Notes |
|---|---|---|
| GET | `/users/me` | any authenticated |
| PATCH | `/users/me` | body requires **both** `name` and `email` |
| DELETE | `/users/me` | soft-disable account, revoke refresh tokens |

*(No `/api` prefix — it's part of the original auth boilerplate.)*

### Admin (pre-existing, ADMIN role only)
`GET /admin/users` (paged) · `GET /admin/users/{id}` · `PATCH /admin/users/{id}/disable` · `PATCH /admin/users/{id}/enable`

### Student & skills
| Method | Path | Role |
|---|---|---|
| GET | `/api/students/me` | STUDENT |
| PUT | `/api/students/me` | STUDENT – create/update profile (set `targetRole` here) |
| GET | `/api/students/me/skill-gaps` | STUDENT |
| GET | `/api/skills` | any authenticated |
| GET / POST | `/api/students/me/skills` | STUDENT (POST body: `{skillId, proficiency, source?}`) |
| PUT | `/api/students/me/skills/{skillId}` | STUDENT |

### Assessment
| Method | Path | Role |
|---|---|---|
| GET | `/api/assessments/{id}` | STUDENT – template questions (correct answers never exposed) |
| POST | `/api/assessments/{id}/start` | STUDENT – creates/resumes the attempt |
| POST | `/api/assessments/{id}/submit` | STUDENT – evaluates, computes per-skill proficiency (1–5), upserts `StudentSkill` rows with source `ASSESSMENT`, marks attempt COMPLETED |

Submit body: `{ "answers": [ { "questionId": 1, "answer": "Spring Boot" }, ... ] }`
(Skills with zero correct answers get no `StudentSkill` row; resubmission and foreign question IDs are rejected.)

### Opportunities & matching
| Method | Path | Role |
|---|---|---|
| POST | `/api/opportunities` | RECRUITER – body includes `skills: [{skillId, requiredProficiency, importance}]` (max 30), `applicationDeadline` must be future |
| GET | `/api/opportunities` | any authenticated – non-recruiters see OPEN only, recruiters see all |
| GET | `/api/opportunities/{id}` | any authenticated – non-open returns 404 for non-recruiters |
| PUT | `/api/opportunities/{id}` | RECRUITER (owner only) |
| GET | `/api/opportunities/recommended` | STUDENT – OPEN opportunities sorted by match score desc |
| GET | `/api/opportunities/{id}/match` | STUDENT – explainable match |
| POST | `/api/opportunities/{id}/apply` | STUDENT – optional `{coverLetter}` |

### Applications & recruiter
| Method | Path | Role |
|---|---|---|
| GET | `/api/applications/me` | STUDENT – includes match score per application |
| PATCH | `/api/applications/{id}/withdraw` | STUDENT (owner) – blocked once `SELECTED`/`REJECTED` |
| PATCH | `/api/applications/{id}/status` | RECRUITER (owner of the opportunity) – e.g. `{"status":"SHORTLISTED"}`; `WITHDRAWN` is rejected |
| GET | `/api/recruiter/opportunities/{id}/candidates` | RECRUITER (owner) – sorted by match score desc |

## Seed data (created automatically on startup)

`DataSeeder` runs when the skill table is empty (i.e. every fresh start with `ddl-auto: create-drop`).

- **22 skills** (technical/soft/domain), **4 target roles** for gap analysis (Backend/Frontend/Full Stack Developer, Data Analyst)
- **1 assessment template** ("Technical Skills Assessment", 10 questions across Java, Spring Boot, SQL, Git, Docker, Communication)
- **8 opportunities** owned by the recruiter, including the flagship 80% scenario and one CLOSED:

| # | Title | Type | Company | Status |
|---|---|---|---|---|
| 1 | Backend Developer Intern *(flagship: Java, Spring Boot, SQL, Git, Docker)* | INTERNSHIP | TechNova Solutions | OPEN |
| 2 | Full Stack Developer Trainee | INTERNSHIP | CodeCraft Labs | OPEN |
| 3 | Software Engineer (Java) | JOB | TechNova Solutions | OPEN |
| 4 | Data Analyst Intern *(SQL, Python, Excel, Power BI)* | INTERNSHIP | Insight Analytics | OPEN |
| 5 | Frontend Developer Intern | INTERNSHIP | CodeCraft Labs | OPEN |
| 6 | AI Chatbot – Student Project | PROJECT | Insight Analytics | OPEN |
| 7 | Cloud Engineering Apprenticeship | APPRENTICESHIP | Nimbus Cloud | OPEN |
| 8 | Senior Backend Engineer | JOB | TechNova Solutions | CLOSED |

- **3 demo accounts** (password `Demo@123`, pre-verified):

| Email | Role | Skills / target |
|---|---|---|
| `student@demo.com` (Aarav Mehta) | STUDENT | Java 4, Spring Boot 4, SQL 3, Git 3, Communication 3 → target **Backend Developer** (IIT Bombay, B.Tech CS, grad. 2027) |
| `student2@demo.com` (Ananya Patel) | STUDENT | Python 3, SQL 3, React 3, Excel 3, Communication 4, Leadership 3 → target **Data Analyst** (VIT Vellore, B.Tech IT, grad. 2027) |
| `recruiter@demo.com` (Riya Sharma) | RECRUITER | owns all 8 opportunities |

- **3 applications** (Aarav → Backend Developer Intern + AI Chatbot project; Ananya → Data Analyst Intern)
  so the recruiter candidates screen is populated immediately.

## Running locally

### 1. Backend

1. PostgreSQL running locally with any empty database. The configured URL is
   `jdbc:postgresql://localhost:5432/AI-Vulnerability-Prioritizer` (legacy name from the
   boilerplate — change it in `backend/src/main/resources/application.yaml` if you like).
2. Set environment variables (all are required placeholders):

   ```bash
   export DB_USERNAME=postgres
   export DB_PASSWORD=yourpassword
   export JWT_SECRET="<base64 key, at least 32 bytes>"   # e.g. openssl rand -base64 48
   export MAIL_USERNAME=you@gmail.com                    # needed at startup and for email flows
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

Requires **Node.js 20.9+** (Next.js 16 requirement). The frontend expects the backend at `http://localhost:8080`.

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

**23 tests** — all green, no external database needed (the Spring context test runs against
in-memory H2 and also exercises `DataSeeder`):

- **Matching engine** (`OpportunityMatchingServiceTest`): 60% and 80% scenarios, below-threshold
  ineligibility, empty-requirements → 100%, skill below required proficiency still counts as matched.
- **Recommended sorting** (`OpportunityServiceTest`): OPEN only, sorted by score desc.
- **Skill-gap analysis** (`SkillGapServiceTest`): matched/missing per target role; missing or
  unknown target role rejected.
- **Applications** (`ApplicationServiceTest`): duplicate prevention, closed/expired cannot be
  applied to, withdraw rules (own only, not after SELECTED/REJECTED), recruiter ownership,
  recruiter cannot set WITHDRAWN, apply creates `APPLIED`.
- **Recruiter candidates** (`RecruiterServiceTest`): sorted by match score desc.
- **Assessment** (`AssessmentServiceTest`): submit evaluates answers and upserts `StudentSkill`,
  second submit rejected, foreign question rejected, start creates the attempt.
- `contextLoads` (H2 + seeder).

## Auth notes (minimal changes to the existing auth layer)

The existing auth implementation was reused as-is with only these small changes, all required to make
the prototype's authenticated endpoints work:

1. **`Role` enum**: added `STUDENT` and `RECRUITER` (existing `USER`/`ADMIN` untouched).
2. **`SignUpInputModel` + `UserService.signUp`**: optional `role` field so accounts can be created as STUDENT/RECRUITER (ADMIN not allowed).
3. **`WebSecurityConfig`**: registered the existing `JWTFilter` in the security chain (`addFilterBefore`) — it was a `@Component` but never wired into the chain, so no JWT-authenticated endpoint worked.
4. **Two pre-existing auth bug fixes** (without these, every authenticated request returned 403):
   - `JwtAuthService`: `1000*60*60*24*90` overflowed 32-bit `int` to a negative value, making refresh tokens expired on arrival → changed to `90L * 24 * 60 * 60 * 1000`.
   - `AuthService.login`: `new LoginResponse(...)` passed the tokens in the wrong order (the JSON `accessToken` actually contained the refresh token) → corrected to `(..., refreshToken, accessToken)`.
5. **`GlobalExceptionHandler`**: added handlers for `ForbiddenException` (403), `DuplicateApplicationException` (409), `MethodArgumentNotValidException` and `HttpMessageNotReadableException` (400). Existing handlers untouched.

## Known quirks in this prototype

Honest list of mismatches that exist in the current code (useful before a demo):

1. **Display-name change is broken end-to-end.** The profile page calls `PATCH /api/users/me` with
   `{ name }`, but the backend endpoint is `PATCH /users/me` (no `/api` prefix) and its DTO requires
   **both** `name` and `email` — so the request 404s. Everything else on the profile page saves fine.
2. **"Full-Stack Developer" vs "Full Stack Developer".** The frontend target-role dropdown uses the
   hyphenated form; the backend ontology uses `Full Stack Developer`. Choosing the hyphenated role
   makes `GET /api/students/me/skill-gaps` return 400 (unknown role).
3. **No silent token refresh.** The access token lives ~10 minutes. Expired/absent auth surfaces as
   **403** (Spring's default entry point), and the Axios interceptor only force-logs-out on `401` —
   so after expiry users may need to log out manually. Wiring `/auth/refresh` into a response
   interceptor is the fix.
4. **Email verification gates new signups.** Registered users are created disabled and cannot log in
   until they click the verification link — which needs working Gmail SMTP. The seeded demo accounts
   are pre-verified, so demos should use those.
5. **Assessment & skill-gap have no UI** — use Swagger UI for those two screens.
6. `/student/recommended` has no navbar link; reach it from the Opportunities page.

## Deliberately left for future work

- UI pages for the assessment flow and skill-gap analysis
- Academician/institution portals, FDP, mentorship, research collaboration, learning-platform and certification integrations, notifications, document management, advanced analytics
- AI/LLM-based resume→skill and JD→skill extraction, semantic skill matching (the deterministic engine does not depend on any AI)
- Proficiency/importance-weighted matching (hooks are already in place)
- Opportunity filtering/pagination, student search for recruiters, admin dashboards
- Flyway migrations (to replace `create-drop`), silent JWT refresh in the frontend
