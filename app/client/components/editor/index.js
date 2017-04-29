import React, { Component } from "react"
import { findDOMNode } from "react-dom"
import styled from "styled-components"
import get from "lodash.get"
import { connect } from "react-redux"
import { contentPanelWidthFull, contentPanelWidthPartial } from "../../util/constants"
import {
  currentDocumentSelector,
  selectedShapeSelector,
  editModeActiveSelector,
  sidePanelVisibleSelector
} from "../../state/selectors"
import Canvas from "../canvas"
import Ruler from "../rulers"

const Container = styled.div`
  transition: width 350ms ease-in-out;
  background: #fff;
  overflow: scroll;
  width: ${
    ({ sidePanelVisible }) => sidePanelVisible ? contentPanelWidthPartial : contentPanelWidthFull
  };
  z-index: 1;
`

class EditorView extends Component {
  constructor() {
    super()
    this.handleViewScrollEvent = this.handleViewScrollEvent.bind(this)
  }

  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 }
  }

  componentDidMount() {
    findDOMNode(this.containerRef).addEventListener("scroll", this.handleViewScrollEvent)
  }

  componentWillReceiveProps(nextProps) {
    if (get(this.props.currentDocument, "id") !== get(nextProps.currentDocument, "id")) {
      findDOMNode(this.containerRef).scrollTop = 0
      findDOMNode(this.containerRef).scrollLeft = 0
    }
  }

  componentWillUnmount() {
    findDOMNode(this.containerRef).removeEventListener("scroll", this.handleViewScrollEvent)
  }

  handleViewScrollEvent({ target: { scrollLeft, scrollTop } }) {
    this.setState({ scrollOffset: { scrollLeft, scrollTop } })
  }

  render() {
    const {
      props: {
        currentDocument, editModeActive, sidePanelVisible
      },
      state: { scrollOffset }
    } = this
    return (
      <Container
        sidePanelVisible={sidePanelVisible}
        ref={c => (this.containerRef = c)}
      >
        { currentDocument && (
          <div>
            <Ruler
              showDetail={editModeActive}
              scrollOffset={scrollOffset}
              doc={currentDocument}
            />
            <Canvas
              allowsEditing
              doc={currentDocument}
            />
          </div>
        ) }
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  currentDocument: currentDocumentSelector(state),
  selectedShape: selectedShapeSelector(state),
  editModeActive: editModeActiveSelector(state),
  sidePanelVisible: sidePanelVisibleSelector(state)
})

export default connect(mapStateToProps)(EditorView)
