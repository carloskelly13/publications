import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import FileMenu from "./file"
import NewShapeMenu from "./new-shape"
import ZoomMenu from "./zoom"
import ToolbarButton, { ButtonContainer } from "../ui/toolbar-button"
import { ContentContainer } from "../ui/containers"
import {
currentDocumentSelector, selectedShapeSelector, cutShape, copyShape,
pasteShape, deleteShape, clipboardDataSelector
} from "../../modules/document"
import { currentUserSelector } from "../../modules/session"
import { sidePanelVisibleSelector, toggleSidePanel } from "../../modules/ui"

const Toolbar = props => {
  const {
    user,
    currentDocument,
    copyShape,
    cutShape,
    deleteShape,
    pasteShape,
    clipboardData,
    selectedShape,
    sidePanelVisible,
    toggleSidePanel
  } = props
  const shapeControlButtonDisabled = !selectedShape || !currentDocument
  return (
    <ToolbarBase>
      <ContentContainer>
        <FileMenu disabled={!user} />
        <NewShapeMenu disabled={!currentDocument} />
        <ButtonContainer>
          <ToolbarButton
            disabled={shapeControlButtonDisabled}
            onClick={() => cutShape(selectedShape)}
          >
            Cut
          </ToolbarButton>
          <ToolbarButton
            disabled={shapeControlButtonDisabled}
            onClick={() => copyShape(selectedShape)}
          >
            Copy
          </ToolbarButton>
          <ToolbarButton
            marginRight
            disabled={!currentDocument || !clipboardData}
            onClick={() => pasteShape()}
          >
            Paste
          </ToolbarButton>
        </ButtonContainer>
        <ToolbarButton
          disabled={shapeControlButtonDisabled}
          onClick={() => deleteShape(selectedShape)}
        >
          Delete
        </ToolbarButton>
      </ContentContainer>
      <ContentContainer>
        <ZoomMenu disabled={!currentDocument} />
        <ToolbarButton
          disabled={!currentDocument}
          active={sidePanelVisible}
          onClick={toggleSidePanel}
        >
          Layers
        </ToolbarButton>
      </ContentContainer>
    </ToolbarBase>
  )
}

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(
  state => ({
    user: currentUserSelector(state),
    currentDocument: currentDocumentSelector(state),
    selectedShape: selectedShapeSelector(state),
    sidePanelVisible: sidePanelVisibleSelector(state),
    clipboardData: clipboardDataSelector(state)
  }), {
    toggleSidePanel,
    cutShape,
    copyShape,
    pasteShape,
    deleteShape
  })(Toolbar)
