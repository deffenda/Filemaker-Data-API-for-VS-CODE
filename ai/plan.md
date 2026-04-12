# Plan — v1.1.0: Collaboration Features

## Overview

Add team-oriented collaboration features: shared connection profiles, a team query library, and audit log export. These are the first three items from the Post-1.0 roadmap under "Collaboration Features".

## Source

docs/roadmap.md — "Collaboration Features" section.

## Tasks

- **T-COL-1**: Shared connection profiles — expose non-secret profile fields (host, database, layout) as workspace-scoped VS Code settings so they can be committed to a repo and shared with team members. Secret fields (username, password, token) remain local.
- **T-COL-2**: Team query library — add a shared saved-query store backed by a git-tracked JSON file in the workspace (`.vscode/fmtools-queries.json`). Queries can be promoted from personal to shared and consumed by all team members.
- **T-COL-3**: Audit log export — add an export command that writes the request history store to CSV or JSONL, with optional date-range and layout filters.

## Sequencing

T-COL-1 → T-COL-2 → T-COL-3. Each is independent enough to ship as a standalone PR but ordered by value.

## Constraints

- Do not modify the secret-handling path or expose credentials to workspace settings.
- Shared query file must be human-readable and merge-friendly.
- Export format must match existing batch-export conventions (JSONL primary, CSV secondary).
