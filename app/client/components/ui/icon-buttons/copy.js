import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import copyImagePath from "./images/copy.png"

export const CopyIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={copyImagePath}
      width={20}
      height={20}
      style={{ padding: "1px 0 0" }}
    />
    <Text block color={!disabled ? AppColors.DarkGray : "#aaa"}>Copy</Text>
  </IconButton>
)
