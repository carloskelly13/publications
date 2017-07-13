import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import sendToBackImagePath from "./images/send-to-back.png"

export const BackwardsIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={sendToBackImagePath}
      width={20}
      height={20}
      style={{ padding: "1px 0 0" }}
    />
    <Text block center color={!disabled ? AppColors.DarkGray : "#aaa"}>Backward</Text>
  </IconButton>
)
