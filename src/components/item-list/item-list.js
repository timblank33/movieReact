import React, { PureComponent } from "react";

import Item from "../item/item";
import "./item-list.css";

export default class ItemList extends PureComponent {
  render() {
    const { searchValue, todoData, loading, changeRated, ratedArr } =
      this.props;
    const elements =
      todoData.length === 0 ? (
        <p className="no-todo">Результатов нет</p>
      ) : (
        todoData.map((item) => {
          const { id } = item;
          return (
            <Item
              {...item}
              todoData={todoData}
              key={id}
              searchValue={searchValue}
              loading={loading}
              changeRated={changeRated}
              ratedArr={ratedArr}
            />
          );
        })
      );

    return <div className="item-list">{elements}</div>;
  }
}
