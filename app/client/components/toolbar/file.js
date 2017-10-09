import React from "react"
import compose from "lodash.flowright"
import OpenDocumentModal from "../open-document"
import NewDocumentModal from "../new-document"
import { connect } from "react-redux"
import { MenuItem, MenuDivider } from "../ui/menu"
import asDropdownMenu from "../ui/menu-hoc"
import { logOut } from "../../modules/session"
import { showModal } from "../../modules/ui"

const FileMenu = ({
  currentDocument = null,
  isDocumentActive = false,
  saveDocument = () => {},
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
      disabled={!isDocumentActive}
      onClick={() => saveDocument(currentDocument)}
    >
      Save
    </MenuItem>
    <MenuItem
      disabled={!isDocumentActive}
      onClick={() => {}}
    >
      Export as PDF…
    </MenuItem>
    <MenuItem
      disabled={!isDocumentActive}
      onClick={() => {}}
    >
      Delete
    </MenuItem>
    <MenuDivider />
    <MenuItem
      disabled={!isDocumentActive}
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

// const mapStateToProps = state => ({
//   isDocumentActive: isDocumentActiveSelector(state),
//   currentDocument: currentDocumentSelector(state)
// })

// const mapDispatchToProps = {
//   showModal: showModalAction,
//   saveDocument: saveDocumentAction,
//   logout: logoutAction
// }

export default compose(
  connect(
    state => ({

    }), {
      logOut,
      showModal
    }),
  asDropdownMenu({
    title: "File",
    buttonProps: { marginRight: true }
  })
)(FileMenu)
