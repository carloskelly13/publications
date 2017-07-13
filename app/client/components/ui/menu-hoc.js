import React, { Component } from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import MenuContainer from "./menu-container"
import { MenuButtonContainer } from "./menu"
import omit from "lodash.omit"

export default function asMenu({
  iconButton, menuContent, width = 175, iconButtonProps = {}
}) {
  return class InjectAsMenu extends Component {
    static WrappedComponent = menuContent

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
      const wrapperProps = omit(this.props, "disabled")
      const IconButtonComponent = iconButton || this.props.icon
      return (
        <MenuButtonContainer>
          <IconButtonComponent
            margin
            {...iconButtonProps}
            label={this.props.label}
            disabled={this.props.disabled}
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
                <InjectAsMenu.WrappedComponent {...wrapperProps} />
              </MenuContainer>
            )}
          </ReactCSSTransitionGroup>
        </MenuButtonContainer>
      )
    }
  }
}
