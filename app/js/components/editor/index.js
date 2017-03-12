import React, { Component } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import get from "lodash.get"
import { connect } from "react-redux"
import { rightPanelWidth } from "../../core/constants"
import {
  currentDocumentSelector,
  selectedShapeSelector,
  editModeActiveSelector
} from "../../selectors"
import Canvas from "../canvas"
import Ruler from "../rulers"

const Container = styled.div`
  background: #fff;
  flex: 1 1 auto;
  overflow: scroll;
  width: ${rightPanelWidth};
  z-index: 1;
`

class EditorView extends Component {
  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 }
  }

  constructor() {
    super()
    this.handleViewScrollEvent = this.handleViewScrollEvent.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (get(this.props.currentDocument, "id") !== get(nextProps.currentDocument, "id")) {
      const containerEl = ReactDOM.findDOMNode(this.containerRef)
      containerEl.scrollTop = 0
      containerEl.scrollLeft = 0
    }
  }

  componentDidMount() {
    ReactDOM
      .findDOMNode(this.containerRef)
      .addEventListener("scroll", this.handleViewScrollEvent)
  }

  componentWillUnmount() {
    ReactDOM
      .findDOMNode(this.containerRef)
      .removeEventListener("scroll", this.handleViewScrollEvent)
  }

  handleViewScrollEvent({ target: { scrollLeft, scrollTop } }) {
    this.setState({ scrollOffset: { scrollLeft, scrollTop } })
  }

  render() {
    const {
      props: { currentDocument, selectedShape, editModeActive },
      state: { scrollOffset }
    } = this
    return (
      <Container
        ref={ c => this.containerRef = c }
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
  editModeActive: editModeActiveSelector(state)
})

export default connect(mapStateToProps)(EditorView)
