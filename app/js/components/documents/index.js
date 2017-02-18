import React, { Component, PropTypes } from 'react'
import { findDOMNode } from "react-dom"
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { autobind } from 'core-decorators'

import { ToolbarProgress } from "../ui/toolbar-progress"
import { Toolbar } from "./toolbar"
import DocumentsNavbar from './navbar'
import DocumentItem from './document-item'
import NewDocumentModal from './new-modal'
import UserAccountModal from '../user/user.account.modal'
import AboutAppModal from '../ui/about.modal'
import { Search } from "./search"

import { connect } from 'react-redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'
import * as ErrorActions from 'actions/errors'

class DocumentsView extends Component {
  state = {
    searchKeyword: '',
    isNewDocModalOpen: false,
    isUserAccountModalOpen: false,
    isAboutAppModalOpen: false
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.dispatch(UserActions.getUser())
    document.title = 'Publications — All Documents'
  }

  componentWillUnmount() {
    this.setState({selectedDocument: null})
    document.title = 'Publications'
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.documents.length > this.props.documents.length) {
      this.setState({ isNewDocModalOpen: false })
    }

    /**
     * Only attempt to get documents if the current user request is complete
     * and we have a valid authenticated user.
     */
    const { user: { isRequestingUser, isAuthenticated } } = nextProps
    if (this.props.user.isRequestingUser && !isRequestingUser && isAuthenticated) {
      this.props.dispatch(DocumentActions.getDocuments())
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
  attachEventToViewContainer(ref) {
    console.debug(ref)
  }

  @autobind
  toggleAboutAppModal() {
    this.setState({ isAboutAppModalOpen: !this.state.isAboutAppModalOpen })
  }

  @autobind
  updateSelectedDocument(sender, event) {
    if (!!event) event.preventDefault()
    const { dispatch } = this.props
    dispatch(DocumentActions.updateCurrentDocument(sender))
  }

  @autobind
  clearSelectedDocument() {
    const { dispatch } = this.props
    dispatch(DocumentActions.updateCurrentDocument(null))
  }

  @autobind
  searchKeywordChanged(event) {
    this.setState({searchKeyword: event.target.value})
  }

  @autobind
  toggleNewDocumentModal() {
    this.setState({
      isNewDocModalOpen: !this.state.isNewDocModalOpen
    })
  }

  @autobind
  toggleUserAccountModal() {
    this.setState({
      isUserAccountModalOpen: !this.state.isUserAccountModalOpen
    })
  }

  @autobind
  createNewDocument(options) {
    const { dispatch } = this.props

    dispatch(DocumentActions.newDocument({
      name: options.name,
      width: options.width,
      height: options.height,
      shapes: options.shapes
    }))
  }

  @autobind
  editDocument() {
    const { currentDocument } = this.props
    if (!!currentDocument) {
      const { id } = currentDocument
      this.context.router.push(`/documents/${id}`)
    }
  }

  @autobind
  deleteDocument() {
    const { currentDocument } = this.props
    const { dispatch } = this.props

    if (!!currentDocument) {
      dispatch(DocumentActions.removeDocument(currentDocument))
      this.setState({ selectedDocument: null })
    }
  }

  @autobind
  logOut() {
    const { dispatch } = this.props
    dispatch(UserActions.logout())
      .then(() => {
        dispatch(DocumentActions.clearDocuments())
        this.context.router.replace("/")
      })
  }

  @autobind
  removeError(error) {
    const { dispatch } = this.props
    dispatch(ErrorActions.removeError(error))
  }

  @autobind
  updateUser(user, completion) {
    const { dispatch } = this.props
    dispatch(UserActions.updateUser(user, completion))
  }

  renderDocumentItems() {
    return this.props.documents
      .filter(doc => {
        if (!this.state.searchKeyword.length) {
          return true
        } else {
          const searchKeyword = this.state.searchKeyword.toLowerCase()
          return doc.name.toLowerCase().includes(searchKeyword)
        }
      })
      .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
      .map(doc => (
        <DocumentItem
          key={doc.id}
          doc={doc}
          editDocument={this.editDocument}
          selectedDocument={this.props.currentDocument}
          updateSelectedDocument={this.updateSelectedDocument}
        />
      ))
  }

  renderModals() {
    return <div>
      <UserAccountModal
        userId={this.props.user.userId}
        userName={this.props.user.userName}
        updateUser={this.updateUser}
        errors={this.props.errors}
        removeError={this.removeError}
        isTemporaryUser={this.props.isTemporaryUser}
        toggleModal={this.toggleUserAccountModal}
        isOpen={this.state.isUserAccountModalOpen}
      />
      <NewDocumentModal
        createNewDocument={this.createNewDocument}
        toggleNewDocumentModal={this.toggleNewDocumentModal}
        isOpen={this.state.isNewDocModalOpen}
      />
      <AboutAppModal
        toggleModal={this.toggleAboutAppModal}
        isOpen={this.state.isAboutAppModalOpen}
      />
    </div>
  }

  renderPageContent() {
    return (
      <div
        className="app-content"
      >
        <ul
          className="document-items"
          onClick={this.clearSelectedDocument}
        >
          <Search
            keyword={this.state.searchKeyword}
            keywordChanged={this.searchKeywordChanged}
          />
          <ReactCSSTransitionGroup
            transitionName="document-item-animation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            { this.renderDocumentItems() }
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    )
  }

  _renderAllDocuments() {
    const {
      currentDocument,
      user: { isRequestingUser, isAuthenticated, isTemporaryUser, userName }
    } = this.props
    return (
      <div>
        { /* <DocumentsNavbar
          isTemporaryUser={isTemporaryUser}
          isAuthenticated={isAuthenticated}
          documentIsSelected={currentDocument !== null}
          editDocument={this.editDocument}
          deleteDocument={this.deleteDocument}
          createNewDocument={this.toggleNewDocumentModal}
          selectedDocument={currentDocument}
          userName={userName}
          logOut={this.logOut}
          toggleAboutAppModal={this.toggleAboutAppModal}
          toggleUserAccountModal={this.toggleUserAccountModal}
        /> */ }
        <Toolbar

        />
        { this.renderModals() }
        { this.renderPageContent() }
      </div>
    )
  }

  render() {
    const { user: { isRequestingUser, isAuthenticated } } = this.props
    if (isRequestingUser) {
      return <ToolbarProgress />
    } else if (isAuthenticated) {
      return this._renderAllDocuments();
    }
    return <div />
  }
}

const mapState = state => ({
  user: state.user, ...state.doc, ...state.errors, ...state.ui
})
export default connect(mapState)(DocumentsView)
