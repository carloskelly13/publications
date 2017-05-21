import styled, { injectGlobal } from "styled-components"
import { AppColors } from "../../util/constants"

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
  margin: 0 0 0 -2px;
  border-radius: 4px;
  position: absolute;
  border-top: none;
  box-shadow: 0 0 15px rgba(38, 50, 55, 0.25);
  top: 58px;
  cursor: default;
  width: ${({ width = "auto" }) => width};
  outline: none;
  border: 1px solid hsla(0, 0%, 0%, 0.33);

  &:after, &:before {
    display: block;
    content: ' ';
    width: 0;
    height: 0;
    position: absolute;
  }

  &:after {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #fff;
    top: -9px;
    left: 6px;
  }

  &:before {
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 11px solid hsla(0, 0%, 0%, 0.15);
    top: -11px;
    left: 5px;
  }
`

export const MenuButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  outline: none;
`

export const MenuItem = styled.li`
  padding: 0.5em 1em;

  &:hover {
    color: #fff;
    background: ${AppColors.Active};
  }

  &:active {
    color: #fff;
    background: ${AppColors.ActiveDark};
  }
`
