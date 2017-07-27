import React, { Component } from "react"
import PropTypes from "prop-types"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import NewShapeMenu from "./new-shape"
import ZoomMenu from "./zoom"
import {
  DiskIconButton, CutIconButton, CopyIconButton,
  PasteIconButton, DeleteIconButton,
  IconContainer, ForwardsIconButton, BackwardsIconButton,
  DownloadIconButton, DocumentIconButton
} from "../ui/icon-buttons"
import {
  currentDocumentSelector,
  editModeActiveSelector,
  sidePanelVisibleSelector,
  clipboardDataSelector,
  selectedShapeSelector
} from "../../state/selectors"
import { connect } from "react-redux"
import {
  showModal as showModalAction,
  hideModal as hideModalAction,
  setEditModeActive as setEditModeActiveAction,
  setSidePanelVisible as setSidePanelVisibleAction
} from "../../state/actions/app-ui"
import {
  saveDocument as saveDocumentAction,
  updateCurrentDocument as setSelectedDocumentAction,
  cutShape as cutShapeAction,
  copyShape as copyShapeAction,
  pasteShape as pasteShapeAction,
  deleteShape as deleteShapeAction,
  adjustShapeLayer as adjustShapeLayerAction,
  updateSelectedShape as updateShapeAction
} from "../../state/actions/document"
import get from "lodash.get"

class Toolbar extends Component {

  componentWillReceiveProps({ selectedShape }) {
    if (get(this.props.selectedShape, "id", -1) !== get(selectedShape, "id", -2)) {
      this.setState({
        fillColorPickerVisible: false,
        strokeColorPickerVisible: false
      })
    }
  }

  // handleGridButton = () => {
  //   const { editModeActive, setEditModeActive } = this.props
  //   setEditModeActive(!editModeActive)
  // }

  handleSidePanelButton = () => {
    const { sidePanelVisible, setSidePanelVisible } = this.props
    setSidePanelVisible(!sidePanelVisible)
  }

  render() {
    const {
      currentDocument, saveDocument,
      copyShape, cutShape, deleteShape, pasteShape, clipboardData,
      selectedShape, adjustShapeLayer
    } = this.props

    const forwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z < currentDocument.shapes.length
    const backwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z > 1
    const shapeControlButtonDisabled = !selectedShape || !currentDocument

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
            disabled={shapeControlButtonDisabled || !clipboardData}
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
          <ZoomMenu disabled={!currentDocument} />
          <DiskIconButton
            margin
            disabled={!currentDocument}
            onClick={() => saveDocument(currentDocument)}
          />
          <DownloadIconButton
            margin
            disabled={!currentDocument}
            onClick={() => {}}
          />
          <DocumentIconButton
            disabled={!currentDocument}
            onClick={() => {}}
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
  adjustShapeLayer: adjustShapeLayerAction,
  updateShape: updateShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
