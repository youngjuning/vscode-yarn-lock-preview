import { commands, ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "yarn-lock-preview" is now active!');

  context.subscriptions.push(
    commands.registerCommand('yarn-lock-preview.switchEditorMode', () => {
      commands.executeCommand('workbench.action.reopenWithEditor');
    })
  );
}

export function deactivate() {}
