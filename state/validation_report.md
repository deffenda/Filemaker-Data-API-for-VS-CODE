# Validation Report

- `npm run lint -w extension` passed.
- `npm run typecheck -w extension` passed.
- `npm test -w extension` passed with 58 files / 253 tests.
- `npm run package:check -w extension` produced `artifacts/filemaker-data-api-tools-1.0.0.vsix`.
- Fresh-profile install passed via `code --user-data-dir <tmp> --extensions-dir <tmp> --install-extension artifacts/filemaker-data-api-tools-1.0.0.vsix --force`.
- `AI_VALIDATOR_BASE_REF=origin/main ./scripts/validate.sh` passed after task/artifact state updates.
