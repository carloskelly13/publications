import React, { Component } from "react"
import PropTypes from "prop-types"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import FileMenu from "./file"
import NewShapeMenu from "./new-shape"
import ZoomMenu from "./zoom"
import ToolbarButton, { ButtonContainer } from "../ui/toolbar-button"
import { ContentContainer } from "../ui/containers"
import {
  currentDocumentSelector,
  editModeActiveSelector,
  sidePanelVisibleSelector,
  clipboardDataSelector,
  selectedShapeSelector
} from "../../state/selectors"
import { connect } from "react-redux"
import {
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

  handleSidePanelButton = () => {
    const { sidePanelVisible, setSidePanelVisible } = this.props
    setSidePanelVisible(!sidePanelVisible)
  }

  render() {
    const {
      currentDocument, copyShape, cutShape, deleteShape,
      pasteShape, clipboardData, selectedShape, adjustShapeLayer, sidePanelVisible
    } = this.props

    const forwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z < currentDocument.shapes.length
    const backwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z > 1
    const shapeControlButtonDisabled = !selectedShape || !currentDocument

    return (
      <ToolbarBase>
        <ContentContainer>
          <FileMenu />
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
            onClick={this.handleSidePanelButton}
          >
            Layers
          </ToolbarButton>
        </ContentContainer>
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
