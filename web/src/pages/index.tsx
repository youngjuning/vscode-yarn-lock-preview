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
    const isHaveZeroAt = searchValue.split('').filter(item => item === '@')?.length === 0;
    const isHaveOneAt = searchValue.split('').filter(item => item === '@')?.length === 1;
    const isHaveTwoAt = searchValue.split('').filter(item => item === '@')?.length === 2;

    Object.entries(data).forEach(([key, value]: [string, any]) => {
      if (value.dependencies) {
        Object.entries(value.dependencies).forEach(([dKey, dValue]: [string, any]) => {
          if (isHaveTwoAt || (isHaveOneAt && !searchValue.startsWith('@'))) {
            if (`${dKey}@${dValue}` === searchValue) {
              result[key] = value;
            }
          } else if ((isHaveOneAt && searchValue.startsWith('@')) || isHaveZeroAt) {
            if (dKey === searchValue) {
              result[key] = value;
            }
          }
        });
      }
      if (isHaveTwoAt || (isHaveOneAt && !searchValue.startsWith('@'))) {
        if (key === searchValue) {
          result[key] = value;
        }
      } else if (isHaveOneAt && searchValue.startsWith('@')) {
        if (`${key.split('@')[0]}@${key.split('@')[1]}` === searchValue) {
          result[key] = value;
        }
      } else if (isHaveZeroAt) {
        if (key.split('@')[0] === searchValue) {
          result[key] = value;
        }
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
        shouldCollapse={filed => {
          if (filed.name) {
            return true;
          }
          return false;
        }}
        style={{
          backgroundColor: getCssVar('--vscode-editor-background'),
          fontSize: getCssVar('--vscode-editor-font-size'),
        }}
      />
    </>
  );
}
