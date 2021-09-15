import vscode from 'vscode';
import YarnLockEditorProvider from './YarnLockEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "yarn-lock-preview" is now active!');
  context.subscriptions.push(
    vscode.commands.registerCommand('yarn-lock-preview.switchEditorMode', () => {
      vscode.commands.executeCommand('workbench.action.reopenWithEditor');
    })
  );

  context.subscriptions.push(YarnLockEditorProvider.register(context));
}

export function deactivate() {}
