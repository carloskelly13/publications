// @flow
import * as React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";

type Props = {
  disabled: boolean,
  layersPanelVisible: boolean,
  toggleLayersPanel: () => void,
};
export default ({ disabled, toggleLayersPanel, layersPanelVisible }: Props) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Layers</TextButton>}
    renderMenu={
      <>
        <MenuItem onClick={toggleLayersPanel}>
          {layersPanelVisible ? "Hide" : "Show"}&nbsp;Layers Panel
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => {}}>Move Object Forwards</MenuItem>
        <MenuItem onClick={() => {}}>Move Object Backwards</MenuItem>
      </>
    }
  />
);
