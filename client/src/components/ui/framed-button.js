import React from "react";
import styled from "styled-components";
import { AppColors, appFont } from "../../util/constants";

const ButtonWrapper = styled.button`
  background: ${({ active }) => (active ? AppColors.Gray50 : "#fff")};
  border: 1px solid
    ${({ active }) => (active ? AppColors.Gray50 : AppColors.Gray40)};
  border-radius: 4px;
  color: ${({ active }) => (active ? AppColors.White : AppColors.DarkGray)};
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
    box-shadow: 0 0 0 2px #c8c7c8;
  }

  &:active {
    background: ${({ active }) =>
      active ? AppColors.ActiveDark : AppColors.WarmMidWhite};
  }

  &:disabled {
    color: #bbb;
    background: #fcfbfc;
  }
`;

const ButtonContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export default ({
  children,
  disabled,
  onClick,
  marginRight,
  marginLeft,
  style = {},
  active = false,
  type = "button",
}) => (
  <ButtonWrapper
    marginRight={marginRight}
    marginLeft={marginLeft}
    onClick={onClick}
    disabled={disabled}
    style={style}
    active={active}
    type={type}
  >
    {children}
  </ButtonWrapper>
);

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
