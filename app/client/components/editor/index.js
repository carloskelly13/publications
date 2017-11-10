import React, { Component } from "react"
import { findDOMNode } from "react-dom"
import styled from "styled-components"
import get from "lodash.get"
import { connect } from "react-redux"
import {
  currentDocumentSelector, fetchDocument, backgroundGridLineRangesSelector,
  sortedShapesSelector, updateSelectedShape, documentMetricsSelector, selectedShapeSelector,
  editingTextBoxIdSelector, setEditingTextBox, zoomSelector
} from "../../modules/document"
import { AppColors, contentPanelWidthFull, contentPanelWidthPartial } from "../../util/constants"
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

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    findDOMNode(this.containerRef).addEventListener("scroll", this.handleViewScrollEvent)
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = nextProps
    if (get(this.props.currentDocument, "id") !== id) {
      findDOMNode(this.containerRef).scrollTop = 0
      findDOMNode(this.containerRef).scrollLeft = 0
      this.props.fetchDocument(id)
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line react/no-find-dom-node
    findDOMNode(this.containerRef).removeEventListener("scroll", this.handleViewScrollEvent)
  }

  handleViewScrollEvent = ({ target: { scrollLeft, scrollTop } }) => {
    this.setState({ scrollOffset: { scrollLeft, scrollTop } })
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
        ref={c => (this.containerRef = c)}
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
              dpi={72}
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
                  @media print {
                    html, body { margin: 0; }
                    @page {
                      size: ${orientation};
                      margin: 0mm;
                      marks: none;
                    }
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
