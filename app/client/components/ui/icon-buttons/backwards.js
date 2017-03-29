import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const BackwardsIconButton = ({ onClick, margin, disabled }) => (
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
        <path d="M17.5 6.5h6v17h-17v-6"/><path d="M.5.5h17v17h-17z"/>
      </g>
    </svg>
    <Text block center color={!disabled ? AppColors.DarkGray : "#aaa"}>Backward</Text>
  </IconButton>
)
