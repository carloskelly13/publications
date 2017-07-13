import React, { Component } from "react"
import { Menu } from "./menu"
import onClickOutside from "react-onclickoutside"

class MenuContainer extends Component {
  constructor() {
    super(...arguments)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  handleClickOutside() {
    this.props.onClickOutside()
  }

  render() {
    return (
      <Menu width={this.props.width}>
        { this.props.children }
      </Menu>
    )
  }
}

export default onClickOutside(MenuContainer)
