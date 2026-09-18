# Rozgar Saathi UI Plan

## 1. Product direction

Rozgar Saathi should feel like a calm, trustworthy employment platform: simple enough for a first-time job seeker, structured enough for employers and administrators. The interface should combine:

- **Nexus reference:** a confident, high-contrast landing page with a strong hero, restrained navigation, compact proof points, and a product-preview moment.
- **Dashboard Design Requirements reference:** a practical application shell with a persistent sidebar, clear workspace header, searchable content, lightweight analytics, and one prominent primary action.

The visual language should be modern and premium without feeling corporate or intimidating. Avoid visual clutter, excessive gradients, and dense data tables above the fold.

## 2. Design system

### Color palette

Use a light-first interface with dark brand accents and one energetic action color.

- **Canvas:** warm off-white / very light gray (`#F7F8FA`)
- **Surface:** white (`#FFFFFF`)
- **Ink:** near-black navy (`#111827`)
- **Muted text:** slate gray (`#64748B`)
- **Brand:** deep indigo / violet (`#4F46E5`)
- **Action accent:** violet-to-purple only for primary buttons and selected states
- **Success:** emerald (`#16A34A`)
- **Warning:** amber (`#D97706`)
- **Border:** cool gray (`#E2E8F0`)

Use color sparingly: most of the interface should be neutral, with indigo reserved for focus, navigation selection, links, and primary calls to action.

### Typography

- Use one modern sans-serif family throughout, preferably Geist or Inter.
- Hero headline: large, tight, and confident; use a maximum width so it wraps intentionally.
- Dashboard headings: compact and highly scannable.
- Body copy: 15–17px with relaxed line height.
- Labels and metadata: 12–14px, muted, never overly uppercase.

### Shape and depth

- Use 12–16px corner radii on cards and controls.
- Keep borders subtle and use shadows only for floating menus, dialogs, and elevated preview cards.
- Buttons should be rounded rectangles, not pill-shaped by default. Reserve pills for statuses and filters.
- Use a consistent 4px spacing scale with generous section padding.

## 3. Landing page plan

### Header

Create a slim, sticky header with a white or translucent surface:

- Left: Rozgar Saathi wordmark with a simple employment / connection mark.
- Center or right: `Find jobs`, `For employers`, `Resources`.
- Right: `Log in` as a quiet outline action and `Get started` as the filled primary action.
- On mobile: collapse links into a menu button while keeping `Get started` visible.

The header should be less than 72px tall and have a light bottom border rather than a heavy shadow.

### Hero section

Follow the Nexus composition: a short status eyebrow, an assertive two-line headline, supporting copy, and two actions.

Suggested content:

- Eyebrow: `A better way to move forward`
- Headline: `Find the work that moves you forward.`
- Supporting copy: `Rozgar Saathi connects job seekers with meaningful opportunities and helps employers build stronger teams.`
- Primary CTA: `Find your next role`
- Secondary CTA: `Explore opportunities`
- Trust line: `Helping job seekers and employers connect across India`

Place the hero in a generous two-column layout on desktop. The left side carries the message; the right side shows a polished product preview rather than a generic illustration. The preview can show a job search card with a search field, filters, and three opportunity rows.

On mobile, stack the preview below the actions and keep the first viewport focused on the headline and primary CTA.

### Proof strip

Use a compact trust strip inspired by Nexus rather than a large logo wall:

- `Verified opportunities`
- `Personalized matches`
- `Simple applications`
- `Built for growing teams`

Represent these as quiet text-and-icon items or four small stat blocks. Do not invent partner logos or unsupported claims.

### How it works

Three horizontally aligned steps on desktop, stacked on mobile:

1. **Create your profile** — Add skills, experience, preferred location, and work goals.
2. **Discover the right match** — Browse relevant roles with clear salary, location, and work-mode details.
3. **Apply with confidence** — Track applications and hear what happens next.

Each step should use a numbered marker, short title, and one concise sentence.

### Featured opportunities

Show a curated preview of real product content:

- Search / keyword input
- Location selector
- Work mode filter
- Job cards with role, company, location, salary range, tags, and `View role`

Keep the landing page preview to 3–4 cards. The full search experience belongs in the dashboard.

### Employer section

Add a contrasting dark-indigo band with a split layout:

- Heading: `Build your next great team.`
- Copy explaining that employers can publish roles, manage candidates, and track hiring progress.
- CTA: `Post a job`
- Supporting visual: a compact candidate pipeline or workflow preview.

This section should make the two-sided marketplace clear without competing with the job-seeker hero.

### Final CTA and footer

End with a focused CTA panel:

- `Your next opportunity starts here.`
- `Create a free profile and take the next step.`
- `Get started`

Footer groups:

- Product: Find jobs, Post a job, Dashboard
- Company: About, Contact, Help
- Legal: Privacy, Terms

## 4. Dashboard plan

Use the Dashboard Design Requirements reference as the structural model: a fixed sidebar, a workspace header, a searchable content area, and a clear overview page.

### Application shell

Desktop layout:

- Fixed left sidebar: 248–264px wide.
- Main content: flexible width with a maximum readable content width.
- Top workspace bar: 64–72px tall with breadcrumb, global search, notifications, and profile menu.

Mobile layout:

- Sidebar becomes a drawer.
- Top bar keeps a menu button, page title, notifications, and avatar.
- Search moves into the content area as a full-width control.

### Job seeker navigation

Primary items:

- Overview
- Find jobs
- Saved jobs
- Applications
- Profile

Secondary items:

- Career resources
- Help and support
- Settings

The selected item should use a soft indigo background, indigo icon, and dark text. Do not rely on color alone: include a visible selected background and strong text weight.

### Employer navigation

Primary items:

- Overview
- Job postings
- Candidates
- Hiring pipeline
- Analytics

Secondary items:

- Team settings
- Help and support
- Settings

Role-specific navigation should be determined by account type, but the shell should remain visually consistent.

### Dashboard overview: job seeker

Page header:

- Breadcrumb: `Dashboard / Overview`
- Heading: `Good morning, [Name]`
- Supporting text: `Here is what is happening with your job search.`
- Primary action: `Find jobs`

Top metric cards:

- Recommended jobs
- Saved jobs
- Applications sent
- Profile completion

Main content grid:

1. **Recommended for you** — Three job cards with match indicators and save actions.
2. **Application activity** — A timeline showing recently submitted, viewed, or updated applications.
3. **Profile completion** — A progress card with one next-best action, such as adding skills or uploading a resume.

Keep the first viewport action-oriented: the user should immediately see what to do next, not only statistics.

### Dashboard overview: employer

Page header:

- Breadcrumb: `Dashboard / Overview`
- Heading: `Hiring overview`
- Supporting text: `Monitor your open roles and candidate activity.`
- Primary action: `Post a job`

Top metric cards:

- Active jobs
- New applicants
- Candidates in review
- Interviews scheduled

Main content grid:

1. **Hiring pipeline** — A concise stage summary: New, Screening, Interview, Offer.
2. **Recent applicants** — Candidate rows with role, stage, date, and a clear review action.
3. **Posting performance** — Views, applications, and conversion for active roles.

### Search and filters

Mirror the reference dashboard’s prominent search control:

- Global search placeholder: `Search jobs, applications, or resources...`
- Job search filters: location, work mode, experience, salary, date posted.
- Use a horizontal filter row on desktop and a filter sheet on mobile.
- Keep active filters visible as removable chips.

### Cards, tables, and empty states

- Prefer cards for summaries and job discovery.
- Use tables only for employer applicant management where comparison matters.
- Every empty state should explain what is missing and provide one primary action.
- Every loading state should use skeleton blocks that preserve layout.
- Errors should be inline, specific, and recoverable; never show a generic blank screen.

## 5. Responsive behavior

### Desktop

- Max content width: 1280px.
- Use a 12-column grid for hero and dashboard content.
- Maintain generous whitespace around headings and section boundaries.

### Tablet

- Reduce sidebar width and collapse secondary navigation where necessary.
- Change multi-column card grids to two columns.
- Keep the global search visible if there is room.

### Mobile

- Use 16–20px page gutters.
- Stack all cards and hero content.
- Make primary actions full-width when they are the main task.
- Use bottom sheets or drawers for filters and navigation.
- Avoid horizontal scrolling except for intentionally scrollable filter chips.

## 6. Accessibility and interaction rules

- Use semantic landmarks: `header`, `nav`, `main`, `section`, and `footer`.
- Every icon-only button needs an accessible label.
- Maintain visible keyboard focus states.
- Meet WCAG AA contrast for text and controls.
- Provide text labels in addition to status colors.
- Use dialogs for destructive actions and confirm before deleting jobs, applications, or candidates.
- Preserve entered form data when validation fails.
- Use subtle transitions for navigation, cards, and drawers; avoid animation that delays core tasks.

## 7. Recommended build order

1. Establish design tokens, typography, buttons, inputs, cards, badges, and navigation primitives.
2. Build the responsive landing page and product-preview hero.
3. Build the shared dashboard shell with role-aware navigation.
4. Build the job seeker overview page.
5. Build the employer overview page.
6. Add search, filters, empty states, loading states, and error states.
7. Validate desktop and mobile screenshots against the reference composition and test keyboard navigation.

## 8. Success criteria

The finished experience should make these actions obvious within seconds:

- A job seeker can discover a role and start an application.
- A new user can understand the value of Rozgar Saathi from the landing page.
- An employer can post a job and see candidate activity.
- A returning user can understand their current progress from the dashboard overview.

The landing page should feel editorial and confident like Nexus. The dashboard should feel operational and clear like Dashboard Design Requirements. Keep the brand, spacing, typography, and action hierarchy consistent between both surfaces.
