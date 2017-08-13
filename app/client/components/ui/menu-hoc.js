import React, { Component } from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { MenuContainer, Menu } from "./menu"
import omit from "lodash.omit"

export default function componentAsDowndownMenu({
  iconButton, menuContent, iconButtonProps = {}
}) {
  return class InjectAsMenu extends Component {
    static WrappedComponent = menuContent

    state = {
      menuActive: false
    }

    handleToggleButtonClick = () => this.setState(prevState => ({
      menuActive: !prevState.menuActive
    }))

    closeMenu = () => this.setState({ menuActive: false })

    render() {
      const { menuActive } = this.state
      const wrapperProps = omit(this.props, "disabled")
      const IconButtonComponent = iconButton || this.props.icon
      return (
        <MenuContainer
          onClickOutside={this.closeMenu}
        >
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
              <Menu
                onClick={this.closeMenu}
              >
                <InjectAsMenu.WrappedComponent {...wrapperProps} />
              </Menu>
            )}
          </ReactCSSTransitionGroup>
        </MenuContainer>
      )
    }
  }
}
