import React, { Component } from "react";
import styled, { css } from "styled-components";
import { AppColors, appFont } from "../../util/constants";
import enhanceWithClickOutside from "react-click-outside";

export const Menu = styled.ul`
  background: ${AppColors.Background};
  list-style: none;
  color: ${AppColors.White};
  padding: 4px 0;
  margin: 0;
  min-width: 125px;
  border-radius: 0 4px 4px 4px;
  position: absolute;
  border-top: none;
  box-shadow: 0 2px 3px 1px hsla(0, 0%, 0%, 0.3);
  top: 28px;
  cursor: default;
  outline: none;
  z-index: 6;

  ${({ alignRight }) =>
    alignRight &&
    css`
      border-radius: 4px 0 4px 4px;
      right: 7px;
    `};
`;

export const MenuContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  outline: none;
`;

export const MenuDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 2px 0;
  display: block;
  background: hsla(0, 0%, 0%, 0.15);
`;

export const MenuItem = styled.button`
  padding: ${({ noExtraRightPadding }) =>
    noExtraRightPadding ? "0.4em 1em" : "0.4em 3em 0.4em 1em"};
  border: none;
  background: transparent;
  margin: none;
  color: ${AppColors.White};
  display: block;
  font-size: 0.95em;
  font-family: ${appFont};
  width: 100%;
  text-align: left;
  outline: none;
  border-radius: 0;

  &:hover {
    color: #fff;
    background: ${AppColors.Highlight};
  }

  &:active {
    color: #fff;
    background: ${AppColors.HighlightDark};
  }

  &:focus {
    color: #fff;
    background: ${AppColors.Highlight};
  }

  &:disabled {
    pointer-events: none;
    color: ${AppColors.DisabledGray};
  }
`;

export const MenuContainer = enhanceWithClickOutside(
  class extends Component {
    handleClickOutside = () => this.props.onClickOutside();
    render() {
      return <MenuContentContainer>{this.props.children}</MenuContentContainer>;
    }
  }
);

type MenuProps = {
  renderMenu: React.Node,
  renderButton: React.Node,
  disabled?: boolean,
};
export default class extends React.Component<MenuProps> {
  state = {
    menuActive: false,
  };

  handleToggleButtonClick = () =>
    this.setState(prevState => ({
      menuActive: !prevState.menuActive,
    }));

  closeMenu = () => this.setState({ menuActive: false });

  render() {
    const { menuActive } = this.state;
    const { renderMenu, renderButton, disabled, alignRight } = this.props;
    const disabledStyle = disabled
      ? {
          color: AppColors.DisabledGray,
          cursor: "default",
        }
      : {};
    return (
      <MenuContainer onClickOutside={this.closeMenu}>
        {React.cloneElement(
          renderButton,
          {
            onClick: this.handleToggleButtonClick,
            style: {
              margin: 0,
              borderRadius: menuActive ? "2px 2px 0 0" : 0,
              background: menuActive ? AppColors.Background : "transparent",
              color: AppColors.White,
              ...disabledStyle,
            },
            disabled,
          },
          <span>{renderButton.props.children}</span>
        )}
        {menuActive && (
          <Menu alignRight={alignRight} onClick={this.closeMenu}>
            {renderMenu}
          </Menu>
        )}
      </MenuContainer>
    );
  }
}
