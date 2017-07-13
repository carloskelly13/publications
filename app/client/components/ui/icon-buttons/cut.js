import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import cutImagePath from "./images/cut.png"

export const CutIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={cutImagePath}
      width={22}
      height={19}
      style={{ padding: "2px 0 0" }}
    />
    <Text block center color={!disabled ? AppColors.DarkGray : "#aaa"}>Cut</Text>
  </IconButton>
)
