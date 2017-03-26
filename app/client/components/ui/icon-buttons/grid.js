import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const GridIconButton = ({ onClick, active, margin }) => (
  <IconButton
    disabled={!active}
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
        stroke={active ? AppColors.Highlight : AppColors.DarkGray}
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
    <Text block color={active ? AppColors.Highlight : AppColors.DarkGray}>
      Grid
    </Text>
  </IconButton>
)
