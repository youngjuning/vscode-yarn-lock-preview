import React from 'react';
import ReactJson from 'react-json-view';
import Channel from '@luozhu/vscode-channel';

const channel = new Channel();

export default function HomePage() {
  const [text, setText] = React.useState({});
  React.useEffect(() => {
    channel.bind(async message => {
      switch (message.method) {
        case 'update': {
          console.log(message);
          setText(message.params);
          break;
        }
        default:
          break;
      }
    });
  }, []);
  return (
    <div>
      <ReactJson src={text} />
    </div>
  );
}
