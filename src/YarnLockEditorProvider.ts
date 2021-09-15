import vscode from 'vscode';
import { getUmiHTMLContent } from '@luozhu/vscode-utils';
import Channel from '@luozhu/vscode-channel';
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
    let json = lockfile.parse(document.getText());
    switch (json.type) {
      case 'merge':
        // TODO: 处理 merge type
        break;
      case 'conflict':
        // TODO: 处理 conflict type
        break;
      default:
        json = json.object;
    }
    webviewPanel.webview.html = getUmiHTMLContent(this.context, webviewPanel, {
      title: 'Yarn Lock Preview',
    });
    const channel = new Channel(this.context, webviewPanel);

    function updateWebview() {
      channel.call('update', json);
    }

    updateWebview();
  }
}

export default YarnLockEditorProvider;
