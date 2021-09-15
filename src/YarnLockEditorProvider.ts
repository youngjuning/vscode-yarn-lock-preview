import vscode from 'vscode';
import { getUmiHTMLContent } from '@luozhu/vscode-utils';
import Channel from '@luozhu/vscode-channel';
import * as lockfile from '@yarnpkg/lockfile';

class YarnLockEditorProvider implements vscode.CustomTextEditorProvider {
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new YarnLockEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      YarnLockEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true, // 隐藏时保留上下文
        },
      }
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

    webviewPanel.webview.html = getUmiHTMLContent(this.context, webviewPanel, {
      title: 'Yarn Lock Preview',
    });

    const channel = new Channel(this.context, webviewPanel);
    vscode.window.onDidChangeActiveColorTheme(colorTheme => {
      channel.call('updateColorTheme', colorTheme);
    });

    function updateWebview(textDocument: vscode.TextDocument) {
      let json = lockfile.parse(textDocument.getText());
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
      channel.call('updateWebview', json);
    }

    // 注册钩子事件处理程序，这样我们就可以使 webview 与文本文档同步。
    //
    // 文本文件作为我们的模型，所以我们必须将文件中的变化同步到我们的编辑器。
    // 请记住，一个文本文件也可以在多个自定义编辑器之间共享（例如，当你分割一个自定义编辑器时就会发生这种情况）。
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview(e.document);
      }
    });
    // 确保当我们的编辑器关闭时，移除了监听器。
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    updateWebview(document);
    channel.call('updateColorTheme', vscode.window.activeColorTheme);
  }
}

export default YarnLockEditorProvider;
