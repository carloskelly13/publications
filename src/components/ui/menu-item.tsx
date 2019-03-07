import * as React from "react";
import styled, { css } from "styled-components";
import { appFont } from "../../util/constants";

export const MenuItemGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Container = styled.button<{
  showsBottomBorder?: boolean;
  showsTopBorder?: boolean;
}>`
  align-items: center;
  background: transparent;
  border: none;
  color: #fff;
  display: flex;
  flex-direction: row;
  flex: 1;
  font-family: ${appFont};
  font-size: 14px;
  font-weight: 600;
  justify-content: space-between;
  margin: 0;
  padding: 0.667em 0.8em;
  text-align: left;

  &:hover {
    background-color: hsla(0, 0%, 100%, 0.2);
  }

  ${({ showsTopBorder }) =>
    showsTopBorder &&
    css`
      border-top: 1px solid #2a2b2e;
    `};

  ${({ showsBottomBorder }) =>
    showsBottomBorder &&
    css`
      border-bottom: 1px solid #2a2b2e;
    `};
`;

interface Props {
  showsTopBorder?: boolean;
  showsBottomBorder?: boolean;
  children: React.ReactNode;
  onPress?(): void;
}
export default function MenuItem(props: Props) {
  return (
    <Container
      showsTopBorder={props.showsTopBorder}
      showsBottomBorder={props.showsBottomBorder}
      onClick={props.onPress}
    >
      {props.children}
    </Container>
  );
}

MenuItem.defaultProps = {
  showsTopBorder: true,
};
