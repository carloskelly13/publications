import React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";

export default ({
  currentDocument,
  saveDocument = () => {},
  logOut,
  showNewDocumentModal,
  showOpenDocumentModal,
  setZoom,
}) => (
  <Menu
    renderButton={<TextButton>File</TextButton>}
    renderMenu={
      <div>
        <MenuItem onClick={showNewDocumentModal}>New…</MenuItem>
        <MenuItem onClick={showOpenDocumentModal}>Open…</MenuItem>
        <MenuDivider />
        <MenuItem
          disabled={!currentDocument}
          onClick={() => saveDocument(currentDocument)}
        >
          Save
        </MenuItem>
        <MenuItem
          disabled={!currentDocument}
          onClick={() => {
            setZoom(1.0);
            setTimeout(() => window.print(), 100);
          }}
        >
          Print and Export PDF…
        </MenuItem>
        <MenuItem disabled={!currentDocument} onClick={() => {}}>
          Delete
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={logOut}>Log Out</MenuItem>
        <MenuItem onClick={() => {}}>About Publications…</MenuItem>
      </div>
    }
  />
);
