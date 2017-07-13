import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import downloadImagePath from "./images/download.png"

export const DownloadIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={downloadImagePath}
      width={18}
      height={20}
      style={{ padding: "1px 0 0" }}
    />
    <Text block center color={disabled ? "#aaa" : AppColors.DarkGray}>
      PDF
    </Text>
  </IconButton>
)
