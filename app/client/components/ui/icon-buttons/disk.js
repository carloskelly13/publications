import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import cloudUploadImagePath from "./images/cloud-upload.png"

export const DiskIconButton = ({ onClick, margin, disabled }) => (
  <IconButton
    disabled={disabled}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={cloudUploadImagePath}
      width={23}
      height={19}
      style={{ padding: "2px 0 0" }}
    />
    <Text block center color={disabled ? "#aaa" : AppColors.DarkGray}>
      Save
    </Text>
  </IconButton>
)
