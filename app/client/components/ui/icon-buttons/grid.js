import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import rulerImagePath from "./images/ruler.png"

export const GridIconButton = ({ onClick, active, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={rulerImagePath}
      width={25}
      height={24}
    />
    <Text block color={!disabled ? AppColors.DarkGray : "#aaa"}>
      { active ? "Hide Metrics" : "Show Metrics" }
    </Text>
  </IconButton>
)
