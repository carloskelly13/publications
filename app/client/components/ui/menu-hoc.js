import React, { Component } from "react"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { MenuContainer, Menu } from "./menu"
import omit from "lodash.omit"
import ToolbarButton from "./toolbar-button"

export default function asDropdownMenu({ title = "", buttonProps = {} }) {
  return WrappedComponent => class extends Component {
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
      return (
        <MenuContainer
          onClickOutside={this.closeMenu}
        >
          <ToolbarButton
            { ...buttonProps }
            disabled={this.props.disabled}
            onClick={this.handleToggleButtonClick}
          >
            { title }
          </ToolbarButton>
          <ReactCSSTransitionGroup
            transitionName="menu-transition"
            transitionEnterTimeout={100}
            transitionLeaveTimeout={200}
          >
            { menuActive && (
              <Menu
                onClick={this.closeMenu}
              >
                <WrappedComponent {...wrapperProps} />
              </Menu>
            )}
          </ReactCSSTransitionGroup>
        </MenuContainer>
      )
    }
  }
}
