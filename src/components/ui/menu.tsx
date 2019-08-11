import React, { Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";
import { AppColors, Colors, appFont } from "../../util/constants";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export const MenuList = styled.ul<{ alignRight?: boolean }>`
  background: ${Colors.Menu.Background};
  list-style: none;
  color: ${AppColors.White};
  padding: 4px 0;
  margin: 0 0 0 -1px;
  min-width: 125px;
  border-radius: 0 0 4px 4px;
  position: absolute;
  border: 1px solid ${Colors.Menu.MenuBorder};
  box-shadow: 1px 1px 5px 0 hsla(0, 0%, 0%, 0.25);
  top: 25px;
  cursor: default;
  outline: none;
  z-index: 6;

  ${({ alignRight }) =>
    alignRight &&
    css`
      margin: 0;
      right: 8px;
    `};
`;

export const MenuContainer = styled.div`
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
  background: hsla(0, 0%, 100%, 0.15);
`;

export const MenuItem = styled.button<{ noExtraRightPadding?: boolean }>`
  padding: ${({ noExtraRightPadding }) =>
    noExtraRightPadding ? "0.4em 1em" : "0.4em 3em 0.4em 1em"};
  border: none;
  background: transparent;
  margin: 0;
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

interface MenuProps {
  alignRight?: boolean;
  renderMenu: React.ReactNode;
  disabled?: boolean;
  renderButton(
    setMenuActive: Dispatch<SetStateAction<boolean>>,
    menuActive: boolean
  ): React.ReactNode;
}

export default function Menu(props: MenuProps) {
  const [menuActive, setMenuActive] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setMenuActive(false));
  return (
    <MenuContainer innerRef={ref}>
      {props.renderButton(setMenuActive, menuActive)}
      {menuActive && (
        <MenuList
          alignRight={props.alignRight}
          onClick={() => setMenuActive(false)}
        >
          {props.renderMenu}
        </MenuList>
      )}
    </MenuContainer>
  );
}
