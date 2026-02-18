# Security & dependency scanning (Snyk)

## One-time setup

1. Create a free account at [snyk.io](https://snyk.io).
2. From the project root, run:
   ```bash
   npx snyk auth
   ```
   Follow the browser prompt to log in and link this machine.

## Commands

| Script | Purpose |
|--------|--------|
| `npm run security:test` | Scan dependencies for vulnerabilities (run locally or in CI). |
| `npm run security:monitor` | Snapshot the current dependency tree to Snyk for ongoing monitoring and alerts. |

## Usage

- **Before releases or PRs:** run `npm run security:test`. Fix or accept reported issues.
- **After major dependency changes:** run `npm run security:monitor` to update the project in Snyk’s dashboard.
- **CI:** Add `npm run security:test` to your pipeline; use `SNYK_TOKEN` for non-interactive auth.

Both root and `frontend/` are scanned when you run from the repo root (Snyk follows the workspace).
