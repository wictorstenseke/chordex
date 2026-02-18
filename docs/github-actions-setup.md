# GitHub Actions Setup

## Automatic Workflow Runs on Pull Requests

By default, GitHub Actions workflows triggered by pull requests require manual approval for security reasons. This is especially true for:
- Pull requests from forks
- Pull requests from first-time contributors
- Public repositories

### Enabling Automatic Workflow Runs

To allow CI workflows to run automatically without approval:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Actions** → **General**
3. Scroll down to the **Fork pull request workflows** section
4. Select one of these options based on your security needs:
   - **Don't require approval for any contributors** - Workflows run automatically for all PRs (use with caution on public repos)
   - **Require approval for first-time contributors** - Only first-time contributors need approval
   - **Require approval for all outside collaborators** - Only trusted collaborators get auto-run

### Recommended Settings

For **private repositories** or repositories where you trust all contributors:
- Select "Don't require approval for any contributors"

For **public repositories**:
- Consider "Require approval for first-time contributors" as a balance between security and convenience
- This allows repeat contributors to have workflows run automatically while protecting against malicious first-time PRs

### Security Considerations

⚠️ **Important**: Automatically running workflows on untrusted code can expose:
- Repository secrets
- Write access to your repository
- Your CI/CD infrastructure

Only disable approval requirements if:
- The repository is private and you trust all contributors
- The repository has no sensitive secrets in workflows
- You've reviewed the security implications

### Workflow Configuration

The CI workflow (`.github/workflows/ci.yml`) has been configured with explicit permissions:
```yaml
permissions:
  contents: read
  pull-requests: read
```

These permissions ensure the workflow only has read access, minimizing potential security risks even if untrusted code runs.

## Additional Resources

- [GitHub Docs: Approving workflow runs from forks](https://docs.github.com/en/actions/managing-workflow-runs/approving-workflow-runs-from-public-forks)
- [GitHub Docs: Managing GitHub Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)
