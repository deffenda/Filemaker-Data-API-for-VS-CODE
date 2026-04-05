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

### Roles

| Role | Actor | Responsibilities |
|------|-------|-----------------|
| **Planner** | Planning agent (Claude) | Produce/update plan.md, tasks.md, acceptance.md. When state is `ready_for_claude`, read tasks.md, mark current task `done`, advance `current_task.md` to next task, set state to `ready_for_codex`. If no tasks remain, set state to `done`. |
| **Codex** | Codex agent | Execute the current task. Create a PR. Set state to `ready_for_review`. When PR is accepted/merged, set state to `ready_for_claude`. |

### States

| State | Meaning | Owner |
|-------|---------|-------|
| `ready_for_claude` | PR merged and tasks remain — Claude marks finished task done, advances to next task, sets `ready_for_codex` | Claude |
| `ready_for_codex` | Current task is queued and ready for Codex to implement | Codex |
| `ready_for_review` | Codex opened a PR, waiting for GitHub CI and review | GitHub |
| `review_failed_fix_required` | CI or review found implementation issues — Codex fixes same task | Codex |
| `blocked` | Work cannot continue without intervention | Manual |
| `done` | No remaining tasks in backlog — intentional stop point | None |

### State Machine

```
ready_for_codex   →  (Codex executes, opens PR)        →  ready_for_review
ready_for_review  →  (PR accepted/merged)               →  ready_for_claude
ready_for_review  →  (PR rejected / changes requested)  →  blocked
blocked           →  (Codex addresses feedback)          →  ready_for_review
ready_for_claude  →  (Planner marks done, queues next)   →  ready_for_codex
ready_for_claude  →  (Planner marks done, no more tasks) →  done
```

### Rules

1. Planner produces plan, tasks, acceptance criteria
2. Each task maps to one PR-sized unit of work
3. Codex executes the current task, opens a PR, sets `ready_for_review`
4. PR merge is the review gate — when merged, Codex sets state to `ready_for_claude`
5. Planner reads state, marks the finished task `done` in tasks.md, advances `current_task.md` to the next task, sets `ready_for_codex`
6. If no tasks remain in the backlog, Planner sets state to `done`
7. Each task must pass lint + typecheck + test before the PR is opened
