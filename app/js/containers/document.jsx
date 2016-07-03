import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'

import Canvas from 'components/canvas/canvas'
import DocumentNavbar from 'components/document/document.navbar'
import DocumentLoadingNavbar from 'components/document/document.loadingNavbar'
import InspectorBase from 'components/inspector/inspector.base'
import RulerHorizontal from 'components/rulers/ruler.horizontal'
import RulerVertical from 'components/rulers/ruler.vertical'
import ShapeFactory from 'core/shape.factory'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'

export class Document extends Component {
  state = {
    showInspector: true,
    zoom: 1.0
  }

  componentDidMount() {
    const { id } = this.props.params
    this.props.getDocument(id)
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
    this.props.updateSelectedShape(sender)
  }

  @autobind
  save() {
    this.props.saveDocument(this.props.currentDocument)
  }

  @autobind
  addNewShape(type) {
    let newShape

    if (type === 'ellipse') {
      newShape = ShapeFactory.ellipse()
    } else if (type === 'text') {
      newShape = ShapeFactory.text()
    } else {
      newShape = ShapeFactory.rectangle()
    }

    newShape.z = this.props.currentDocument.shapes.length + 1
    newShape.id = this.props.currentDocument.shapes.length + 1

    this.props.addShape(newShape)
  }

  @autobind
  viewAllDocuments() {
    this.props.saveDocument(this.props.currentDocument, () => {
      this.props.getDocuments()
      this.props.documentChanged(null)
      this.props.history.push('/documents')
    })
  }

  @autobind
  toggleInspector() {
    this.setState({ showInspector: !this.state.showInspector })
  }

  @autobind
  changeZoom(sender) {
    const { zoom: currentZoom } = this.state

    if (sender === 'zoom-in' && currentZoom < 5.0) {
      this.setState({zoom: currentZoom + 0.25})
    } else if (sender === 'zoom-out' && currentZoom > 0.25) {
      this.setState({zoom: currentZoom - 0.25})
    }
  }

  render() {
    const { currentDocument, selectedShape, updateDocumentProperty } = this.props
    const DPI = 72.0

    if (currentDocument) {
      return <div>
        <DocumentNavbar
          doc={currentDocument}
          changeZoom={this.changeZoom}
          clipboard={this.props.clipboardData}
          deleteShape={this.props.deleteShape}
          cutShape={this.props.cutShape}
          copyShape={this.props.copyShape}
          pasteShape={this.props.pasteShape}
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
            updateDocument={updateDocumentProperty}
            updateShape={this.updateShape}
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
            updateShape={this.updateShape}
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

const mapStateToProps = state => state.doc
const mapDispatchToProps = dispatch => bindActionCreators(DocumentActions, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Document)
