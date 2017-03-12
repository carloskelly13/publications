import React from "react"
import { IconButton } from "./icon-button"

export const GridIconButton = ({ onClick, active, margin }) => (
  <IconButton
    margin={margin}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g
        stroke={active ? "#fff" : "#aaa"}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        fill="none"
      >
        <path
          d="M6.5.5v23M11.5.5v23M16.5.5v23M23.5 6.5h-23M23.5 11.5h-23M23.5 16.5h-23"
        />
      </g>
    </svg>
  </IconButton>
)
