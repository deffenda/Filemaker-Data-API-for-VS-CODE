# FileMaker Data API Tools for VS Code

A free, open-source VS Code extension for working with the FileMaker Data API (`fmrest`). Connect to FileMaker servers, browse layouts and metadata, run queries, create/edit/delete records, run scripts, compare environments, and run batch jobs — all from within VS Code.

No telemetry. No account required.

## Install

### From VSIX

1. Download or build `filemaker-data-api-tools-1.0.0.vsix`.
2. Open VS Code.
3. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`).
4. Run **Extensions: Install from VSIX...** and select the file.
5. Reload when prompted.

### From Source

```bash
npm install
npm run build
npm test
```

1. Open this project in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. Run **FileMaker: Add Connection Profile** from Command Palette.

### Verify Installation

1. Run **FileMaker: Add Connection Profile** from Command Palette.
2. Confirm the **FileMaker Explorer** view appears in the sidebar.
3. Run **FileMaker: Open Query Builder** and verify the layout picker loads.

## Features

### Records (Full CRUD)

- **Find records** with JSON query syntax or the visual Query Builder
- **Get record** by ID
- **Create record** with field validation and confirmation
- **Edit record** with draft preview, patch JSON, and save confirmation
- **Delete record** with confirmation dialog (blocked for viewer role and untrusted workspaces)
- **Duplicate record** preparation with auto-enter field filtering

### Query & Search

- **Query Builder** webview with layout picker, sort, limit/offset, and export (JSON, CSV)
- **Saved Queries** with workspace/global scope, import/export, and explorer integration
- **Compound find queries** with multiple request rows and omit support
- **Copy as curl/fetch** with auth header redaction

### Schema & Metadata

- **Field metadata browser** under each layout in the explorer
- **Value lists** extracted from layout metadata and displayed in the explorer
- **Schema snapshots** with versioning, diffing, and drift detection
- **Schema diff webview** with added/removed/changed field sections
- **TypeScript type generation** from layout metadata
- **Container field detection** and URL resolution

### Scripts

- **Script Runner** webview with layout/context selection and parameter input
- Script result display and copy-as helpers

### Portal & Related Records

- **Portal data extraction** from records with field name parsing
- **Portal metadata parsing** from layout info
- **Portal-aware request parameters** with per-portal limit and offset

### Batch Operations

- **Batch export** with pagination (JSONL or CSV output)
- **Batch update** from CSV/JSON with dry-run default and concurrency control
- Job progress tracking, cancellation, and status bar integration

### Global Fields

- **Global field payload builder** for pre-request globals
- **Global field parser** for reading globals from request bodies
- Field name validation

### Enterprise

- **Environment sets** for grouped profile workflows
- **Cross-environment comparison** with layout presence matrix and field-level drift
- **Role-based access control** (viewer/developer/admin)
- **Enterprise config** via `.vscode/filemaker.config.json`
- **Offline metadata mode** with persistent cache

### Diagnostics

- **Request metrics** (latency, success/failure, re-auth, cache hits)
- **Diagnostics dashboard** webview
- **Request history** viewer
- **Request tracing** with unique request IDs

### Other

- **Plugin registry** for safe extension points
- **Workspace trust** integration (high-risk features disabled in untrusted workspaces)
- **Loading skeletons** on all webviews (no empty form flash)
- **Responsive CSS** with fluid scaling and ARIA accessibility attributes

## Connection Profiles

Two authentication modes:

- **Direct** — extension connects to the FileMaker Data API directly
- **Proxy** — extension connects through your proxy endpoint (recommended for teams)

Profile fields: `serverUrl`, `database`, `authMode`, `username` (direct), `apiBasePath`, `apiVersionPath`, `proxyEndpoint` (proxy).

Passwords and API keys are stored in VS Code `SecretStorage` (platform-level encryption). No credentials are written to settings or state files.

## Security

- Credentials stored only in `SecretStorage`
- Webviews never call FileMaker endpoints directly — all API calls go through extension services
- CSP nonces on all webview scripts and styles
- Logs, history, and diagnostics use redaction (no passwords, tokens, or record payloads)
- Copy-as snippets redact authorization headers by default
- Role guard + workspace trust + offline mode block unsafe write paths

## Settings

| Setting | Description |
|---------|------------|
| `filemakerDataApiTools.requestTimeoutMs` | HTTP request timeout (default 15s) |
| `filemaker.logging.level` | Log level: debug, info, warn, error |
| `filemaker.savedQueries.scope` | Saved queries scope: workspace or global |
| `filemaker.schema.cacheTtlSeconds` | Metadata cache TTL |
| `filemaker.schema.snapshots.storage` | Snapshot storage: workspaceState or workspaceFiles |
| `filemaker.schema.diagnostics.enabled` | Publish schema diffs to Problems panel |
| `filemaker.typegen.outputDir` | TypeScript output folder |
| `filemaker.batch.maxRecords` | Max records for batch export |
| `filemaker.batch.concurrency` | Batch concurrency limit |
| `filemaker.enterprise.mode` | Enable enterprise mode |
| `filemaker.enterprise.role` | Enterprise role: viewer, developer, admin |
| `filemaker.performance.mode` | Performance mode: standard or high-scale |
| `filemaker.offline.mode` | Enable offline metadata mode |

## Troubleshooting

| Issue | Solution |
|-------|---------|
| HTTP 401 / token invalid | Reconnect the profile and re-enter credentials |
| HTTP 403 / permission denied | Check FileMaker account privileges and role guard policy |
| HTTP 404 / unsupported | Some servers don't expose all metadata/script routes — use fallback flows |
| SSL/TLS errors | Verify certificate trust chain and server URL |
| Features disabled | Trust the workspace to enable file generation, batch writes, and plugin loading |

## Testing

253 tests across 58 test files covering:

- **Unit tests**: stores, utilities, services, commands, tree view, webview HTML, CSP
- **Integration tests** (mocked HTTP): CRUD operations, 401 retry, batch export/update, environment compare, schema snapshots, scripts

```bash
npm test              # run all tests
npm run test:coverage # run with coverage reporting
```

## Development

```bash
npm install
npm run lint          # eslint with zero-warning enforcement
npm run typecheck     # tsc --noEmit
npm run build         # esbuild + webview copy
npm test              # vitest
```

See also:
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [SECURITY.md](./SECURITY.md)
- [UPGRADE.md](./UPGRADE.md)
- [docs/roadmap.md](../docs/roadmap.md)

## License

MIT
