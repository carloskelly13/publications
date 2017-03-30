import React, { Component, PropTypes } from "react"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import { AboutButton } from "../ui/about.button"
import NewShapeMenu from "./new-shape"
import ZoomMenu from "./zoom"
import {
  GridIconButton, DiskIconButton, CutIconButton, CopyIconButton,
  PasteIconButton, DeleteIconButton, DocumentsIconButton, CloseIconButton,
  IconContainer, WindowIconButton, ForwardsIconButton, BackwardsIconButton,
  FillIconButton, StrokeIconButton
} from "../ui/icon-buttons"
import {
  currentDocumentSelector,
  editModeActiveSelector,
  sidePanelVisibleSelector,
  clipboardDataSelector,
  selectedShapeSelector
} from "../../state/selectors"
import { connect } from "react-redux"
import { Text } from "../ui/text"
import {
  showModal as showModalAction,
  hideModal as hideModalAction,
  setEditModeActive as setEditModeActiveAction,
  setSidePanelVisible as setSidePanelVisibleAction,
} from "../../state/actions/app-ui"
import {
  saveDocument as saveDocumentAction,
  updateCurrentDocument as setSelectedDocumentAction,
  cutShape as cutShapeAction,
  copyShape as copyShapeAction,
  pasteShape as pasteShapeAction,
  deleteShape as deleteShapeAction,
  adjustShapeLayer as adjustShapeLayerAction
} from "../../state/actions/document"

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
      copyShape, cutShape, deleteShape, pasteShape, clipboardData,
      sidePanelVisible, selectedShape, adjustShapeLayer
    } = this.props

    const forwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z < currentDocument.shapes.length
    const backwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z > 1
    const shapeControlButtonDisabled = !selectedShape || !currentDocument
    const isSelectedShapeText = selectedShape && selectedShape.type === "text"

    return (
      <ToolbarBase>
        <IconContainer>
          <NewShapeMenu disabled={!currentDocument} />
          <CutIconButton
            margin
            disabled={shapeControlButtonDisabled}
            onClick={() => cutShape(selectedShape)}
          />
          <CopyIconButton
            margin
            disabled={shapeControlButtonDisabled}
            onClick={() => copyShape(selectedShape)}
          />
          <PasteIconButton
            margin
            disabled={shapeControlButtonDisabled}
            onClick={() => pasteShape()}
          />
          <DeleteIconButton
            margin
            disabled={shapeControlButtonDisabled}
            onClick={() => deleteShape(selectedShape)}
          />
        </IconContainer>
        <IconContainer>
          <ForwardsIconButton
            margin
            disabled={!forwardButtonEnabled}
            onClick={() => adjustShapeLayer({
              shape: selectedShape,
              direction: "forward"
            })}
          />
          <BackwardsIconButton
            disabled={!backwardButtonEnabled}
            onClick={() => adjustShapeLayer({
              shape: selectedShape,
              direction: "backward"
            })}
          />
        </IconContainer>
        <IconContainer>
          <FillIconButton
            margin
            disabled={shapeControlButtonDisabled}
            fillColor={selectedShape && selectedShape.fill}
          />
          <StrokeIconButton
            disabled={shapeControlButtonDisabled || isSelectedShapeText}
            strokeColor={selectedShape && selectedShape.stroke}
          />
        </IconContainer>
        <IconContainer>
          <ZoomMenu disabled={!currentDocument} />
          <GridIconButton
            margin
            onClick={this.handleGridButton}
            active={editModeActive}
            disabled={!currentDocument}
          />
          <DiskIconButton
            margin
            disabled={!currentDocument}
            onClick={() => saveDocument(currentDocument)}
          />
          <WindowIconButton
            onClick={this.handleSidePanelButton}
            active={sidePanelVisible}
          />
        </IconContainer>
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
  sidePanelVisible: sidePanelVisibleSelector(state),
  clipboardData: clipboardDataSelector(state),
  selectedShape: selectedShapeSelector(state)
})

const mapDispatchToProps = {
  showModal: showModalAction,
  hideModal: hideModalAction,
  setEditModeActive: setEditModeActiveAction,
  saveDocument: saveDocumentAction,
  setSelectedDocument: setSelectedDocumentAction,
  setSidePanelVisible: setSidePanelVisibleAction,
  copyShape: copyShapeAction,
  pasteShape: pasteShapeAction,
  cutShape: cutShapeAction,
  deleteShape: deleteShapeAction,
  adjustShapeLayer: adjustShapeLayerAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
