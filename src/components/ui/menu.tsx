import React from "react";
import styled, { css } from "styled-components";
import { AppColors, Colors, appFont } from "../../util/constants";
import enhanceWithClickOutside from "react-click-outside";

export const Menu = styled.ul<{ alignRight?: boolean }>`
  background: ${Colors.Menu.Background};
  list-style: none;
  color: ${AppColors.White};
  padding: 4px 0;
  margin: 0 0 0 -1px;
  min-width: 125px;
  border-radius: 0 4px 4px 4px;
  position: absolute;
  border: 1px solid ${Colors.Menu.MenuBorder};
  box-shadow: 1px 1px 5px 0 hsla(0, 0%, 0%, 0.25);
  top: 27px;
  cursor: default;
  outline: none;
  z-index: 6;

  ${({ alignRight }) =>
    alignRight &&
    css`
      margin: 0;
      border-radius: 4px 0 4px 4px;
      right: 6px;
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

export const MenuItem = styled.button<{ noExtraRightPadding?: boolean }>`
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
    color: ${Colors.Menu.TextHighlight};
    background: ${Colors.Menu.ItemHighlight};
  }

  &:active {
    color: ${Colors.Menu.TextHighlight};
    background: ${Colors.Menu.ItemHighlight};
  }

  &:focus {
    color: ${Colors.Menu.TextHighlight};
    background: ${Colors.Menu.ItemHighlight};
  }

  &:disabled {
    pointer-events: none;
    color: ${AppColors.DisabledGray};
  }
`;

interface MenuContainerProps {
  onClickOutside(): void;
}

export const MenuContainer = enhanceWithClickOutside(
  class extends React.Component<MenuContainerProps> {
    handleClickOutside = () => this.props.onClickOutside();
    render() {
      return <MenuContentContainer>{this.props.children}</MenuContentContainer>;
    }
  }
);

interface MenuButtonProps {
  disabled: boolean;
  children: React.ReactNode;
  style: React.CSSProperties;
  onClick(): void;
}

interface MenuProps {
  alignRight?: boolean;
  renderMenu: React.ReactNode;
  renderButton: React.ReactElement<MenuButtonProps>;
  disabled?: boolean;
}

interface MenuState {
  menuActive: boolean;
}

export default class extends React.Component<MenuProps, MenuState> {
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
              background: menuActive
                ? Colors.Menu.ButtonActiveBackground
                : "transparent",
              color: Colors.Menu.Text,
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
