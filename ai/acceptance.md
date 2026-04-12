# Acceptance Criteria — v1.1.0: Collaboration Features

## T-COL-1: Shared connection profiles

- [ ] `fmtools.sharedProfiles` workspace setting is declared in `package.json` contributes.configuration
- [ ] Secret fields (username, password, token) are never written to workspace settings
- [ ] Shared profiles appear in the profile picker alongside local profiles, with a visual indicator
- [ ] Local profile values take precedence over shared profile values on key conflicts
- [ ] `fmtools.exportProfileToWorkspace` command writes only non-secret fields to workspace config
- [ ] Unit tests pass: merge precedence, secret exclusion, read-only enforcement
- [ ] `npm run lint`, `npm run typecheck`, `npm test` — all clean

## T-COL-2: Team query library

- [ ] `.vscode/fmtools-queries.json` is created when the first shared query is promoted
- [ ] File schema: `{ version: 1, queries: SavedQuery[] }`
- [ ] `fmtools.promoteQueryToShared` command copies a personal query to the shared store
- [ ] Shared queries appear in the Query Builder with a "(shared)" label
- [ ] External edits to the shared file are reflected in the UI without a window reload
- [ ] Unit tests pass: load/save round-trip, external change reload, promote operation
- [ ] `npm run lint`, `npm run typecheck`, `npm test` — all clean

## T-COL-3: Audit log export

- [ ] `fmtools.exportRequestLog` command is available in the command palette
- [ ] User can select JSONL or CSV output format
- [ ] User can optionally filter by date range
- [ ] JSONL output fields match the existing batch-export field conventions
- [ ] CSV output includes a header row
- [ ] Output file is written to the workspace root with a timestamped filename
- [ ] Unit tests pass: JSONL formatter, CSV formatter, date-range filter
- [ ] `npm run lint`, `npm run typecheck`, `npm test` — all clean
