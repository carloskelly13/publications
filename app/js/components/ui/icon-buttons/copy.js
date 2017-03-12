import React from "react"
import { IconButton } from "./icon-button"

export const CopyIconButton = ({ onClick, margin, active }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g stroke={active ? "#fff" : "#aaa"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
        <path d="M15.5 23.5h-14v-20h9l5 5zM10.5 3.5v5h5M7.5 3.5v-3h9l5 5v15h-6M16.5.5v5h5"/>
      </g>
    </svg>
  </IconButton>
)
