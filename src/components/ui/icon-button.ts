import styled, { css } from "styled-components";

export default styled.button<{ size?: number; disabled?: boolean }>`
  background: transparent;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  padding: 0;
  position: relative;
  border-radius: 0;
  text-align: center;
  opacity: ${props => (props.disabled ? 0.33 : 1.0)};
  ${props =>
    props.size &&
    css`
      width: ${props.size}px;
      height: ${props.size}px;
    `};
`;
