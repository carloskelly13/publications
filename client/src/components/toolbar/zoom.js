import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { TextButton } from "../ui/text-button";

const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2, 4];

export default ({ setZoom, disabled }) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Zoom</TextButton>}
    renderMenu={zoomLevels.map(zoom => (
      <MenuItem
        disabled={disabled}
        key={`zoom-${zoom}`}
        onClick={() => setZoom(zoom)}
      >
        {zoom * 100}%
      </MenuItem>
    ))}
  />
);
