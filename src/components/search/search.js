import React, { PureComponent } from "react";
import "./search.css";

export default class Search extends PureComponent {
  state = {
    searchValue: "",
  };

  render() {
    const { onChange } = this.props;

    return (
      <div className="search-block">
        <input
          onChange={onChange}
          className="input-search"
          type="text"
          placeholder="Type to search"
        ></input>
      </div>
    );
  }
}
