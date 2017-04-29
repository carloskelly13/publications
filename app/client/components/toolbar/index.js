import React, { Component, PropTypes } from "react"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import NewShapeMenu from "./new-shape"
import ZoomMenu from "./zoom"
import {
  GridIconButton, DiskIconButton, CutIconButton, CopyIconButton,
  PasteIconButton, DeleteIconButton,
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
import { CompactPicker } from "react-color"
import styled from "styled-components"
import get from "lodash.get"

const ColorPickerContainer = styled.div`
  position: relative;
`

const ColorPickerInnerContainer = styled.div`
  position: absolute;
  top: 45px;
`

class Toolbar extends Component {
  constructor() {
    super(...arguments)
    this.handleGridButton = this.handleGridButton.bind(this)
    this.handleSidePanelButton = this.handleSidePanelButton.bind(this)
  }

  state = {
    fillColorPickerVisible: false,
    strokeColorPickerVisible: false
  }

  componentWillReceiveProps({ selectedShape }) {
    if (get(this.props.selectedShape, "id", -1) !== get(selectedShape, "id", -2)) {
      this.setState({
        fillColorPickerVisible: false,
        strokeColorPickerVisible: false
      })
    }
  }

  handleGridButton() {
    const { editModeActive, setEditModeActive } = this.props
    setEditModeActive(!editModeActive)
  }

  handleSidePanelButton() {
    const { sidePanelVisible, setSidePanelVisible } = this.props
    setSidePanelVisible(!sidePanelVisible)
  }

  toggleFillColorPicker = () => {
    this.setState(prevState => ({
      fillColorPickerVisible: !prevState.fillColorPickerVisible,
      strokeColorPickerVisible: false
    }))
  }

  toggleStrokeColorPicker = () => {
    this.setState(prevState => ({
      strokeColorPickerVisible: !prevState.strokeColorPickerVisible,
      fillColorPickerVisible: false
    }))
  }

  render() {
    const {
      currentDocument, editModeActive, saveDocument,
      copyShape, cutShape, deleteShape, pasteShape, clipboardData,
      sidePanelVisible, selectedShape, adjustShapeLayer,
      updateShape
    } = this.props

    const {
      fillColorPickerVisible,
      strokeColorPickerVisible
    } = this.state

    const forwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z < currentDocument.shapes.length
    const backwardButtonEnabled = selectedShape && currentDocument &&
      selectedShape.z > 1
    const shapeControlButtonDisabled = !selectedShape || !currentDocument
    const isSelectedShapeText = selectedShape && selectedShape.type === "text"

    const showFillColorPicker = fillColorPickerVisible && selectedShape &&
      selectedShape.fill

    const showStrokeColorPicker = strokeColorPickerVisible && selectedShape &&
      selectedShape.type !== "text" && selectedShape.stroke

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
          <ColorPickerContainer>
            <FillIconButton
              margin
              disabled={shapeControlButtonDisabled}
              fillColor={selectedShape && selectedShape.fill}
              onClick={this.toggleFillColorPicker}
            />
            { showFillColorPicker && (
              <ColorPickerInnerContainer>
                <CompactPicker
                  color={selectedShape.fill}
                  onChangeComplete={({ hex }) => updateShape({ fill: hex })}
                />
              </ColorPickerInnerContainer>
            ) }
          </ColorPickerContainer>
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
  adjustShapeLayer: adjustShapeLayerAction,
  updateShape: updateShapeAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)
