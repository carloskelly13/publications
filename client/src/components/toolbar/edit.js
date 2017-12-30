import React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";

export default ({
  disabled,
  clipboardContents,
  selectedObject,
  deleteObject,
  handleClipboardAction,
}) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Edit</TextButton>}
    renderMenu={[
      <MenuItem
        key="cut-menu-item"
        disabled={!selectedObject}
        onClick={() => handleClipboardAction("cut")}
      >
        Cut
      </MenuItem>,
      <MenuItem
        key="copy-menu-item"
        disabled={!selectedObject}
        onClick={() => handleClipboardAction("copy")}
      >
        Copy
      </MenuItem>,
      <MenuItem
        key="paste-menu-item"
        disabled={!clipboardContents}
        onClick={() => handleClipboardAction("paste")}
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
