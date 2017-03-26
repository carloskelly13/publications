import React from "react"
import { IconButton } from "./icon-button"

export const CloseIconButton = ({ onClick, margin, active }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="1 1 24 24">
      <g stroke={active ? "#fff" : "#aaa"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
        <circle cx="11.5" cy="11.5" r="11"/><path d="M15.742 7.258l-8.485 8.484M15.742 15.742l-8.485-8.484"/>
      </g>
    </svg>
  </IconButton>
)
