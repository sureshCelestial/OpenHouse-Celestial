# Execution Plan: Resume Session

## Context Recovery
1. Read `PRD_ANALYSIS.md` for current state.
2. Check `.opencode/execution/fresh.md` for phase progress.
3. Review latest git log for completed work.
4. Check Jira for open tickets.

## Resume Rules
- Never re-scaffold if directories exist.
- Reuse generated types and schemas.
- Run tests before continuing to catch regressions.
- Update `PRD_ANALYSIS.md` if scope changed.

## Quick Health Check
```bash
cd backend && npm test
cd frontend && npm test
docker compose ps
```
