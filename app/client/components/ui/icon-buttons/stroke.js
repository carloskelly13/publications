import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const StrokeIconButton = ({ onClick, margin, disabled, strokeColor = "transparent" }) => (
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
        <g transform="translate(9.000000, 0.000000)">
          <path d="M1.825,13.325 L3.443,14.943 L1.825,13.325 Z M1.83,16.67 L14.5,3 C14.5,1.301 14.696,0.5 12,0.5 L0.286,15.273 L1.83,16.67 Z" />
        </g>
        <path d="M0.5,21 C4.242,21.184 3.78,17.784 4.871,16.321 C6.027,14.772 8.269,14.445 9.819,15.602 C14.842,19.347 5.902,26.588 0.5,21 Z" fill={strokeColor} />
      </g>
    </svg>
    <Text block center color={!disabled ? AppColors.DarkGray : "#aaa"}>Stroke</Text>
  </IconButton>
)
