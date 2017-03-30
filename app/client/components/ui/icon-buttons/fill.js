import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const FillIconButton = ({ onClick, margin, disabled, fillColor = "transparent" }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g
        stroke={!disabled ? AppColors.DarkGray : "#aaa"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
      >
        <path d="M20,12.5l-9-9L2.5,12 c-0.781,0.781-0.781,2.047,0,2.829L7.172,19.5c0.781,0.781,2.047,0.781,2.828,0l7-7H20z"/>
        <path d="M10.5,10.5v-8 c0-1.101-0.9-2-2-2l0,0c-1.1,0-2,0.899-2,2v5.516"/>
        <path fill={fillColor} d="M23.5,21 c0,1.381-1.119,2.5-2.5,2.5s-2.5-1.119-2.5-2.5s2.5-5.5,2.5-5.5S23.5,19.619,23.5,21z"/>
      </g>
    </svg>
    <Text block center color={!disabled ? AppColors.DarkGray : "#aaa"}>Fill</Text>
  </IconButton>
)
