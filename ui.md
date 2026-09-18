# Rozgar Saathi UI Specification

## 1. Product identity

**App name:** Rozgar Saathi  
**Meaning:** A trusted companion for finding work, building a career, and hiring the right people.  
**Brand promise:** Make the next career step clearer, simpler, and more accessible.

The product should feel trustworthy, welcoming, and useful for first-time job seekers while still being efficient for employers and administrators. Use the Nexus reference for the confident landing-page composition and the dashboard reference for the clear, operational product shell.

### Logo system

Create a simple, original Rozgar Saathi logo that works at small sizes:

- **Primary mark:** an abstract connection between two rounded forms, suggesting a person, opportunity, and supportive partnership.
- **Wordmark:** `Rozgar Saathi` set in the primary sans-serif font with medium or semibold weight.
- **Favicon/app mark:** use only the connection mark inside a rounded square; never use the full wordmark at favicon sizes.
- **Light-theme logo:** deep navy mark and wordmark, with indigo accent detail.
- **Dark-theme logo:** white wordmark and light lavender mark, with indigo accent detail.
- **App icon:** solid indigo rounded square with the mark in white; it must remain recognizable without text.
- **Logo clear space:** reserve at least the height of the mark around every side.
- Do not use unofficial partner logos, copied marketplace logos, or logo treatments that change the shape of the mark.

## 2. Shared design system

### Typography

- Use Geist or Inter throughout the product.
- Landing hero: large, tight, confident headline with a controlled max width.
- Dashboard headings: compact, scannable, and sentence case.
- Body copy: 15–17px with relaxed line height.
- Labels and metadata: 12–14px; avoid excessive all-caps text.
- Use no more than two font families and keep font weights intentional.

### Shape and depth

- Card and input radius: 12–16px.
- Button radius: 10–12px; use pills only for statuses, filters, and tags.
- Use borders for structure and shadows only for floating surfaces, dialogs, and product previews.
- Use a consistent 4px spacing scale.
- Prefer flexbox for most layouts and CSS grid for dashboard card arrangements.
- Use subtle transitions for hover, focus, menus, and drawers; never delay primary tasks with animation.

## 3. Theme tokens

Every component must support both themes through semantic tokens. Do not hardcode a light-only color directly into a component.

### Bright theme

- **Canvas:** `#F7F8FA`
- **Surface:** `#FFFFFF`
- **Elevated surface:** `#FFFFFF`
- **Primary ink:** `#111827`
- **Secondary ink:** `#475569`
- **Muted ink:** `#64748B`
- **Brand:** `#4F46E5`
- **Brand hover:** `#4338CA`
- **Brand soft:** `#EEF2FF`
- **Accent:** `#7C3AED`
- **Success:** `#15803D`
- **Warning:** `#B45309`
- **Danger:** `#B91C1C`
- **Border:** `#E2E8F0`
- **Focus ring:** `#818CF8`

Bright surfaces should be clean and airy. Use deep navy text for hierarchy, indigo for selected states and primary actions, and neutral gray for supporting content.

### Dark theme

- **Canvas:** `#0B1020`
- **Surface:** `#111827`
- **Elevated surface:** `#182235`
- **Primary ink:** `#F8FAFC`
- **Secondary ink:** `#CBD5E1`
- **Muted ink:** `#94A3B8`
- **Brand:** `#818CF8`
- **Brand hover:** `#A5B4FC`
- **Brand soft:** `#242052`
- **Accent:** `#A78BFA`
- **Success:** `#4ADE80`
- **Warning:** `#FBBF24`
- **Danger:** `#F87171`
- **Border:** `#263247`
- **Focus ring:** `#A5B4FC`

Dark surfaces should use layered navy rather than pure black. Maintain clear separation between canvas, cards, sidebar, and dialogs. Avoid low-contrast gray text and avoid large glowing gradients.

### Theme behavior

- Provide a visible theme switcher with `Light`, `Dark`, and `System` options.
- Add an accessible label: `Change theme`.
- Respect the system preference on first visit when the user has not chosen a theme.
- Persist the user’s choice through the existing application preference mechanism; do not duplicate theme state per page.
- Ensure charts, status badges, borders, focus rings, illustrations, and logos all change with the theme.
- Test every page at both themes, including empty, loading, error, dialog, and mobile states.

## 4. Landing page

### Header

Use a slim sticky header inspired by Nexus:

- Left: Rozgar Saathi logo and wordmark.
- Navigation: `Find jobs`, `For employers`, `Career resources`.
- Right actions: `Log in` and filled `Get started`.
- Theme switcher beside the account actions.
- Mobile: menu button, compact logo, theme switcher, and `Get started` remain accessible.
- Bright theme: translucent white or white header with a subtle bottom border.
- Dark theme: translucent navy header with a soft border and no heavy shadow.

### Hero

Use a high-confidence two-column layout:

- Eyebrow: `A better way to move forward`
- Headline: `Find the work that moves you forward.`
- Supporting copy: `Rozgar Saathi connects job seekers with meaningful opportunities and helps employers build stronger teams.`
- Primary CTA: `Find your next role`
- Secondary CTA: `Explore opportunities`
- Trust line: `Helping job seekers and employers connect across India`

The right side should show a product preview, not a generic stock illustration. The preview can contain a search field, filter chips, match score, and three opportunity rows. In dark mode, show the same preview with layered navy surfaces and readable contrast.

### Landing sections

1. **Trust strip:** Verified opportunities, Personalized matches, Simple applications, Built for growing teams.
2. **How it works:** Create your profile, Discover the right match, Apply with confidence.
3. **Featured opportunities:** Three or four realistic job cards with role, company, location, salary, tags, and `View role`.
4. **Employer section:** Dark-indigo or dark-theme-compatible panel with `Build your next great team`, candidate pipeline preview, and `Post a job`.
5. **Final CTA:** `Your next opportunity starts here.` with `Get started`.
6. **Footer:** Product, Company, Legal, social/contact links, theme-aware logo, and copyright.

Never invent partner or customer logos. If logo placeholders are needed in a prototype, label them as illustrative rather than implying endorsement.

## 5. Shared dashboard shell

Use the dashboard reference as the foundation for every authenticated workspace.

### Desktop shell

- Fixed sidebar: 248–264px.
- Sidebar top: Rozgar Saathi app logo and current workspace/account label.
- Main content: flexible width with a max readable width of approximately 1280px.
- Top bar: 64–72px with breadcrumb, global search, notifications, theme switcher, and profile menu.
- Sidebar and top bar must use separate surface tokens so they remain distinct in both themes.

### Mobile shell

- Sidebar becomes an accessible drawer.
- Top bar contains menu button, page title, theme switcher, notifications, and avatar.
- Global search moves below the page heading as a full-width control.
- Keep the primary action visible without requiring horizontal scrolling.

### Job seeker navigation

Primary: `Overview`, `Find jobs`, `Saved jobs`, `Applications`, `Profile`  
Secondary: `Career resources`, `Help and support`, `Settings`

### Employer navigation

Primary: `Overview`, `Job postings`, `Candidates`, `Hiring pipeline`, `Analytics`  
Secondary: `Team settings`, `Help and support`, `Settings`

### Admin navigation

Primary: `Overview`, `Users`, `Jobs`, `Applications`, `Reports`  
Secondary: `Moderation`, `Support`, `System settings`

Selected navigation must use a soft brand background, strong text, selected icon treatment, and a visible indicator. Never rely on color alone.

## 6. Dashboard pages

### A. Job seeker overview

Header: `Good morning, [Name]`  
Supporting text: `Here is what is happening with your job search.`  
Primary action: `Find jobs`

Metric cards:

- Recommended jobs
- Saved jobs
- Applications sent
- Profile completion

Content:

- **Recommended for you:** three job cards with match indicators and save actions.
- **Application activity:** timeline of submitted, viewed, interview, and outcome events.
- **Profile completion:** progress bar with one next-best action, such as adding skills or uploading a resume.

### B. Find jobs

- Prominent search: `Search job title, skill, or company`.
- Location search and filters: work mode, experience, salary, date posted.
- Results list with save action, match score, tags, and `View role`.
- Bright theme uses white cards on a soft gray canvas; dark theme uses elevated navy cards on a deep navy canvas.
- Empty state: explain the absence of results and offer `Clear filters` or `Create a job alert`.

### C. Job details and application flow

- Job title, company, location, salary, work mode, posting date, and verified status.
- Clear primary action: `Apply now`.
- Sticky apply action on mobile.
- Application form should preserve entered data after validation errors.
- Confirmation state should show the next step and link back to `Applications`.

### D. Saved jobs

- List or card view toggle.
- Saved date, closing date if available, and `Apply` action.
- Empty state: `Save roles you want to revisit` with `Find jobs` CTA.

### E. Applications

- Summary cards for Applied, In review, Interview, Offer, and Closed.
- Application table on desktop and stacked cards on mobile.
- Timeline/status labels must include text, not only color.
- Filters: status, date applied, company.

### F. Profile

- Completion percentage and profile strength.
- Sections: personal details, skills, experience, education, preferred work, resume.
- One clear `Edit profile` or section-level action at a time.
- Use progressive disclosure so the page does not feel like one long form.

### G. Employer overview

Header: `Hiring overview`  
Supporting text: `Monitor your open roles and candidate activity.`  
Primary action: `Post a job`

Metric cards:

- Active jobs
- New applicants
- Candidates in review
- Interviews scheduled

Content:

- **Hiring pipeline:** New, Screening, Interview, Offer.
- **Recent applicants:** candidate, role, stage, date, and `Review`.
- **Posting performance:** views, applications, and conversion for active roles.

### H. Job postings

- Tabs or filters for Active, Draft, Paused, and Closed.
- Table columns: role, location, applicants, status, updated, actions.
- Primary action: `Post a job`.
- Empty state should help the employer create the first posting.

### I. Candidates and hiring pipeline

- Candidate table with search, role filter, stage filter, and bulk-safe actions.
- Pipeline board with accessible stage labels and a list alternative for keyboard and mobile users.
- Candidate detail drawer or page with resume, profile, notes, and activity.
- Destructive actions require confirmation.

### J. Analytics

- Date range selector and export action.
- KPI cards: job views, applications, qualified candidates, time to review.
- Use charts with text summaries and accessible legends.
- Charts need theme-aware grid lines, labels, tooltips, and contrast.

### K. Admin overview

- System KPIs: active users, active jobs, applications, pending moderation.
- Moderation queue with priority/status filters.
- Recent support activity and system health summary.
- Admin controls should be visually distinct from normal user actions and require confirmation for destructive changes.

## 7. Components and states

Build reusable primitives for logo, theme switcher, sidebar, top bar, cards, buttons, inputs, search, filters, badges, tabs, tables, timelines, charts, dialogs, drawers, toasts, skeletons, and empty states.

Every feature must define:

- Bright and dark appearance.
- Default, hover, focus, disabled, loading, success, and error states.
- Mobile behavior.
- Keyboard navigation and accessible labels.

## 8. Accessibility and responsive rules

- Use semantic `header`, `nav`, `main`, `section`, and `footer` landmarks.
- Every icon-only button needs an accessible label.
- Maintain visible keyboard focus states in both themes.
- Meet WCAG AA contrast for text and controls.
- Use text labels alongside status colors.
- Use 16–20px mobile gutters and a 1280px desktop content maximum.
- Stack cards on mobile; use drawers or bottom sheets for filters and navigation.
- Avoid horizontal scrolling except for intentionally scrollable filter chips.

## 9. Recommended implementation order

1. Define semantic light/dark theme tokens and typography.
2. Create the Rozgar Saathi logo mark, wordmark, favicon, and app icon variants.
3. Build shared buttons, cards, inputs, badges, theme switcher, and navigation primitives.
4. Build the landing page with the Nexus-inspired hero and product preview.
5. Build the shared responsive dashboard shell.
6. Build job seeker overview, jobs, applications, saved jobs, and profile pages.
7. Build employer overview, job postings, candidates, pipeline, and analytics pages.
8. Build the admin overview, moderation, users, jobs, and reports pages.
9. Add loading, empty, error, dialog, mobile, and keyboard states.
10. Validate every route in both bright and dark themes at desktop and mobile widths.

## 10. Success criteria

The finished UI should make these actions obvious within seconds:

- A visitor understands Rozgar Saathi and can start finding work.
- A job seeker can discover a role, save it, and start an application.
- An employer can post a job and review candidate activity.
- An administrator can monitor users, jobs, applications, and moderation.
- A returning user can understand progress from the dashboard overview.
- The same app identity, logo system, navigation language, and action hierarchy are consistent in bright and dark themes.

The landing page should feel editorial and confident like Nexus. The dashboard should feel operational and clear like Dashboard Design Requirements. Both should unmistakably belong to Rozgar Saathi.
