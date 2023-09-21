import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import './tabs.css';

export default class Tabs extends PureComponent {
  render() {
    const items = [
      {
        label: 'Search',
        key: 'search',
      },
      {
        label: 'Rated',
        key: 'rated',
      },
    ];
    const { currentTab, changeCurrentTab } = this.props;
    return (
      <div className="tabs-block__btn">
        <Menu
          onClick={changeCurrentTab}
          selectedKeys={currentTab}
          mode="horizontal"
          items={items}
          className="asdad"
        />
      </div>
    );
  }
}
