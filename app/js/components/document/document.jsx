import {merge, isEmpty, extend, without, cloneDeep, omit, filter} from 'lodash'
import React, {Component, PropTypes} from 'react'

import Canvas from '../canvas/canvas'
import DocumentNavbar from './document.navbar'
import InspectorBase from '../inspector/inspector.base'
import RulerHorizontal from '../rulers/ruler.horizontal'
import RulerVertical from '../rulers/ruler.vertical'
import DocumentPdfViewModal from './document.pdf.modal'

import ShapeFactory from '../../core/shape.factory'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'

const mapStateToProps = state => state.doc
const mapDispatchToProps = dispatch => bindActionCreators(DocumentActions, dispatch)

export class Document extends Component {

  constructor() {
    super(...arguments)

    this.state = {
      showInspector: true,
      isPdfModalOpen: false,
      zoom: 1.0,
      clipboard: null
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('I’m getting new props yo!')
  // }

  componentDidMount() {
    const {id} = this.props.params
    this.props.getDocument(id)
  }

  componentWillUnmount() {
    document.title = 'Publications'
  }

  updateSelectedCanvasObject(sender, event) {
    if (event) {
      event.preventDefault()
    }

    this.props.updateSelectedShape(sender)
  }

  updateShape(sender) {
    this.props.updateSelectedShape(sender)
  }

  save() {
    const {currentDocument, saveDocument} = this.props
    saveDocument(currentDocument)
  }

  addNewShape(type) {
    let newShape = null

    if (type === 'ellipse') {
      newShape = ShapeFactory.ellipse()
    } else if (type === 'text') {
      newShape = ShapeFactory.text()
    } else {
      newShape = ShapeFactory.rectangle()
    }

    newShape.z = this.props.currentDocument.shapes.length + 1
    newShape.id = this.props.currentDocument.shapes.length + 1

    this.props.updateDocumentProperty({shapes: [
      ...this.props.currentDocument.shapes,
      newShape
    ]})
  }

  viewAllDocuments(sender) {
    const {currentDocument, saveDocument, documentChanged, history} = this.props

    saveDocument(currentDocument, () => {
      history.push('/documents')
      documentChanged(null)
    })
  }

  toggleInspector(sender) {
    this.setState({showInspector: !this.state.showInspector})
  }

  changeZoom(sender, event) {
    const currentZoom = this.state.zoom

    if (sender === 'zoom-in' && currentZoom < 5.0) {
      this.setState({zoom: currentZoom + 0.25})
    } else if (sender === 'zoom-out' && currentZoom > 0.25) {
      this.setState({zoom: currentZoom - 0.25})
    }
  }

  clipboardAction(action) {
    const {currentDocument} = this.props
    let updatedDocument = null

    switch (action) {
      case 'cut':
      const shapeToCut = cloneDeep(omit(this.state.selectedShape, 'id'))
      updatedDocument = currentDocument.update('shapes', shapes => {
        return without(shapes, this.state.selectedShape)
      })

      this.setState({clipboard: shapeToCut})
      this.updateDocument(updatedDocument)
      this.updateSelectedCanvasObject(null)
      break

      case 'delete':
      updatedDocument = currentDocument.update('shapes', shapes => {
        const {selectedShape} = this.state
        const shapesToAdjust = filter(shapes, s => s.z > selectedShape.z)
        shapesToAdjust.forEach(s => s.z -= 1)
        return without(shapes, selectedShape)
      })

      this.updateDocument(updatedDocument)
      this.updateSelectedCanvasObject(null)
      break

      case 'copy':
      const shapeToCopy = cloneDeep(omit(this.state.selectedShape, 'id'))
      this.setState({clipboard: shapeToCopy})
      break

      case 'paste':
      let shapeToPaste = cloneDeep(this.state.clipboard)
      shapeToPaste.x += 0.25
      shapeToPaste.y += 0.25

      updatedDocument = currentDocument.update('shapes', shapes => {
        shapes.push(shapeToPaste)
        return shapes
      })

      this.updateDocument(updatedDocument)
      this.updateSelectedCanvasObject(shapeToPaste)
      break

      default: break
    }
  }

  togglePdfDownloadModal() {
    this.setState({isPdfModalOpen: !this.state.isPdfModalOpen})
  }

  render() {
    const {currentDocument, selectedShape, updateDocumentProperty} = this.props
    const DPI = 72.0

    if (currentDocument) {
      return <div>
        <DocumentPdfViewModal
          doc={currentDocument}
          togglePdfDownloadModal={::this.togglePdfDownloadModal}
          isOpen={this.state.isPdfModalOpen} />
        <DocumentNavbar
          changeZoom={::this.changeZoom}
          clipboard={this.state.clipboard}
          clipboardAction={::this.clipboardAction}
          downloadPdf={::this.togglePdfDownloadModal}
          selectedShape={selectedShape}
          save={::this.save}
          showInspector={this.state.showInspector}
          title={currentDocument.name}
          toggleInspector={::this.toggleInspector}
          viewAllDocuments={::this.viewAllDocuments}
          zoom={this.state.zoom} />
        <div className="app-content app-content-document">
          <InspectorBase
            addNewShape={::this.addNewShape}
            doc={currentDocument}
            dpi={DPI}
            zoom={this.state.zoom}
            selectedShape={selectedShape}
            updateDocument={updateDocumentProperty}
            updateShape={::this.updateShape}
            updateSelectedCanvasObject={::this.updateSelectedCanvasObject}
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
            updateSelectedCanvasObject={::this.updateSelectedCanvasObject}
            updateShape={::this.updateShape} />
        </div>
      </div>

    } else {
      return <div>Loading</div>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Document)
