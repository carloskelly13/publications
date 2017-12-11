import React, { Component } from "react";
import { Menu } from "./menu";
import enhanceWithClickOutside from "react-click-outside";

class MenuContainer extends Component {
  handleClickOutside = () => this.props.onClickOutside();

  render() {
    return <Menu width={this.props.width}>{this.props.children}</Menu>;
  }
}

export default enhanceWithClickOutside(MenuContainer);
