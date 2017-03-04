import React, { PropTypes } from "react"
import styled from "styled-components"
import { AppColors } from "../../core/constants"

const _width = ({ big = false, half = false }) => {
  if (big) { return "100%" }
  if (half) { return "calc(~'50% - 5px')"; }
  return "auto"
}

export const FramedButton = styled.button`
  background: #fff;
  border: 1px solid ${({ primary }) => primary ? AppColors.Active : "#ccc"};
  border-radius: 2px;
  box-sizing: border-box;
  line-height: 1em;
  font-size: ${({ big }) => big ? "18px" : "13px"};
  font-weight: 500;
  margin: ${({ margin }) => margin ? "0 5px" : "0"};
  padding: ${({ big }) => big ? "9px 32px 8px" : "6px 16px" };
  text-decoration: none;
  color: ${({ primary }) => primary ? AppColors.Active : "#616161"};
  width: ${_width};

  &:hover {
    background: ${({ primary }) => primary ? AppColors.ActiveLight : "#f7f7f7"};
    border-color: ${({ primary }) => primary ? AppColors.ActiveDark : "#aaa"};
    color: ${({ primary }) => primary ? "#fff" : "#424242"};
  }

  &:active {
    background: ${({ primary }) => primary ? AppColors.Active : "#f0f0f0"};
    border-color: ${({ primary }) => primary ? AppColors.ActiveDark : "#aaa"};
    color: ${({ primary }) => primary ? "#fff" : "#424242"};
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
