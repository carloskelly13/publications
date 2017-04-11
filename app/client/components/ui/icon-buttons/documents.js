import React from "react"
import { IconButton } from "./icon-button"
import { AppColors } from "../../../util/constants"
import { Text } from "../text"

export const DocumentsIconButton = ({ onClick, margin }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g stroke={AppColors.DarkGray} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
        <path d="M10.5 10.5h-8v-10h5l3 3zM7.5.5v3h3"/><path d="M21.5 23.5h-8v-10h5l3 3zM18.5 13.5v3h3"/><path d="M10.5 23.5h-8v-10h5l3 3zM7.5 13.5v3h3"/><path d="M21.5 10.5h-8v-10h5l3 3zM18.5.5v3h3"/>
      </g>
    </svg>
    <Text block center>Documents</Text>
  </IconButton>
)
