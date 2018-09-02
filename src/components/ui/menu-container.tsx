import React from "react";
import { Menu } from "./menu";
import enhanceWithClickOutside from "react-click-outside";

interface Props {
  onClickOutside(): void;
}
class MenuContainer extends React.Component<Props> {
  handleClickOutside = () => this.props.onClickOutside();

  render() {
    return <Menu>{this.props.children}</Menu>;
  }
}

export default enhanceWithClickOutside(MenuContainer);
