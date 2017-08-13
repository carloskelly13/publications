import React, { Component } from "react"
import styled, { injectGlobal } from "styled-components"
import { AppColors } from "../../util/constants"
import enhanceWithClickOutside from "react-click-outside"

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
  border-radius: 2px;
  position: absolute;
  border-top: none;
  box-shadow: 0 0 15px rgba(38, 50, 55, 0.25);
  top: 46px;
  cursor: default;
  outline: none;
  border: 1px solid hsla(0, 0%, 0%, 0.33);
`

export const MenuContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  outline: none;
`

export const MenuItem = styled.li`
  padding: 0.5em 3em 0.5em 1em;

  &:hover {
    color: #fff;
    background: ${AppColors.Active};
  }

  &:active {
    color: #fff;
    background: ${AppColors.ActiveDark};
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
