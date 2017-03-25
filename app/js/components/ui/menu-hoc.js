import React, { Component } from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import MenuContainer from "./menu-container"
import { MenuButtonContainer } from "./menu"

export default function asMenu({
  iconButton, menuContent, width = 175
}) {
  return class InjectAsMenu extends Component {
    static WrappedComponent = menuContent
    static IconButtonComponent = iconButton

    state = {
      menuActive: false
    }

    constructor() {
      super(...arguments)
      this.handleToggleButtonClick = this.handleToggleButtonClick.bind(this)
      this.closeMenu = this.closeMenu.bind(this)
    }

    handleToggleButtonClick() {
      this.setState(prevState => ({ menuActive: !prevState.menuActive }))
    }

    closeMenu() {
      this.setState({ menuActive: false })
    }

    render() {
      const { menuActive } = this.state
      return (
        <MenuButtonContainer>
          <InjectAsMenu.IconButtonComponent
            margin
            active={menuActive}
            onClick={this.handleToggleButtonClick}
          />
          <ReactCSSTransitionGroup
            transitionName="menu-transition"
            transitionEnterTimeout={100}
            transitionLeaveTimeout={200}
          >
            { menuActive && (
              <MenuContainer
                onClickOutside={this.closeMenu}
                width={`${width}px`}
              >
                <InjectAsMenu.WrappedComponent />
              </MenuContainer>
            )}
          </ReactCSSTransitionGroup>
        </MenuButtonContainer>
      )
    }
  }
}
