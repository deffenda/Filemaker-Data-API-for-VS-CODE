# Bootstrap

## Project

FileMaker Data API Tools — VS Code extension for FileMaker Data API (fmrest) workflows. Open-source, free connector.

## Current Version

0.5.1

## Target Version

0.6.0

## Goal

Hardening release with three pillars:
1. Fix webview flickering and scaling (forms flicker on state changes, don't scale well)
2. Build meaningful test coverage across untested layers (commands, webviews, ProxyClient, tree view, utilities)
3. Complete CRUD with Create Record and Delete Record

## Root Cause Analysis — Webview Flickering

All webviews use `innerHTML = ''` to wipe the DOM and rebuild from scratch on every state change. This causes:
- Visual flicker during updates
- Loss of scroll position and focus
- Layout thrashing (synchronous read-write in scroll handlers)
- Empty form flash on load (no loading states)

## Test Coverage Gaps

| Layer | Coverage |
|-------|----------|
| Utilities | ~90% |
| Core Services | ~60% |
| Commands | 0% — zero command handlers tested |
| Webviews | 0% — zero webview logic tested |
| ProxyClient | 0% — 7 methods, zero tests |
| fmExplorer tree view | 0% |
| Coverage reporting | Not configured |

## Architecture Summary

- `src/types/fm.ts` — shared type definitions
- `src/types/dataApi.ts` — Data API response envelope types
- `src/services/fmClient.ts` — HTTP client with session lifecycle
- `src/services/proxyClient.ts` — proxy mode client
- `src/commands/index.ts` — command registration (15+ command modules)
- `src/views/fmExplorer.ts` — tree view provider
- `src/webviews/*/index.ts` — webview panel controllers
- `src/webviews/*/ui/index.js` — webview UI JavaScript
- `src/webviews/*/ui/styles.css` — webview CSS
- `package.json` — extension manifest
- `test/unit/` — unit tests (vitest)
- `test/integration/` — integration tests with nock
- `vitest.config.ts` — test runner config (no coverage configured)

## Conventions (from CONTRIBUTING.md)

- TypeScript strict mode, no `any`
- Secrets never in settings/state/logs
- Use `normalizeError()` and `redact()` utilities
- Propagate AbortSignal for cancellation
- Add mocked integration tests for new endpoints
- Run lint, typecheck, test before PR

## Workflow

Role boundaries:

- Claude plans only.
- Codex implements only.
- Review happens through GitHub pull request, CI, and Gemini Code Assist on GitHub.

Canonical state model:

- `ready_for_claude` = current task is finished and Claude should mark it done, select the next task, and advance to `ready_for_codex`; OR planning or replanning is needed
- `ready_for_codex` = current task is queued and ready for Codex to implement
- `ready_for_review` = branch should be pushed or updated and reviewed through GitHub PR + CI
- `review_failed_fix_required` = review found implementation issues that Codex should fix
- `blocked` = work cannot continue without intervention
- `done` = no remaining tasks in the backlog; intentional stop point

Loop:

1. Claude creates or refines `ai/plan.md`, `ai/tasks.md`, `ai/acceptance.md`, and `state/current_task.md`.
2. Claude sets `state/controller.md` to `ready_for_codex`.
3. Codex implements the current task and runs local validation (lint, typecheck, test).
4. Codex pushes the branch, opens or updates the PR, and sets `state/controller.md` to `ready_for_review`.
5. GitHub CI and PR review determine the outcome.
6. If review finds implementation issues, set `review_failed_fix_required`.
7. Codex fixes review issues and returns to `ready_for_review`.
8. If review reveals a planning problem, set `ready_for_claude`.
9. If review passes and PR is merged:
   - If tasks remain in `ai/tasks.md` with status `pending`, set `ready_for_claude`.
   - If no tasks remain, set `done`.
   - Claude reads `ready_for_claude`, marks the finished task `done`, advances `state/current_task.md` to the next task, and sets `ready_for_codex`.
10. Each task must pass lint + typecheck + test before the PR is opened.
