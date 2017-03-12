import React, { Component, PropTypes } from "react"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import { AboutButton } from "../ui/about.button"
import {
  GridIconButton, DiskIconButton, CutIconButton, CopyIconButton,
  PasteIconButton, DeleteIconButton, DocumentsIconButton, CloseIconButton
} from "../ui/icon-buttons"
import {
  currentDocumentSelector, editModeActiveSelector, sidePanelVisibleSelector
} from "../../selectors"
import { connect } from "react-redux"
import { StrongText } from "../ui/text"
import {
  showModal as showModalAction,
  hideModal as hideModalAction,
  setEditModeActive as setEditModeActiveAction,
  setSidePanelVisible as setSidePanelVisibleAction
} from "../../actions/app-ui"
import {
  saveDocument as saveDocumentAction,
  updateCurrentDocument as setSelectedDocumentAction
} from "../../actions/document"

class Toolbar extends Component {
  constructor() {
    super(...arguments)
    this.handleGridButton = this.handleGridButton.bind(this)
    this.handleSidePanelButton = this.handleSidePanelButton.bind(this)
  }

  handleGridButton() {
    const { editModeActive, setEditModeActive } = this.props
    setEditModeActive(!editModeActive)
  }

  handleSidePanelButton() {
    const { sidePanelVisible, setSidePanelVisible } = this.props
    setSidePanelVisible(!sidePanelVisible)
  }

  render() {
    const {
      currentDocument, editModeActive, saveDocument, setSelectedDocument,
      sidePanelVisible
    } = this.props
    return (
      <ToolbarBase>
        <StrongText white size="1.1em">Publications</StrongText>
        { currentDocument && (
          <div>
            <DiskIconButton
              margin
              onClick={() => saveDocument(currentDocument)}
            />
            <CutIconButton
              margin
              onClick={() => {}}
            />
            <CopyIconButton
              margin
              onClick={() => {}}
            />
            <PasteIconButton
              margin
              onClick={() => {}}
            />
            <DeleteIconButton
              margin
              onClick={() => {}}
            />
            <GridIconButton
              margin
              onClick={this.handleGridButton}
              active={editModeActive}
            />
          </div>
        ) }
        <div>
          <DocumentsIconButton
            onClick={this.handleSidePanelButton}
            active={sidePanelVisible}
          />
        </div>
      </ToolbarBase>
    )
  }
}

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  currentDocument: currentDocumentSelector(state),
  editModeActive: editModeActiveSelector(state),
  sidePanelVisible: sidePanelVisibleSelector(state)
})

const mapDispatchToProps = {
  showModal: showModalAction,
  hideModal: hideModalAction,
  setEditModeActive: setEditModeActiveAction,
  saveDocument: saveDocumentAction,
  setSelectedDocument: setSelectedDocumentAction,
  setSidePanelVisible: setSidePanelVisibleAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
