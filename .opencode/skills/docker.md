# Skill: Docker & DevOps

Trigger: containerization, local orchestration, health checks.

Capabilities:
- Multi-stage Dockerfiles.
- Docker Compose with depends_on and healthcheck.
- Environment variable management.

Patterns:
- `backend/Dockerfile`: build stage + runtime stage.
- `frontend/Dockerfile`: build stage + nginx stage.
- `docker-compose.yml`: app, api, db services.
- `.env.example` with all required vars.
