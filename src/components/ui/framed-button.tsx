import React from "react";
import styled, { css } from "styled-components";
import { Colors, appFont } from "../../util/constants";

const ButtonWrapper = styled.button<{
  marginRight?: boolean;
  marginLeft?: boolean;
  fullWidth?: boolean;
  active?: boolean;
  destructive?: boolean;
}>`
  background: ${({ destructive }) =>
    Colors.Button[destructive ? "DestructiveBackground" : "Background"]};
  border: 1px solid ${Colors.Button.Border};
  border-radius: 4px;
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.15);
  color: ${Colors.Button.Text};
  font-family: ${appFont};
  font-size: 0.95em;
  font-weight: 500;
  padding: 3px 18px;
  outline: none;
  margin: ${props =>
    `${0} ${props.marginRight ? "0.5em" : 0} ${0} ${
      props.marginLeft ? "0.5em" : 0
    }`};

  &:focus {
    box-shadow: 0 0 0 2px ${Colors.Button.Outline};
  }

  &:active {
    box-shadow: inset 1px 1px 0 hsla(0, 0%, 0%, 0.15);
  }

  &:disabled {
    opacity: 0.5;
  }

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `};
`;

const ButtonContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

interface Props {
  children: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  marginLeft?: boolean;
  marginRight?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
  active?: boolean;
  type?: string;
  onClick?(): void;
}

const Button: React.SFC<Props> = ({
  children,
  disabled,
  destructive,
  onClick,
  marginRight,
  marginLeft,
  fullWidth,
  style = {},
  active = false,
  type = "button",
}) => (
  <ButtonWrapper
    destructive={destructive}
    marginRight={marginRight}
    marginLeft={marginLeft}
    onClick={onClick}
    disabled={disabled}
    fullWidth={fullWidth}
    style={style}
    active={active}
    type={type}
  >
    {children}
  </ButtonWrapper>
);

export default Button;

export const ButtonContainer = ({ children }) => {
  if (children.length <= 1) {
    return React.Children.only(children);
  }

  const firstButton = children[0];
  const lastButton = children[children.length - 1];
  const middleButtons = children.slice(1, children.length - 1);

  return (
    <ButtonContainerWrapper>
      {React.cloneElement(firstButton, {
        style: {
          borderRadius: "4px 0 0 4px",
          margin: 0,
        },
      })}
      {middleButtons.map(button =>
        React.cloneElement(button, {
          key: button.props.children,
          style: {
            borderRadius: 0,
            borderLeft: "none",
            margin: 0,
          },
        })
      )}
      {React.cloneElement(lastButton, {
        style: {
          borderRadius: "0 4px 4px 0",
          borderLeft: "none",
        },
      })}
    </ButtonContainerWrapper>
  );
};
