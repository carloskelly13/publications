import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import { Urls } from 'core/constants'

import Canvas from 'components/canvas/canvas'
import DocumentNavbar from 'components/document/document.navbar'
import DocumentLoadingNavbar from 'components/document/document.loadingNavbar'
import InspectorBase from 'components/inspector/inspector.base'
import RulerHorizontal from 'components/rulers/ruler.horizontal'
import RulerVertical from 'components/rulers/ruler.vertical'
import ShapeFactory from 'core/shape.factory'

import { connect } from 'react-redux'
import * as DocumentActions from 'actions/document'

export class Document extends Component {
  state = {
    showInspector: true,
    zoom: 1.0
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { params, dispatch } = this.props
    dispatch(DocumentActions.getDocument(params.id))
  }

  componentWillUnmount() {
    document.title = 'Publications'
  }

  componentWillReceiveProps({ currentDocument }) {
    if (currentDocument) {
      document.title = `Publications — ${currentDocument.name}`
    }
  }

  @autobind
  updateShape(sender) {
    const { dispatch } = this.props
    dispatch(DocumentActions.updateSelectedShape(sender))
  }

  @autobind
  save() {
    const { currentDocument, dispatch } = this.props
    dispatch(DocumentActions.saveDocument(currentDocument))
  }

  @autobind
  addNewShape(type) {
    const { currentDocument, dispatch } = this.props

    const newShapeOfType = type => {
      if (type === 'ellipse') {
        return ShapeFactory.Ellipse()
      } else if (type === 'text') {
        return ShapeFactory.Text()
      } else {
        return ShapeFactory.Rectangle()
      }
    }

    const newShape = newShapeOfType(type)
    newShape.z = currentDocument.shapes.length + 1
    newShape.id = currentDocument.shapes.length + 1
    dispatch(DocumentActions.addShape(newShape))
  }

  @autobind
  viewAllDocuments() {
    const { dispatch, currentDocument } = this.props

    dispatch(DocumentActions.saveDocument(currentDocument, () => {
      dispatch(DocumentActions.getDocuments())
      dispatch(DocumentActions.documentChanged(null))
      this.context.router.push('/documents')
    }))
  }

  @autobind
  toggleInspector() {
    this.setState({ showInspector: !this.state.showInspector })
  }

  @autobind
  changeZoom(sender) {
    const { zoom } = this.state

    if (sender === 'zoom-in' && zoom < 5.0) {
      this.setState({zoom: zoom + 0.25})
    } else if (sender === 'zoom-out' && zoom > 0.25) {
      this.setState({zoom: zoom - 0.25})
    }
  }

  @autobind
  updateDocumentProperty(sender) {
    const { dispatch } = this.props
    dispatch(DocumentActions.updateDocumentProperty(sender))
  }

  @autobind
  deleteShape(shape) {
    const { dispatch } = this.props
    dispatch(DocumentActions.deleteShape(shape))
  }

  @autobind
  cutShape(shape) {
    const { dispatch } = this.props
    dispatch(DocumentActions.cutShape(shape))
  }

  @autobind
  copyShape(shape) {
    const { dispatch } = this.props
    dispatch(DocumentActions.copyShape(shape))
  }

  @autobind
  pasteShape() {
    const { dispatch } = this.props
    dispatch(DocumentActions.pasteShape())
  }

  render() {
    const { currentDocument, selectedShape } = this.props
    const DPI = 72.0

    if (currentDocument) {
      return <div>
        <DocumentNavbar
          doc={currentDocument}
          changeZoom={this.changeZoom}
          clipboard={this.props.clipboardData}
          deleteShape={this.deleteShape}
          cutShape={this.cutShape}
          copyShape={this.copyShape}
          pasteShape={this.pasteShape}
          selectedShape={selectedShape}
          save={this.save}
          showInspector={this.state.showInspector}
          title={currentDocument.name}
          toggleInspector={this.toggleInspector}
          viewAllDocuments={this.viewAllDocuments}
          zoom={this.state.zoom} />
        <div className="app-content app-content-document">
          <InspectorBase
            addNewShape={this.addNewShape}
            doc={currentDocument}
            dpi={DPI}
            zoom={this.state.zoom}
            selectedShape={selectedShape}
            updateDocument={this.updateDocumentProperty}
            updateShape={this.updateShape}
            showInspector={this.state.showInspector} />
          <RulerVertical
            doc={currentDocument}
            dpi={DPI}
            zoom={this.state.zoom} />
          <RulerHorizontal
            doc={currentDocument}
            dpi={DPI}
            zoom={this.state.zoom} />
          <Canvas
            doc={currentDocument}
            dpi={DPI}
            zoom={this.state.zoom}
            showInspector={this.state.showInspector}
            selectable={true}
            selectedShape={selectedShape}
            updateShape={this.updateShape} />
        </div>
      </div>

    } else {
      return <div>
        <DocumentLoadingNavbar />
        <div className="app-content app-content-document"></div>
      </div>
    }
  }
}

export default connect(({ doc }) => doc)(Document)
