import * as vscode from 'vscode';

import type { NormalizedError, RequestChainEntry } from '../types/errors';
import { normalizeError } from './normalizeError';
import { redactString, redactValue } from './redact';

interface ShowErrorOptions {
  fallbackMessage?: string;
  logger?: {
    error: (message: string, meta?: unknown) => void;
  };
  logMessage?: string;
}

const DETAILS_ACTION = 'Details…';
const COPY_REPORT_ACTION = 'Copy as Bug Report';

let lastRenderedReport: string | undefined;

export async function showErrorWithDetails(
  error: unknown,
  options?: ShowErrorOptions
): Promise<void> {
  const normalized = normalizeError(error, {
    fallbackMessage: options?.fallbackMessage
  });

  options?.logger?.error(options?.logMessage ?? 'Command failed.', {
    error: normalized
  });

  const report = renderErrorReport(normalized, error);
  lastRenderedReport = report;

  const selection = await vscode.window.showErrorMessage(
    normalized.message,
    DETAILS_ACTION,
    COPY_REPORT_ACTION
  );

  if (selection === COPY_REPORT_ACTION) {
    await vscode.env.clipboard.writeText(report);
    void vscode.window.showInformationMessage('FileMaker error report copied to clipboard.');
    return;
  }

  if (selection !== DETAILS_ACTION) {
    return;
  }

  const document = await vscode.workspace.openTextDocument({
    language: 'markdown',
    content: report
  });

  await vscode.window.showTextDocument(document, { preview: false });
}

export const showCommandError = showErrorWithDetails;

export function toUserErrorMessage(error: unknown, fallbackMessage = 'Unexpected error.'): string {
  return normalizeError(error, { fallbackMessage }).message;
}

export function getLastErrorReport(): string | undefined {
  return lastRenderedReport;
}

/**
 * Pure rendering of a NormalizedError + raw error into a human-readable
 * markdown report suitable for both the Details document and the
 * "Copy as Bug Report" clipboard action.
 *
 * Exported for testing.
 */
export function renderErrorReport(normalized: NormalizedError, raw?: unknown): string {
  const lines: string[] = [];
  lines.push('# FileMaker Data API — Error Report');
  lines.push('');
  lines.push(`- **Message:** ${normalized.message}`);
  lines.push(`- **Kind:** ${normalized.kind}`);
  if (normalized.status !== undefined) {
    lines.push(`- **HTTP status:** ${normalized.status}`);
  }
  if (normalized.code) {
    lines.push(`- **Code:** ${normalized.code}`);
  }
  if (normalized.endpoint) {
    lines.push(`- **Endpoint:** ${normalized.endpoint}`);
  }
  if (normalized.requestId) {
    lines.push(`- **Request id:** ${normalized.requestId}`);
  }
  lines.push(`- **Retryable:** ${normalized.isRetryable}`);
  if (typeof normalized.retryCount === 'number') {
    lines.push(`- **Retry count:** ${normalized.retryCount}`);
  }
  if (typeof normalized.finalAttemptIndex === 'number') {
    lines.push(`- **Final attempt index:** ${normalized.finalAttemptIndex}`);
  }
  lines.push('');

  if (normalized.requestChain && normalized.requestChain.length > 0) {
    lines.push('## Request chain');
    lines.push('');
    lines.push('| # | Method | URL | Status | Elapsed | When | Note |');
    lines.push('|---|---|---|---|---|---|---|');
    for (const entry of normalized.requestChain) {
      lines.push(formatChainRow(entry));
    }
    lines.push('');
  }

  if (normalized.safeHeaders && Object.keys(normalized.safeHeaders).length > 0) {
    lines.push('## Response headers (redacted)');
    lines.push('');
    lines.push('```');
    for (const [key, value] of Object.entries(normalized.safeHeaders)) {
      lines.push(`${key}: ${value}`);
    }
    lines.push('```');
    lines.push('');
  }

  if (normalized.details !== undefined) {
    lines.push('## Details (redacted)');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(redactValue(normalized.details), null, 2));
    lines.push('```');
    lines.push('');
  }

  const stack = normalized.stackTrace ?? extractStack(raw);
  if (stack) {
    lines.push('## Stack trace (redacted)');
    lines.push('');
    lines.push('```');
    lines.push(redactString(stack));
    lines.push('```');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`_Generated at ${new Date().toISOString()}_`);
  return lines.join('\n');
}

function escapeMarkdownTableCell(value: string): string {
  // Escape backslashes first so \\ stays \\ and stand-alone | becomes \|.
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatChainRow(entry: RequestChainEntry): string {
  const cells = [
    String(entry.attempt),
    escapeMarkdownTableCell(entry.method ?? ''),
    escapeMarkdownTableCell(entry.url ?? ''),
    entry.status !== undefined ? String(entry.status) : '',
    entry.elapsedMs !== undefined ? `${entry.elapsedMs}ms` : '',
    escapeMarkdownTableCell(entry.at ?? ''),
    escapeMarkdownTableCell(entry.note ?? '')
  ];
  return `| ${cells.join(' | ')} |`;
}

function extractStack(raw: unknown): string | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const candidate = (raw as { stack?: unknown }).stack;
  if (typeof candidate === 'string' && candidate.length > 0) {
    return candidate;
  }
  return undefined;
}
