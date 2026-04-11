# Current Task

task_id: 2
title: Fix all webview flickering and implement responsive CSS across all webviews
status: ready_for_codex
phase: 1B-1E
depends_on: Task 1 (done, merged to main)
review_failure_count: 1
last_review_failure_signature: 0e186168d5b35080d8788708405f14959d7b6dec|checks:build-test|threads:PRRT_kwDORdAZpc547k3y,PRRT_kwDORdAZpc547lKz
execution_status: idle
execution_branch:
execution_started_at:
execution_heartbeat_at:
execution_lease_expires_at:

## Files to modify

- `src/webviews/recordEditor/ui/index.js`
- `src/webviews/queryBuilder/ui/index.js`
- `src/webviews/recordViewer/ui/index.js`
- `src/webviews/scriptRunner/ui/index.js`
- `src/webviews/schemaDiff/ui/index.js`
- `src/webviews/queryBuilder/ui/styles.css`
- `src/webviews/recordEditor/ui/styles.css`
- `src/webviews/recordViewer/ui/styles.css`
- `src/webviews/scriptRunner/ui/styles.css`
- `src/webviews/schemaDiff/ui/styles.css`
- `src/webviews/queryBuilder/index.ts`
- `src/webviews/recordEditor/index.ts`
- `src/webviews/recordViewer/index.ts`
- `src/webviews/scriptRunner/index.ts`
- `src/webviews/schemaDiff/index.ts`

## Next action

Blocked on local validation: `npm run typecheck -w extension` cannot resolve `zod`.
