import React, { PropTypes } from "react"
import styled from "styled-components"

const _width = ({ big = false, half = false }) => {
  if (big) { return "100%" }
  if (half) { return "calc(~'50% - 5px')"; }
  return "auto"
}

export const FramedButton = styled.button`
  background: #fff;
  background: linear-gradient(top, #fff, #f2f2f2);
  border: 1px solid #d3d2d4;
  border-bottom-color: #b8b7b9;
  border-radius: 4px;
  box-sizing: border-box;
  line-height: 1em;
  font-size: ${({ big }) => big ? "18px" : "13px"};
  font-weight: 500;
  margin: 0;
  padding: ${({ big }) => big ? "9px 32px 8px" : "6px 16px" };
  text-decoration: none;
  color: #616161;
  width: ${_width};

  &:hover {
    background: #f7f7f7;
    background: linear-gradient(top, #f7f7f7, #f0f0f0);
  }

  &:active {
    border-top-color: #ccc;
    background: #ececec;
    background: linear-gradient(top, #ececec, #f2f2f2);
  }
`

export const TextButton = styled.button`
  background: transparent;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  color: #444;
  display: inline-block;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  padding: 8px;
  text-align: center;
  text-decoration: underline;

  &:hover {
    color: #8330F4;
  }

  &:active {
    color: #8330F4;
  }
`

FramedButton.propTypes = {
  big: PropTypes.bool,
  half: PropTypes.bool
}
