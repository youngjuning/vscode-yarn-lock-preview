import React from 'react';
import ReactJson, { ThemeKeys } from 'react-json-view';
import Channel from '@luozhu/vscode-channel';
import getCssVar from '../utils/getCssVar';

const channel = new Channel();

export default function HomePage() {
  const [text, setText] = React.useState({});
  const [theme, setTheme] = React.useState<ThemeKeys>();

  React.useEffect(() => {
    channel.bind('updateWebview', async message => {
      setText(message.params);
    });
    channel.bind('updateColorTheme', async message => {
      const { kind } = message.params;
      setTheme(kind === 1 ? 'rjv-default' : 'monokai');
    });
  }, []);

  return (
    <div>
      {theme && (
        <ReactJson
          src={text}
          name={false}
          theme={theme}
          style={{
            backgroundColor: getCssVar('--vscode-editor-background'),
            // TODO: 监听字体更改事件
            fontSize: getCssVar('--vscode-editor-font-size'),
          }}
        />
      )}
    </div>
  );
}
