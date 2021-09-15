import React from 'react';
import ReactJson, { ThemeKeys } from 'react-json-view';
import { Input } from 'antd';
import Channel from '@luozhu/vscode-channel';
import getCssVar from '../utils/getCssVar';

require('./index.less');

const { Search } = Input;

const channel = new Channel();

export default function HomePage() {
  const [data, setData] = React.useState({});
  const [theme, setTheme] = React.useState<ThemeKeys>();

  React.useEffect(() => {
    channel.bind('updateWebview', message => {
      setData(message.params);
    });
    channel.bind('updateColorTheme', message => {
      const { kind } = message.params;
      setTheme(kind === 1 ? 'rjv-default' : 'monokai');
    });
  }, []);

  const [searchData, setSearchData] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState('');
  const onSearch = value => {
    setSearchValue(value);
  };
  const onSearchValueChange = event => {
    const { value } = event.target;
    if (value === '') {
      setSearchValue('');
    }
  };
  React.useEffect(() => {
    const result = {};
    const isHaveAt = searchValue.indexOf('@') !== -1;

    Object.entries(data).forEach(([key, value]: [string, any]) => {
      if (value.dependencies) {
        Object.entries(value.dependencies).forEach(([dKey, dValue]: [string, any]) => {
          if (!isHaveAt) {
            if (dKey === searchValue) {
              result[key] = value;
            }
          } else {
            const [packageName, packageVersion] = searchValue.split('@');
            if (dKey === packageName && dValue === packageVersion) {
              result[key] = value;
            }
          }
        });
      }
      if (!isHaveAt) {
        if (key.split('@')[0] === searchValue) {
          result[key] = value;
        }
      } else if (key === searchValue) {
        result[key] = value;
      }
    });
    if (searchValue === '') {
      setSearchData(null);
    } else {
      // @ts-ignore
      setSearchData(result);
    }
  }, [searchValue]);

  return (
    <>
      <Search
        className="search"
        placeholder="Truth is endless. Keep searching..."
        allowClear
        enterButton="搜索"
        size="large"
        onChange={onSearchValueChange}
        onSearch={onSearch}
      />
      <ReactJson
        src={searchData || data}
        name={false}
        theme={theme}
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        style={{
          backgroundColor: getCssVar('--vscode-editor-background'),
          // TODO: 监听字体更改事件
          fontSize: getCssVar('--vscode-editor-font-size'),
        }}
      />
    </>
  );
}
