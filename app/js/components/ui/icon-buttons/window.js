import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../core/constants"

export const WindowIconButton = ({ onClick, margin, active }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g stroke={active ? AppColors.Highlight : AppColors.DarkGray} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
        <path d="M23.513 19.5c0 1.104-.895 2-2 2h-19c-1.104 0-2-.896-2-2v-14c0-1.104.896-2 2-2h19c1.105 0 2 .896 2 2v14zM.513 8.5h23"/>
        <circle cx="4.013" cy="6" r=".5"/>
        <circle cx="7.013" cy="6" r=".5"/>
        <circle cx="10.013" cy="6" r=".5"/>
        <path d="M7.513 8.5v13M7.513 13.5h16"/>
      </g>
    </svg>
    <Text block color={active ? AppColors.Highlight : AppColors.DarkGray}>
      Sidebar
    </Text>
  </IconButton>
)
