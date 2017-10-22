// @flow
import React, { Component } from "react"
import styled, { injectGlobal } from "styled-components"
import { AppColors } from "../../util/constants"
import enhanceWithClickOutside from "react-click-outside"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import ArrowDown from "../ui/arrow-down"

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  .menu-transition-enter {
    opacity: 0;
  }

  .menu-transition-enter.menu-transition-enter-active {
    opacity: 1;
    transition: opacity 100ms ease-in-out;
  }

  .menu-transition-leave {
    opacity: 1;
  }

  .menu-transition-leave.menu-transition-leave-active {
    opacity: 0;
    transition: opacity 200ms ease-in-out;
  }
`

export const Menu = styled.ul`
  background: #fff;
  list-style: none;
  color: ${AppColors.DarkGray};
  padding: 2px 0;
  margin: 0;
  border-radius: 0 2px 2px 2px;
  position: absolute;
  border-top: none;
  box-shadow: 0 0 25px hsla(0, 0%, 0%, 0.15);
  top: 27px;
  cursor: default;
  outline: none;
  border: 1px solid ${AppColors.Gray50};
  z-index: 6;
`

export const MenuContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  outline: none;
`

export const MenuDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 2px 0;
  display: block;
  background: hsla(0, 0%, 0%, 0.15);
`

export const MenuItem = styled.button`
  padding: 0.4em 3em 0.4em 1em;
  border: none;
  background: transparent;
  margin: none;
  display: block;
  font-size: 0.9em;
  width: 100%;
  text-align: left;
  outline: none;
  border-radius: 0;

  &:hover {
    color: #fff;
    background: ${AppColors.Gray50};
  }

  &:active {
    color: #fff;
    background: ${AppColors.Gray50};
  }

  &:focus {
    color: #fff;
    background: ${AppColors.Gray50};
  }

  &:disabled {
    pointer-events: none;
    color: ${AppColors.DisabledGray};
  }
`

export const MenuContainer = enhanceWithClickOutside(class extends Component {
  handleClickOutside = () => this.props.onClickOutside()
  render() {
    return (
      <MenuContentContainer>
        { this.props.children }
      </MenuContentContainer>
    )
  }
})

type MenuProps = {
  renderMenu: React.Node,
  renderButton: React.Node
}
export default class extends React.Component<MenuProps> {
  state = {
    menuActive: false
  }

  handleToggleButtonClick = () => this.setState(prevState => ({
    menuActive: !prevState.menuActive
  }))

  closeMenu = () => this.setState({ menuActive: false })

  render() {
    const { menuActive } = this.state
    const { renderMenu, renderButton, disabled } = this.props
    const buttonStyle = menuActive ? {
      background: AppColors.Gray50,
      color: "#fff",
      borderRadius: "2px 2px 0 0"
    } : {}
    const disabledStyle = disabled ? {
      opacity: 0.33,
      cursor: "not-allowed"
    } : {}
    return (
      <MenuContainer
        onClickOutside={this.closeMenu}
      >
        {React.cloneElement(
          renderButton, {
            onClick: this.handleToggleButtonClick,
            style: { ...buttonStyle, ...disabledStyle },
            disabled
          }, (
            <span>
              {renderButton.props.children}
              <ArrowDown
                style={{ marginLeft: "3px" }}
                fill={menuActive ? "#fff" : AppColors.DarkGray}
              />
            </span>
          )
        )}
        <ReactCSSTransitionGroup
          transitionName="menu-transition"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={200}
        >
          {menuActive && (
            <Menu
              onClick={this.closeMenu}
            >
              {renderMenu}
            </Menu>
          )}
        </ReactCSSTransitionGroup>
      </MenuContainer>
    )
  }
}
