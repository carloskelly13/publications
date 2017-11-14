import React, { Component } from "react"
import styled from "styled-components"
import get from "lodash/get"
import { connect } from "react-redux"
import {
  currentDocumentSelector, fetchDocument, backgroundGridLineRangesSelector,
  sortedShapesSelector, updateSelectedShape, documentMetricsSelector, selectedShapeSelector,
  editingTextBoxIdSelector, setEditingTextBox, zoomSelector
} from "../../modules/document"
import {
  AppColors, contentPanelWidthFull, contentPanelWidthPartial, Keys
} from "../../util/constants"
import Canvas from "../canvas"
import Ruler from "../rulers"

const Container = styled.div`
  transition: width 350ms ease-in-out;
  background: ${AppColors.Gray20};
  overflow: scroll;
  width: ${
    ({ sidePanelVisible }) => sidePanelVisible ? contentPanelWidthPartial : contentPanelWidthFull
  };
  z-index: 1;
  height: 100%;
`

class EditorView extends Component {
  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 }
  }

  componentWillMount() {
    const { match: { params: { id } } } = this.props
    if (id) {
      this.props.fetchDocument(id)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = nextProps
    if (get(this.props.currentDocument, "id") !== id) {
      this.containerRef.scrollTop = 0
      this.containerRef.scrollLeft = 0
      this.props.fetchDocument(id)
    }
  }

  handleViewScrollEvent = ({ target: { scrollLeft, scrollTop } }) => {
    this.setState({ scrollOffset: { scrollLeft, scrollTop } })
  }

  handleKeyPress = event => {
    if (!this.props.selectedShape || this.props.editingTextBoxId) {
      return
    }

    const arrowKeys = [Keys.Up, Keys.Down, Keys.Left, Keys.Right]
    if (arrowKeys.indexOf(event.keyCode) > -1) {
      event.preventDefault()
    }

    const changes = {}
    switch (event.keyCode) {
    case Keys.Up:
      changes.y = this.props.selectedShape.y - 0.05
      break
    case Keys.Down:
      changes.y = this.props.selectedShape.y + 0.05
      break
    case Keys.Left:
      changes.x = this.props.selectedShape.x - 0.05
      break
    case Keys.Right:
      changes.x = this.props.selectedShape.x + 0.05
      break
    }

    if (Object.keys(changes).length > 0) {

      Object.keys(changes).forEach(key => {
        changes[key] = parseFloat(changes[key].toFixed(2))
      })

      this.props.updateSelectedShape(changes)
    }
  }

  render() {
    const {
      props: {
        currentDocument,
        sortedShapes,
        selectedShape,
        documentMetrics,
        editingTextBoxId,
        editModeActive = true,
        sidePanelVisible = false,
        backgroundGridLineRanges,
        zoom
      },
      state: { scrollOffset }
    } = this
    const orientation = documentMetrics.width > documentMetrics.height ?
      "landscape" : "portrait"
    return (
      <Container
        sidePanelVisible={sidePanelVisible}
        innerRef={c => (this.containerRef = c)}
        onKeyDown={this.handleKeyPress}
        onScroll={this.handleViewScrollEvent}
        tabIndex={0}
      >
        {currentDocument && (
          <div>
            <Ruler
              showDetail={editModeActive}
              scrollOffset={scrollOffset}
              doc={currentDocument}
              zoom={zoom}
            />
            <Canvas
              allowsEditing
              doc={currentDocument}
              dpi={96}
              zoom={zoom}
              selectedShape={selectedShape}
              sortedShapes={sortedShapes}
              documentMetrics={documentMetrics}
              updateSelectedShape={this.props.updateSelectedShape}
              backgroundGridLineRanges={backgroundGridLineRanges}
              setEditingTextBox={this.props.setEditingTextBox}
              editingTextBoxId={editingTextBoxId}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @page {
                    size: ${orientation};
                    margin: 0mm;
                    marks: none;
                  }
                  @media print {
                    html, body { margin: 0; }
                  }
                `
              }}
            />
          </div>
        )}
      </Container>
    )
  }
}

export default connect(
  state => ({
    currentDocument: currentDocumentSelector(state),
    documentMetrics: documentMetricsSelector(state),
    sortedShapes: sortedShapesSelector(state),
    selectedShape: selectedShapeSelector(state),
    backgroundGridLineRanges: backgroundGridLineRangesSelector(state),
    editingTextBoxId: editingTextBoxIdSelector(state),
    zoom: zoomSelector(state)
  }), {
    fetchDocument,
    updateSelectedShape,
    setEditingTextBox
  })(EditorView)
