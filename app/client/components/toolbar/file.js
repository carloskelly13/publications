import React from "react"
import compose from "lodash.flowright"
import OpenDocumentModal from "../open-document"
import NewDocumentModal from "../new-document"
import { showModal as showModalAction } from "../../state/actions/app-ui"
import { saveDocument as saveDocumentAction } from "../../state/actions/document"
import {
  isDocumentActiveSelector,
  currentDocumentSelector
} from "../../state/selectors"
import { connect } from "react-redux"
import { MenuItem, MenuDivider } from "../ui/menu"
import asDropdownMenu from "../ui/menu-hoc"

const FileMenu = ({
  currentDocument,
  isDocumentActive,
  saveDocument,
  showModal
}) => (
  <div>
    <MenuItem
      onClick={() => showModal(NewDocumentModal)}
    >
      New…
    </MenuItem>
    <MenuItem
      onClick={() => showModal(OpenDocumentModal)}
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
      onClick={() => {}}
    >
      About Publications…
    </MenuItem>
  </div>
)

const mapStateToProps = state => ({
  isDocumentActive: isDocumentActiveSelector(state),
  currentDocument: currentDocumentSelector(state)
})

const mapDispatchToProps = {
  showModal: showModalAction,
  saveDocument: saveDocumentAction
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  asDropdownMenu({
    title: "File",
    buttonProps: { marginRight: true }
  })
)(FileMenu)
