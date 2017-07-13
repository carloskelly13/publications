import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import removeImagePath from "./images/remove.png"

export const DeleteIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={removeImagePath}
      width={22}
      height={21}
    />
  <Text block color={!disabled ? AppColors.DarkGray : "#aaa"}>Remove</Text>
  </IconButton>
)
