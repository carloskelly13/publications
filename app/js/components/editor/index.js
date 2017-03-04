import React, { Component } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import get from "lodash.get"
import { connect } from "react-redux"
import {
  currentDocumentSelector,
  selectedShapeSelector
} from "../../selectors"
import Canvas from "../canvas"
import Ruler from "../rulers"

const Container = styled.div`
  background: #fff;
  flex: 1 1 auto;
  overflow: scroll;
  width: 75vw;
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
      this.setState({ scrollOffset: { scrollLeft: 0, scrollTop: 0 } })
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
      props: { currentDocument, selectedShape },
      state: { scrollOffset }
    } = this
    return (
      <Container
        ref={ c => this.containerRef = c }
      >
        { currentDocument && (
          <div>
            <Ruler
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
  selectedShape: selectedShapeSelector(state)
})

export default connect(mapStateToProps)(EditorView)
