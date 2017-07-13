import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import addImagePath from "./images/add.png"

export const ShapeAddIconButton = ({ onClick, margin, disabled, className }) => (
  <IconButton
    disabled={disabled}
    className={className}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={addImagePath}
      width={22}
      height={21}
    />
    <Text block color={disabled ? "#aaa" : AppColors.DarkGray}>
      Insert
    </Text>
  </IconButton>
)
