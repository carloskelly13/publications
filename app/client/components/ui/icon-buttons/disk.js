import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const DiskIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g>
        <path
          stroke={disabled ? "#aaa" : AppColors.DarkGray}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          fill="none"
          d="M23.5.5h-20l-3 3v20h23zM4.5.5h15v5h-15zM4.5 20.5h15v3h-15z"
        />
        <circle
          stroke={disabled ? "#aaa" : AppColors.DarkGray}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          cx="12"
          cy="11.5"
          r="4"
          fill="none"
        />
        <path
          stroke={disabled ? "#aaa" : AppColors.DarkGray}
          d="M12 11c-.276 0-.5.225-.5.5 0 .276.224.5.5.5s.5-.224.5-.5c0-.275-.224-.5-.5-.5z"
        />
      </g>
    </svg>
    <Text block center color={disabled ? "#aaa" : AppColors.DarkGray}>
      Save
    </Text>
  </IconButton>
)
