import React from "react"
import { IconButton } from "./icon-button"
import { Text } from "../text"
import { AppColors } from "../../../util/constants"
import zoomImagePath from "./images/zoom.png"

export const ZoomIconButton = ({ onClick, margin, disabled, className }) => (
  <IconButton
    disabled={disabled}
    className={className}
    margin={margin}
    onClick={onClick}
  >
    <img
      src={zoomImagePath}
      width={19}
      height={19}
      style={{ padding: "2px 0 0" }}
    />
    <Text block color={disabled ? "#aaa" : AppColors.DarkGray}>
      Zoom
    </Text>
  </IconButton>
)
