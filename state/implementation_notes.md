# Implementation Notes

## CHANGED

- `.github/workflows/ci.yml`
- `extension/CHANGELOG.md`
- `extension/README.md`
- `extension/docs/marketplace/explorer-overview.png`
- `extension/docs/marketplace/icon.png`
- `extension/docs/marketplace/query-builder.png`
- `extension/docs/marketplace/schema-and-batch.png`
- `extension/package.json`
- `extension/scripts/build-designer-ui-if-available.mjs`
- `state/artifacts.json`
- `state/current_task.md`
- `state/handoff.json`
- `state/implementation_notes.md`
- `state/tasks.json`
- `state/validation_report.md`

## DID

- Reclaimed the existing `codex/V1-marketplace-publishing` branch after confirming the marketplace asset work was already present and no active execution lease remained.
- Kept the Marketplace publishing work intact: publisher metadata, categories, keywords, icon, screenshots, changelog, README rewrite, and CI packaging/publish jobs.
- Added an optional `designer-ui` build gate so extension packaging reuses the existing fallback layout-mode stub when the React designer workspace is not installed locally.
- Updated `package:vsix` to use `vsce package --no-dependencies` after confirming the bundled extension artifact does not retain runtime imports for `axios`, `zod`, or other workspace packages.
- Recorded machine-readable task and artifact state so the runtime guardrails validator recognizes the task as actively implemented with real build, test, and run evidence.

## VALIDATED

- `npm run lint -w extension`
- `npm run typecheck -w extension`
- `npm test -w extension`
- `npm run package:check -w extension`
- `code --user-data-dir <tmp> --extensions-dir <tmp> --install-extension artifacts/filemaker-data-api-tools-1.0.0.vsix --force`
- `AI_VALIDATOR_BASE_REF=origin/main ./scripts/validate.sh`

## NEXT

- Push `codex/V1-marketplace-publishing`, open the V1 PR, and route it to review.
