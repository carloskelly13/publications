import React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";

export default ({ disabled, clipboardData, selectedObject, deleteObject }) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Edit</TextButton>}
    renderMenu={[
      <MenuItem
        key="cut-menu-item"
        disabled={!selectedObject}
        onClick={() => {}}
      >
        Cut
      </MenuItem>,
      <MenuItem
        key="copy-menu-item"
        disabled={!selectedObject}
        onClick={() => {}}
      >
        Copy
      </MenuItem>,
      <MenuItem
        key="paste-menu-item"
        disabled={!clipboardData}
        onClick={() => {}}
      >
        Paste
      </MenuItem>,
      <MenuDivider key="menu-divider-1" />,
      <MenuItem
        key="delete-menu-item"
        disabled={!selectedObject}
        onClick={deleteObject}
      >
        Delete
      </MenuItem>,
    ]}
  />
);
