# Current Task

task_id: 3
title: Test infrastructure — coverage config, ProxyClient, command handler, and webview snapshot tests
status: ready_for_codex
phase: 2A-2F
depends_on: none

## Files to modify/create

- `extension/vitest.config.ts` (coverage config)
- `extension/package.json` (devDependency, test:coverage script)
- `.github/workflows/ci.yml` (test:coverage in CI)
- `extension/test/unit/proxyClient.test.ts` (new)
- `extension/test/unit/commands/core.test.ts` (new)
- `extension/test/unit/commands/data.test.ts` (new)
- `extension/test/unit/commands/features.test.ts` (new)
- `extension/test/unit/webviews/htmlSnapshots.test.ts` (new)

## Next action

Codex implements Task 3 per instructions in ai/tasks.md.
