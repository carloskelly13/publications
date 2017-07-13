import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import documentImagePath from "./images/document.png"

export const DocumentIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={documentImagePath}
      width={20}
      height={20}
      style={{ padding: "1px 0 0" }}
    />
    <Text block center color={disabled ? "#aaa" : AppColors.DarkGray}>
      Settings
    </Text>
  </IconButton>
)
