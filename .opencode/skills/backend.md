# Skill: Backend Development

Trigger: API design, database schema, business logic, testing.

Capabilities:
- Scaffold Node/Express with TypeScript.
- Define Prisma schema.
- Implement Clean Architecture layers.
- Write Zod validation schemas.
- Implement streak calculation.
- Write Jest + Supertest tests.

Key Commands:
- `npx prisma migrate dev --name [name]`
- `npx prisma generate`
- `npx jest --coverage`

Patterns:
- One router per domain.
- One controller per router.
- One service per domain logic.
- One repository per entity (Prisma client acts as this).
- Centralized error middleware.
