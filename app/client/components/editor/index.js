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
import {
  updateCurrentDocument as updateCurrentDocumentAction,
  getDocument as getDocumentAction
} from "../../state/actions/document"
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
  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 }
  }

  componentWillMount() {
    const {
      match: { params: { id } },
      getDocument
    } = this.props

    if (id) {
      getDocument(id)
    }
  }

  componentDidMount() {
    findDOMNode(this.containerRef).addEventListener("scroll", this.handleViewScrollEvent)
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params: { id } },
      getDocument
    } = nextProps
    if (get(this.props.currentDocument, "id") !== get(nextProps.currentDocument, "id")) {
      findDOMNode(this.containerRef).scrollTop = 0
      findDOMNode(this.containerRef).scrollLeft = 0
    }
    if (get(this.props.currentDocument, "id") !== id) {
      getDocument(id)
    }
  }

  componentWillUnmount() {
    this.props.clearSelectedDocument()
    findDOMNode(this.containerRef).removeEventListener("scroll", this.handleViewScrollEvent)
  }

  handleViewScrollEvent = ({ target: { scrollLeft, scrollTop } }) => {
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

const mapDispatchToProps = dispatch => ({
  getDocument: id => dispatch(getDocumentAction(id)),
  clearSelectedDocument: () => dispatch(updateCurrentDocumentAction(null))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditorView)
