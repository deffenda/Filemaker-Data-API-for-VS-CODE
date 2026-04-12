# Tasks — v1.1.0: Collaboration Features

---

## T-COL-1: Shared connection profiles via workspace settings

**Status:** pending
**Depends on:** none

**Instructions:**

1. Identify which profile fields are non-secret (host, database, layout, port, version, proxyUrl, authMode).
2. Add a `contributes.configuration` section in `package.json` for `fmtools.sharedProfiles` (array of non-secret profile objects).
3. Update the profile service to merge workspace-scoped shared profiles with local profiles at load time. Shared profiles are read-only; local profiles take precedence on conflicts.
4. Add a command `fmtools.exportProfileToWorkspace` that writes the non-secret fields of the active profile to the workspace configuration.
5. Add unit tests covering: merge precedence, secret field exclusion, read-only enforcement.
6. Run lint, typecheck, test.

---

## T-COL-2: Team query library backed by git-tracked file

**Status:** pending
**Depends on:** T-COL-1

**Instructions:**

1. Define a shared query store at `.vscode/fmtools-queries.json` (workspace root). Schema: `{ version: 1, queries: SavedQuery[] }`.
2. Add a `SharedQueryStore` service that reads/writes this file and watches for external changes.
3. Add a command `fmtools.promoteQueryToShared` that copies the selected personal query to the shared store.
4. Surface shared queries in the Query Builder alongside personal queries, with a visual indicator (e.g. a "(shared)" label).
5. Add unit tests covering: load/save, external change reload, promote operation.
6. Run lint, typecheck, test.

---

## T-COL-3: Audit log export

**Status:** pending
**Depends on:** T-COL-2

**Instructions:**

1. Add a command `fmtools.exportRequestLog` that opens a QuickPick for output format (JSONL / CSV) and optional date-range filter.
2. Write the filtered request history from the existing request history store to the selected format in the workspace root (e.g. `fmtools-audit-{timestamp}.jsonl`).
3. JSONL output must match the existing batch-export field conventions. CSV output must include a header row.
4. Add unit tests for the export formatter (JSONL output, CSV output, date filter).
5. Run lint, typecheck, test.
