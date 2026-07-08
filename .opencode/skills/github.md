# Skill: GitHub Integration

Trigger: creating PRs, reviewing diffs, managing branches.

Capabilities:
- Create branches.
- Commit with conventional commits.
- Create PRs with Jira references.
- View PR status.

Workflow:
1. `git checkout -b feature/HT-XX-desc`
2. Implement.
3. `git commit -m "feat(HT-XX): desc

Resolves HT-XX"`
4. `gh pr create --title "feat(HT-XX): desc" --body "Resolves HT-XX"`
5. Jira auto-links when description contains `Resolves HT-XX`.
