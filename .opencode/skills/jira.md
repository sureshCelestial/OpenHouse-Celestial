# Skill: Jira Integration

Trigger: creating tickets, updating status, linking PRs.

Capabilities:
- List projects.
- Get issue types and fields.
- Create issues with proper types.
- Add comments and worklogs.
- Transition issues.
- Link issues.

Workflow:
1. Get project key and issue types.
2. Create ticket: `summary`, `description`, `issuetype`, `labels`.
3. Link to Epic with `parent` or issue link.
4. When PR created, comment ticket with PR URL.
