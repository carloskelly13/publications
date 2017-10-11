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
currentDocumentSelector, selectedShapeSelector
} from "../../modules/document"
import { currentUserSelector } from "../../modules/session"
import { sidePanelVisibleSelector, toggleSidePanel } from "../../modules/ui"

const Toolbar = props => {
  const {
    user,
    currentDocument,
    copyShape = () => {},
    cutShape = () => {},
    deleteShape = () => {},
    pasteShape = () => {},
    clipboardData = null,
    selectedShape,
    adjustShapeLayer = () => {},
    sidePanelVisible,
    toggleSidePanel
  } = props
  const forwardButtonEnabled = selectedShape && currentDocument &&
    selectedShape.z < currentDocument.shapes.length
  const backwardButtonEnabled = selectedShape && currentDocument &&
    selectedShape.z > 1
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
            disabled={shapeControlButtonDisabled || !clipboardData}
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
        <ButtonContainer>
          <ToolbarButton
            disabled={!forwardButtonEnabled}
            onClick={() => adjustShapeLayer({
              shape: selectedShape,
              direction: "forward"
            })}
          >
            Forwards
          </ToolbarButton>
          <ToolbarButton
            disabled={!backwardButtonEnabled}
            onClick={() => adjustShapeLayer({
              shape: selectedShape,
              direction: "backward"
            })}
          >
            Backwards
          </ToolbarButton>
        </ButtonContainer>
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
    sidePanelVisible: sidePanelVisibleSelector(state)
  }), {
    toggleSidePanel
  })(Toolbar)
