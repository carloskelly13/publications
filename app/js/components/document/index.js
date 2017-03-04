import React, { Component, PropTypes } from 'react'
import { autobind } from 'core-decorators'
import { Urls } from 'core/constants'

import { ToolbarProgress } from "../ui/toolbar-progress"
import Canvas from '../canvas/canvas'
import DocumentNavbar from './navbar'
import InspectorBase from '../inspector/inspector.base'
import RulerHorizontal from '../rulers/ruler.horizontal'
import RulerVertical from '../rulers/ruler.vertical'
import ShapeFactory from '../../core/shape.factory'
import AboutAppModal from '../ui/about.modal'

import { connect } from 'react-redux'
import * as DocumentActions from 'actions/document'
import * as UserActions from 'actions/user'

const DPI = 72.0 /* This could become variable at one point. */

class DocumentView extends Component {
  state = {
    showInspector: false,
    zoom: 1.0,
    isAboutAppModalOpen: false
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (window.screen.availWidth >= 768) {
      this.setState({ showInspector: true })
    }
    this.props.dispatch(UserActions.getUser())
  }

  componentWillUnmount() {
    document.title = 'Publications'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentDocument) {
      document.title = `Publications — ${nextProps.currentDocument.name}`
    }

    /**
     * Only attempt to get documents if the current user request is complete
     * and we have a valid authenticated user.
     */
    const {
      dispatch,
      match: { params: { uuid } },
      user: { isRequestingUser, isAuthenticated }
    } = nextProps
    if (this.props.user.isRequestingUser && !isRequestingUser && isAuthenticated) {
      dispatch(DocumentActions.getDocument(uuid))
    }
    /**
     * If we have requested the user and there is no valid authentication session
     * redirect to the login page.
     */
    else if (this.props.user.isRequestingUser && !isRequestingUser && !isAuthenticated) {
      this.context.router.replace("/")
    }
  }

  @autobind
  updateShape(sender) {
    const { dispatch } = this.props
    dispatch(DocumentActions.updateSelectedShape(sender))
  }

  @autobind
  toggleAboutAppModal() {
    this.setState({ isAboutAppModalOpen: !this.state.isAboutAppModalOpen })
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

  _renderDocument() {
    const { currentDocument, clipboardData, selectedShape } = this.props
    const { isAboutAppModalOpen, showInspector, zoom } = this.state
    return (
      <div>
        <AboutAppModal
          toggleModal={this.toggleAboutAppModal}
          isOpen={isAboutAppModalOpen}
        />
        <InspectorBase
          addNewShape={this.addNewShape}
          doc={currentDocument}
          dpi={DPI}
          zoom={zoom}
          selectedShape={selectedShape}
          updateDocument={this.updateDocumentProperty}
          updateShape={this.updateShape}
          showInspector={showInspector} />
        <DocumentNavbar
          doc={currentDocument}
          changeZoom={this.changeZoom}
          clipboard={clipboardData}
          deleteShape={this.deleteShape}
          cutShape={this.cutShape}
          copyShape={this.copyShape}
          pasteShape={this.pasteShape}
          selectedShape={selectedShape}
          save={this.save}
          showInspector={showInspector}
          title={currentDocument.name}
          toggleInspector={this.toggleInspector}
          toggleAboutAppModal={this.toggleAboutAppModal}
          viewAllDocuments={this.viewAllDocuments}
          zoom={zoom}
        />
        <div className="app-content app-content-document">
          <RulerVertical
            doc={currentDocument}
            dpi={DPI}
            zoom={zoom} />
          <RulerHorizontal
            doc={currentDocument}
            dpi={DPI}
            zoom={zoom} />
          <Canvas
            allowsEditing
            doc={currentDocument}
            selectable
            updateShape={this.updateShape}
          />
        </div>
      </div>
    )
  }

  render() {
    const {
      user: { isRequestingUser, isAuthenticated },
      currentDocument
    } = this.props
    if (isRequestingUser || (isAuthenticated && !currentDocument)) {
      return <ToolbarProgress />
    } else if (isAuthenticated && currentDocument) {
      return this._renderDocument();
    }
    return <div />
  }
}

const mapState = state => ({ ...state.doc, user: state.user })
export default connect(mapState)(DocumentView)
