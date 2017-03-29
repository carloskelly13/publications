import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const DeleteIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <svg version="1.1" id="Outline_Icons" xmlns="http://www.w3.org/2000/svg"  x="0px"
	 y="0px" width="24px" height="24px" viewBox="0 0 24 24">
    <g>
      <polygon fill="none" stroke={!disabled ? AppColors.DarkGray : "#aaa"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="16,20.504 0.5,20.504 0.5,3.504 16,3.504 23.5,12.004 	"/>

        <line fill="none" stroke={!disabled ? AppColors.DarkGray : "#aaa"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="13" y1="16.004" x2="5" y2="8.004"/>

        <line fill="none" stroke={!disabled ? AppColors.DarkGray : "#aaa"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" x1="5" y1="16.004" x2="13" y2="8.004"/>
    </g>
  </svg>
  <Text block color={!disabled ? AppColors.DarkGray : "#aaa"}>Remove</Text>
  </IconButton>
)
