# Rozgar Saathi

> Internal prototype for **Smart India Hackathon 2026 – Problem Statement SIH26044**: a portal for academia–industry collaboration for **skill mapping, internships and placement**.

## Features
- **Student Profile Management:** Manage academic details, education history, and upload resumes via Cloudinary.
- **Skill Assessment:** Take technical assessments to map skill proficiencies.
- **Skill Gap Analysis:** Compare current skills against industry role requirements.
- **AI Coach:** Interact with a Gemini-powered AI coach for tailored career advice and skill-building strategies.
- **Explainable Opportunity Matching:** Deterministic, explainable match scoring for opportunities based on skill coverage. The matching engine evaluates a candidate's eligibility (`>= 60%`) based on matching required skills.
- **Recruiter Workflow:** Create opportunities, view matching candidates sorted by match score, and manage shortlisting pipelines.
- **Admin Dashboard:** Manage users, monitor system health, and view aggregated reports.
- **Role-based Access:** Robust JWT-based authentication for Students, Recruiters, and Admins.

## Demo
The platform includes seed data for demonstration purposes, automatically created on a fresh database start. 
Log in with one of the seeded demo accounts (password: `Demo@123`):
- **Student 1:** `student@demo.com` (Aarav Mehta - target Backend Developer)
- **Student 2:** `student2@demo.com` (Ananya Patel - target Data Analyst)
- **Recruiter:** `recruiter@demo.com` (Riya Sharma - owns 8 opportunities)

*Note: The frontend runs at `http://localhost:3000` and the backend Swagger UI is available at `http://localhost:8080/swagger-ui.html`.*

## Technologies Used
**Backend:**
- Java 25
- Spring Boot 4.1.1 (Web MVC, Data JPA, Security, Validation, Mail)
- PostgreSQL (via JDBC) & JPA/Hibernate
- Springdoc OpenAPI (Swagger UI)
- Maven, Lombok, ModelMapper, JJWT
- JUnit 5 & Mockito for testing

**Frontend:**
- Next.js 16 (App Router)
- React 19, TypeScript 5
- Tailwind CSS v4, shadcn-style UI primitives
- Zustand 5 for state management
- Axios, Framer Motion, Lucide React

## Requirements
- **Node.js**: 20.9+
- **Java**: JDK 25
- **Database**: PostgreSQL
- **Build Tool**: Maven (embedded wrapper available)

## Installation
Clone the repository and install dependencies for both the frontend and backend.

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
The backend uses Maven wrapper, so no global Maven installation is strictly necessary.
```bash
cd backend
./mvnw clean install -DskipTests
```

## Configuration
The backend requires several environment variables to run properly. Set these in your local environment or deployment platform (e.g., Render):

```bash
export DB_USERNAME=postgres
export DB_PASSWORD=yourpassword
export JWT_SECRET="<base64 key, at least 32 bytes>"   # e.g., openssl rand -base64 48
export MAIL_USERNAME=you@gmail.com                    # needed at startup and for email flows
export MAIL_PASSWORD=yourapppassword
export BASE_URL=http://localhost:8080
export CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
export GEMINI_API_KEY=your_gemini_api_key
```
*Note: `ddl-auto` is set to `update` by default in `application.yaml`, meaning the schema is retained across restarts.*

## Usage
Start both servers to use the application locally.

**Start Backend:**
```bash
cd backend
./mvnw spring-boot:run
```
The backend API will run on `http://localhost:8080`.

**Start Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## Project Structure
Both apps live in this single monorepo but are built and run independently:

```text
.
├── frontend/            # Next.js 16 web app (React 19, TypeScript, Tailwind v4)
│   ├── src/app/
│   │   ├── page.tsx           # landing page
│   │   ├── login/             # /login
│   │   ├── register/          # /register
│   │   ├── admin/             # /admin/dashboard, /admin/users, /admin/reports
│   │   ├── student/
│   │   │   ├── profile/       # edit mode with avatar, education, and resume upload
│   │   │   ├── skills/        # catalogue + my skills + add/edit
│   │   │   ├── skill-gaps/    # AI coach and skill gap analysis
│   │   │   ├── assessments/   # take skill assessments
│   │   │   ├── opportunities/ # match sidebar + apply modal
│   │   │   └── applications/  # status table + withdraw
│   │   └── recruiter/
│   │       ├── dashboard/     # opportunities overview + stats
│   │       └── opportunities/ # create, edit, candidates ranked list
│   └── package.json
├── backend/             # Spring Boot 4 REST API (Java 25, Maven)
│   ├── src/main/java/com/general_auth
│   │   ├── auth/        # EXISTING auth layer
│   │   ├── user/        # EXISTING User/Role
│   │   ├── admin/       # EXISTING /admin/** endpoints (with new dashboard features)
│   │   ├── student/     # StudentProfile, Education, Resume, AI Coach
│   │   ├── skill/       # Skill, StudentSkill, skill catalogue, skill-gap analysis
│   │   ├── assessment/  # Assessment template/attempts, questions, answers
│   │   ├── opportunity/ # Opportunity, matching engine
│   │   ├── application/ # Student applications, recruiter status updates
│   │   ├── recruiter/   # Recruiter candidate matching view
│   │   └── common/      # exceptions, response wrapper, security helper, seed data
│   ├── src/main/resources/application.yaml
│   └── pom.xml
├── .vscode/             # VS Code workspace settings
├── package.json         # Root workspace package file
├── package-lock.json    # Root workspace lock file
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation (this file)
```

### Domain Entities
- **StudentProfile**: 1:1 with `User`. College, degree, branch, graduation year, bio, `targetRole`.
- **StudentEducation**: 1:N with `User`. Records degree, institution, passing year, and CGPA.
- **Resume**: 1:1 with `User`. Stores resume URL (uploaded via Cloudinary) and public ID.
- **Opportunity**: Job/internship/apprenticeship/project details (type, mode, status, deadline).
- **Application**: Student ↔ Opportunity mapping with application status.
- **Skill & Assessment**: Master catalogue, student's skill proficiency, assessment templates/attempts.

### Key Behaviours
- **Auth**: `accessToken` stored in `sessionStorage` via Zustand + `persist`. The Axios request interceptor attaches `Authorization: Bearer` on every `/api` call. On a `401` response the interceptor calls `logout()` and redirects to `/login`.
- **Route protection**: `RouteGuard` wraps the root layout — unauthenticated users go to `/login`; wrong-role users are bounced to their role's home.
- **Match display**: Recommended, detail and applications pages show match scores with green (≥60%) / amber (<60%) colouring plus matched ✓ / missing ✕ skill chips.

## API Documentation
All endpoints are JWT-protected (`Authorization: Bearer <accessToken>`) except `/auth/**`, `/`, and the docs.
Access the interactive API documentation (Swagger UI) at: `http://localhost:8080/swagger-ui.html`

**Key API Groups:**
- **Auth:** `/auth/register`, `/auth/login`, `/auth/refresh`
- **Student:** `/api/students/me`, `/api/students/me/education`, `/api/students/me/resume`, `/api/students/me/skill-gaps`
- **AI Coach:** `/api/ai-coach/chat`
- **Assessment:** `/api/assessments/{id}/start`, `/api/assessments/{id}/submit`
- **Opportunities:** `/api/opportunities`, `/api/opportunities/recommended`, `/api/opportunities/{id}/apply`
- **Recruiter:** `/api/recruiter/opportunities/{id}/candidates`

## Testing
Run the backend tests (23 tests — all green, no external database needed as Spring context tests run against in-memory H2):
```bash
cd backend
./mvnw test
```

## Troubleshooting / FAQ
**Q: I get a 400 error when selecting "Full-Stack Developer".**
A: The frontend target-role dropdown uses the hyphenated form, but the backend ontology uses "Full Stack Developer". Choosing the hyphenated role makes `GET /api/students/me/skill-gaps` return 400 (unknown role). This is a known quirk.

**Q: I'm suddenly getting 403 Forbidden errors.**
A: The access token lives for ~25 minutes and there is currently no silent token refresh in the frontend. If it expires, you may need to log out manually and log back in.

**Q: I registered a new account but can't log in.**
A: Registered users are created disabled and cannot log in until they click the verification link, which requires working Gmail SMTP. Use the seeded demo accounts for demonstrations.

**Q: I don't see a link to recommended opportunities in the navbar.**
A: `/student/recommended` has no dedicated navbar link; reach it from the Opportunities page.

## Contributing
This is an internal prototype built for the Smart India Hackathon 2026. External contributions are not currently being accepted.

## Roadmap
Features deliberately left for future work:
- Academician/institution portals, FDP, mentorship, research collaboration, learning-platform and certification integrations, notifications, document management, advanced analytics.
- AI/LLM-based resume→skill and JD→skill extraction, semantic skill matching.
- Proficiency/importance-weighted matching (hooks are already in place).
- Opportunity filtering/pagination, student search for recruiters, admin dashboards.
- Flyway migrations (to replace `create-drop`), silent JWT refresh in the frontend.

## License
Proprietary / Internal Prototype for Smart India Hackathon 2026.

## Authors / Contributors
- Abhi Aditya
- Karan Sardar

## Acknowledgements
Developed for the Smart India Hackathon 2026 (Problem Statement SIH26044).

## Contact
- Abhi Aditya: abhiaditya0755@gmail.com
- Karan Sardar: snsardarkaran61@gmail.com
