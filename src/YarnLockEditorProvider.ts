import vscode from 'vscode';
import * as lockfile from '@yarnpkg/lockfile';

class YarnLockEditorProvider implements vscode.CustomTextEditorProvider {
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new YarnLockEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      YarnLockEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = 'yarn-lock-preview.yarnLock';

  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * 当自定义编辑器打开时调用。
   */
  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // 给 webview 设置初始内容
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    const json = lockfile.parse(document.getText()).object;
    webviewPanel.webview.html = this.getHtmlForWebview(JSON.stringify(json));
  }

  private getHtmlForWebview(json: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
          <h1>JSON 数据</h1>
          <p>${json}</p>
        </body>
        </html>
    `;
  }
}

export default YarnLockEditorProvider;
