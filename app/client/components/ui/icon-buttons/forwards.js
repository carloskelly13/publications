import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import bringToFrontImagePath from "./images/bring-to-front.png"

export const ForwardsIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={bringToFrontImagePath}
      width={20}
      height={20}
      style={{ padding: "1px 0 0" }}
    />
    <Text block center color={!disabled ? AppColors.DarkGray : "#aaa"}>Forward</Text>
  </IconButton>
)
