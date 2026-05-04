import * as vscode from 'vscode';

import { renderCircuitBreakerStatus } from '../performance/circuitBreakerRegistry';
import type { CircuitBreakerRegistry } from '../performance/circuitBreakerRegistry';

export interface CircuitBreakerCommandsDeps {
  registry: CircuitBreakerRegistry;
}

export function registerCircuitBreakerCommands(
  deps: CircuitBreakerCommandsDeps
): vscode.Disposable[] {
  const showStatus = vscode.commands.registerCommand(
    'filemakerDataApiTools.showCircuitBreakerStatus',
    async () => {
      const content = renderCircuitBreakerStatus(deps.registry.list());
      const doc = await vscode.workspace.openTextDocument({
        language: 'markdown',
        content
      });
      await vscode.window.showTextDocument(doc, { preview: true });
    }
  );

  return [showStatus];
}
