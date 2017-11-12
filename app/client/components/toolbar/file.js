import React from "react"
import OpenDocumentModal from "../open-document"
import NewDocumentModal from "../new-document"
import { connect } from "react-redux"
import Menu, { MenuItem, MenuDivider } from "../ui/menu"
import { logOut } from "../../modules/session"
import { showModal } from "../../modules/ui"
import { currentDocumentSelector, saveDocument, setZoom } from "../../modules/document"
import { TextButton } from "../ui/text-button"

const FileMenu = ({
  currentDocument,
  saveDocument,
  showModal: showModalAction,
  logOut: logOutAction,
  setZoom
}) => (
  <Menu
    renderButton={(
      <TextButton>
        File
      </TextButton>
    )}
    renderMenu={(
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
          onClick={() => {
            setZoom(1.0)
            setTimeout(() => window.print(), 100)
          }}
        >
          Print and Export PDF…
        </MenuItem>
        <MenuItem
          disabled={!currentDocument}
          onClick={() => {}}
        >
          Delete
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
    )}
  />
)

export default connect(
  state => ({
    currentDocument: currentDocumentSelector(state)
  }), {
    logOut,
    showModal,
    saveDocument,
    setZoom
  })(FileMenu)
