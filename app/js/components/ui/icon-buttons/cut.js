import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../core/constants"

export const CutIconButton = ({ onClick, margin, active }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g
        stroke={active ? AppColors.DarkGray : "#aaa"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
      >
        <circle cx="4.145" cy="18" r="3.5"/>
        <path d="M13.145 12l10.242-6.088c-.561-.951-1.953-1.311-2.905-.75l-15.91 9.364"/>
        <circle cx="4.145" cy="6" r="3.5"/>
        <path d="M11.035 10.731l12.352 7.355c-.561.951-1.953 1.312-2.905.75l-15.837-9.336"/>
      </g>
    </svg>
    <Text block center color={active ? AppColors.DarkGray : "#aaa"}>Cut</Text>
  </IconButton>
)
