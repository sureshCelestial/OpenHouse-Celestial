# PRD Analysis: Personal Habit Tracker

Generated: 2026-07-08
Source: Habit Tracker PRD.rtf v1.0 (Draft)

## Executive Summary
Build a modern, responsive, single-user web app for creating, tracking, and motivating personal habits. No authentication in V1. Premium minimalistic UI. Live-demo MVP.

## Functional Requirements
- Create habits (name, desc, category, frequency, reminderTime, startDate)
- Edit / delete habits
- Mark habit complete once per day (idempotent)
- Auto-calculate current streak, longest streak, total completions, completion %
- Dashboard: summary cards, habit cards, weekly/monthly progress, motivation text
- Habit details page with full stats
- Search by name, filter by category/frequency, sort by name/streak/completion%/recent
- Empty state with CTA

## Non-Functional Requirements
- Responsive: desktop, tablet, mobile
- Accessible: keyboard nav, ARIA, semantic HTML, color contrast
- Secure backend: Helmet, CORS, validation, parameterized queries, error handling
- Logging: configurable levels, request/response logging
- Testing: unit + integration (Jest, React Testing Library, Supertest)

## User Roles
- Single end user (no auth, no multi-user)

## Risks
- Streak logic complexity with custom frequencies (weekdays, weekends, custom days)
- Timezone handling for "today" boundaries
- No auth means all data is shared if exposed; acceptable for MVP demo

## Assumptions
- Single-device usage (no real-time sync needed)
- PostgreSQL available via Docker
- Browser notifications for reminders out of MVP scope

## Missing Requirements / Ambiguities
- Timezone handling not specified — assume server timezone or UTC
- Data export / import not mentioned
- No user profile / settings page
- No backfill / retroactive completion
- Category extensibility: hardcoded list for MVP
- "Active Habits" metric definition unclear — assume habits with startDate <= today

## Database Entities

### habits
| column        | type        | constraints          |
|---------------|-------------|----------------------|
| id            | UUID / SERIAL | PK                |
| name          | VARCHAR(100) | NOT NULL           |
| description   | TEXT        | nullable             |
| category      | VARCHAR(50) | NOT NULL             |
| frequency     | VARCHAR(50) | NOT NULL (daily, weekdays, weekends, weekly, custom) |
| customDays    | JSONB / INT[]| nullable (bitmask or array for custom days) |
| reminderTime  | TIME        | NOT NULL             |
| startDate     | DATE        | NOT NULL             |
| createdAt     | TIMESTAMPTZ | DEFAULT now()        |
| updatedAt     | TIMESTAMPTZ | DEFAULT now()        |

### habit_completions
| column         | type        | constraints         |
|----------------|-------------|---------------------|
| id             | UUID / SERIAL | PK               |
| habitId        | FK habits   | NOT NULL, CASCADE   |
| completionDate | DATE        | NOT NULL            |
| createdAt      | TIMESTAMPTZ | DEFAULT now()       |
| UNIQUE(habitId, completionDate) |

## API List
| method | endpoint                    | description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/health                 | health check             |
| GET    | /api/habits                 | list habits (with stats) |
| POST   | /api/habits                 | create habit             |
| GET    | /api/habits/:id             | get habit details        |
| PUT    | /api/habits/:id             | update habit             |
| DELETE | /api/habits/:id             | delete habit             |
| POST   | /api/habits/:id/complete    | mark complete today      |
| DELETE | /api/habits/:id/complete    | undo today's completion  |
| GET    | /api/dashboard              | dashboard summary        |

## MVP Feature List (Demo-Ready)
1. **Backend scaffold** — Express + TS + Prisma + PostgreSQL + Docker
2. **Habit CRUD API** — create, read, update, delete with validation
3. **Completion API** — mark complete / undo, once-per-day enforcement
4. **Streak engine** — calculate current streak, longest streak, completion % on read
5. **Dashboard API** — aggregated stats endpoint
6. **Frontend scaffold** — Vite + React + TS + MUI + React Router
7. **Dashboard UI** — empty state, summary cards, habit cards with complete/edit/delete
8. **Habit Form UI** — add/edit with validation
9. **Habit Details UI** — full stats view
10. **Docker Compose** — one-command startup
11. **Unit tests** — backend services + API integration

## Out of MVP Scope
- Search & filtering (can add if time permits)
- Actual reminder notifications
- Weekly/monthly visual charts (progress bars OK)
- Data export
- Auth / multi-user
