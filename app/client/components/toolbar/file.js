import React from "react"
import compose from "lodash.flowright"
import OpenDocumentModal from "../open-document"
import NewDocumentModal from "../new-document"
import { connect } from "react-redux"
import { MenuItem, MenuDivider } from "../ui/menu"
import asDropdownMenu from "../ui/menu-hoc"
import { logOut } from "../../modules/session"
import { showModal } from "../../modules/ui"
import { currentDocumentSelector, saveDocument } from "../../modules/document"

const FileMenu = ({
  currentDocument,
  saveDocument,
  showModal: showModalAction,
  logOut: logOutAction
}) => (
  <div>
    <MenuItem
      onClick={() => showModalAction(NewDocumentModal)}
    >
      New…
    </MenuItem>
    <MenuItem
      onClick={() => showModalAction(OpenDocumentModal)}
    >
      Open…
    </MenuItem>
    <MenuDivider />
    <MenuItem
      disabled={!currentDocument}
      onClick={() => saveDocument(currentDocument)}
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
      onClick={logOutAction}
    >
      Log Out
    </MenuItem>
    <MenuItem
      onClick={() => {}}
    >
      About Publications…
    </MenuItem>
  </div>
)

export default compose(
  connect(
    state => ({
      currentDocument: currentDocumentSelector(state)
    }), {
      logOut,
      showModal,
      saveDocument
    }),
  asDropdownMenu({
    title: "File",
    buttonProps: { marginRight: true }
  })
)(FileMenu)
