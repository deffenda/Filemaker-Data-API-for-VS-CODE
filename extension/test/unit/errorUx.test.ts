import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';

import { showErrorWithDetails, toUserErrorMessage } from '../../src/utils/errorUx';

describe('showErrorWithDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error message with the normalized error message', async () => {
    await showErrorWithDetails(new Error('Something broke'));

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      'Something broke',
      'Details…',
      'Copy as Bug Report'
    );
  });

  it('uses fallback message when error is not an Error', async () => {
    await showErrorWithDetails('string error', {
      fallbackMessage: 'Fallback msg'
    });

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
      expect.any(String),
      'Details…',
      'Copy as Bug Report'
    );
  });

  it('calls logger when provided', async () => {
    const logger = { error: vi.fn() };

    await showErrorWithDetails(new Error('fail'), {
      logger,
      logMessage: 'Custom log'
    });

    expect(logger.error).toHaveBeenCalledWith('Custom log', expect.any(Object));
  });

  it('opens markdown document when Details action is selected', async () => {
    vi.mocked(vscode.window.showErrorMessage).mockResolvedValue('Details…' as never);

    await showErrorWithDetails(new Error('fail'));

    expect(vscode.workspace.openTextDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'markdown',
        content: expect.any(String)
      })
    );
    expect(vscode.window.showTextDocument).toHaveBeenCalled();
  });

  it('does not open document when Details is not selected', async () => {
    vi.mocked(vscode.window.showErrorMessage).mockResolvedValue(undefined as never);

    await showErrorWithDetails(new Error('fail'));

    expect(vscode.workspace.openTextDocument).not.toHaveBeenCalled();
  });

  it('copies report to clipboard when Copy as Bug Report is selected', async () => {
    vi.mocked(vscode.window.showErrorMessage).mockResolvedValue('Copy as Bug Report' as never);

    await showErrorWithDetails(new Error('boom'));

    expect(vscode.env.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('# FileMaker Data API — Error Report')
    );
    // No document is opened on the copy path.
    expect(vscode.workspace.openTextDocument).not.toHaveBeenCalled();
  });

  it('does not render the report when toast is dismissed (deferred rendering)', async () => {
    vi.mocked(vscode.window.showErrorMessage).mockResolvedValue(undefined as never);

    // Pass a non-serializable value via a getter that throws — would crash if rendered eagerly.
    const evil = new Error('toxic');
    Object.defineProperty(evil, 'stack', {
      get() {
        throw new Error('do not access');
      }
    });

    await expect(showErrorWithDetails(evil)).resolves.toBeUndefined();
    // Clipboard and document remain untouched because we only render on action.
    expect(vscode.env.clipboard.writeText).not.toHaveBeenCalled();
    expect(vscode.workspace.openTextDocument).not.toHaveBeenCalled();
  });
});

describe('toUserErrorMessage', () => {
  it('extracts message from Error', () => {
    expect(toUserErrorMessage(new Error('oops'))).toBe('oops');
  });

  it('uses fallback for non-Error', () => {
    expect(toUserErrorMessage(null, 'fallback')).toBe('fallback');
  });

  it('uses default fallback', () => {
    expect(toUserErrorMessage(undefined)).toBe('Unexpected error.');
  });
});
