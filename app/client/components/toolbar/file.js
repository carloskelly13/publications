import React from "react"
import { MenuItem, MenuDivider } from "../ui/menu"
import componentAsDropdownMenu from "../ui/menu-hoc"

const FileMenu = ({
  currentDocument,
  handleNewDocument,
  handleSaveDocument,
  handleOpenDocument
}) => (
  <div>
    <MenuItem
      onClick={handleNewDocument}
    >
      New…
    </MenuItem>
    <MenuItem
      onClick={handleOpenDocument}
    >
      Open…
    </MenuItem>
    <MenuDivider />
    <MenuItem
      disabled={!currentDocument}
      onClick={() => handleSaveDocument(currentDocument)}
    >
      Save
    </MenuItem>
    <MenuItem
      disabled={!currentDocument}
      onClick={() => {}}
    >
      Export as PDF…
    </MenuItem>
    <MenuItem
      disabled={!currentDocument}
      onClick={() => {}}
    >
      Delete
    </MenuItem>
    <MenuDivider />
    <MenuItem
      disabled={!currentDocument}
      onClick={() => {}}
    >
      Page Setup…
    </MenuItem>
    <MenuDivider />
    <MenuItem
      onClick={() => {}}
    >
      About Publications…
    </MenuItem>
  </div>
)

export default componentAsDropdownMenu({
  title: "File",
  buttonProps: { marginRight: true },
  menuContent: FileMenu
})
