import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"

export const ShapeAddIconButton = ({ onClick, margin, disabled, className }) => (
  <IconButton
    disabled={disabled}
    className={className}
    margin={margin}
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g stroke="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
        fill={disabled ? "#aaa" : AppColors.DarkGray}
        fillRule="nonzero">
        <path d="M9.5,20 L1,20 L1,1 L19,1 L19,9.5 C19,9.776 19.224,10 19.5,10 C19.776,10 20,9.776 20,9.5 L20,0.5 C20,0.224 19.776,0 19.5,0 L0.5,0 C0.224,0 0,0.224 0,0.5 L0,20.5 C0,20.776 0.224,21 0.5,21 L9.5,21 C9.776,21 10,20.776 10,20.5 C10,20.224 9.776,20 9.5,20 Z" />
        <path d="M17.5,11 C13.916,11 11,13.916 11,17.5 C11,21.084 13.916,24 17.5,24 C21.084,24 24,21.084 24,17.5 C24,13.916 21.084,11 17.5,11 Z M17.5,23 C14.468,23 12,20.532 12,17.5 C12,14.468 14.468,12 17.5,12 C20.532,12 23,14.468 23,17.5 C23,20.532 20.532,23 17.5,23 Z" />
        <path d="M20.227,17 L18,17 L18,14.772 C18,14.496 17.776,14.272 17.5,14.272 C17.224,14.272 17,14.496 17,14.772 L17,17 L14.772,17 C14.496,17 14.272,17.224 14.272,17.5 C14.272,17.776 14.496,18 14.772,18 L17,18 L17,20.228 C17,20.504 17.224,20.728 17.5,20.728 C17.776,20.728 18,20.504 18,20.228 L18,18 L20.227,18 C20.503,18 20.727,17.776 20.727,17.5 C20.727,17.224 20.503,17 20.227,17 Z" />
      </g>
    </svg>
    <Text block color={disabled ? "#aaa" : AppColors.DarkGray}>
      Insert
    </Text>
  </IconButton>
)
