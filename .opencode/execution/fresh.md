# Execution Plan: Fresh Start

## Phase 1: Analysis (30 min)
- [ ] Read PRD completely.
- [ ] Generate PRD_ANALYSIS.md.
- [ ] Create `.opencode/` structure.

## Phase 2: Planning (30 min)
- [ ] Create Jira Epic + Stories.
- [ ] Write architecture doc.
- [ ] Create Confluence design page.

## Phase 3: Backend Scaffold (1 h)
- [ ] Init Node + Express + TS + Prisma.
- [ ] Dockerize backend + DB.
- [ ] Write base middleware (helmet, cors, logging, errors).
- [ ] Seed test data.

## Phase 4: Backend Features (2 h)
- [ ] Habit CRUD API + tests.
- [ ] Completion API + tests.
- [ ] Streak calculation + tests.
- [ ] Dashboard API.

## Phase 5: Frontend Scaffold (1 h)
- [ ] Init Vite + React + TS + MUI.
- [ ] Dockerize frontend.
- [ ] Setup routing + API client.

## Phase 6: Frontend Features (2 h)
- [ ] Dashboard page (empty + populated).
- [ ] Habit form (add/edit).
- [ ] Habit details page.
- [ ] Responsive polish.

## Phase 7: Integration & QA (1 h)
- [ ] Wire frontend to backend.
- [ ] Run full test suite.
- [ ] Docker compose end-to-end test.
- [ ] Demo checklist.

## Definition of Done
- `docker compose up --build` starts all services.
- User can create, edit, delete, complete habits.
- Dashboard shows stats and streaks.
- Tests pass.
- No console errors.
