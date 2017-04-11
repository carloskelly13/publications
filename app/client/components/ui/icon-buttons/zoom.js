import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const ZoomIconButton = ({ onClick, margin, disabled, className }) => (
  <IconButton
    disabled={disabled}
    className={className}
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
        stroke={disabled ? "#aaa" : AppColors.DarkGray}
        fill="none"
        fillRule="nonzero"
      >
        <circle cx="8.5" cy="8.5" r="8"/>
        <path strokeLinecap="round" d="M14.167 14.166l9.333 9.334M5 8.5h7M8.5 5v7"/>
      </g>
    </svg>
    <Text block color={disabled ? "#aaa" : AppColors.DarkGray}>
      Zoom
    </Text>
  </IconButton>
)
