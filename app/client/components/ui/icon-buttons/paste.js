import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import pasteImagePath from "./images/paste.png"

export const PasteIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={pasteImagePath}
      width={21}
      height={21}
    />
    <Text block color={!disabled ? AppColors.DarkGray : "#aaa"}>Paste</Text>
  </IconButton>
)
