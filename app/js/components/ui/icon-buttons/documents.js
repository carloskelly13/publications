import React from "react"
import { IconButton } from "./icon-button"

export const DocumentsIconButton = ({ onClick, margin, active }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g stroke={active ? "#fff" : "#aaa"} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
        <path d="M10.5 10.5h-8v-10h5l3 3zM7.5.5v3h3"/><path d="M21.5 23.5h-8v-10h5l3 3zM18.5 13.5v3h3"/><path d="M10.5 23.5h-8v-10h5l3 3zM7.5 13.5v3h3"/><path d="M21.5 10.5h-8v-10h5l3 3zM18.5.5v3h3"/>
      </g>
    </svg>
  </IconButton>
)
