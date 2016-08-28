import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { autobind } from 'core-decorators'

import DocumentsNavbar from 'components/documents/documents.navbar'
import DocumentItem from 'components/documents/document.item'
import NewDocumentModal from 'components/documents/documents.new.modal'
import UserAccountModal from 'components/user/user.account.modal'

import { connect } from 'react-redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'
import * as ErrorActions from 'actions/errors'

export class Documents extends Component {
  state = {
    searchKeyword: '',
    isNewDocModalOpen: false,
    isUserAccountModalOpen: false
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(DocumentActions.getDocuments())
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
  }

  @autobind
  updateSelectedDocument(sender, event) {
    if (!!event) event.preventDefault()
    const { dispatch } = this.props
    dispatch(DocumentActions.updateCurrentDocument(sender))
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
      this.context.router.push(`/documents/${id}/edit`)
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
    dispatch(UserActions.logoutUser(() => this.context.router.push('/')));
    dispatch(DocumentActions.clearDocuments());
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
      .map(doc => {
        return <DocumentItem
          key={doc.id}
          doc={doc}
          editDocument={this.editDocument}
          selectedDocument={this.props.currentDocument}
          updateSelectedDocument={this.updateSelectedDocument} />
      })
  }

  renderModals() {
    return <div>
      <UserAccountModal
        userId={this.props.userId}
        userName={this.props.userName}
        updateUser={this.updateUser}
        errors={this.props.errors}
        removeError={this.removeError}
        isTemporaryUser={this.props.isTemporaryUser}
        toggleModal={this.toggleUserAccountModal}
        isOpen={this.state.isUserAccountModalOpen} />
      <NewDocumentModal
        createNewDocument={this.createNewDocument}
        toggleNewDocumentModal={this.toggleNewDocumentModal}
        isOpen={this.state.isNewDocModalOpen} />
    </div>
  }

  renderPageContent() {
    return <div className="app-content">
      <ul className="document-items" onClick={ () => this.updateSelectedDocument(null, event) }>
        <div className="input-text-search">
          <input
            value={ this.state.searchKeyword }
            onChange={ this.searchKeywordChanged }
            placeholder="Search for Documents"/>
        </div>
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
  }

  render() {
    if (this.props.children) {
      return <div>{ this.props.children }</div>

    } else {
      return <div>
        <DocumentsNavbar
          isTemporaryUser={this.props.isTemporaryUser}
          isAuthenticated={this.props.isAuthenticated}
          documentIsSelected={this.props.currentDocument !== null}
          editDocument={this.editDocument}
          deleteDocument={this.deleteDocument}
          createNewDocument={this.toggleNewDocumentModal}
          selectedDocument={this.props.currentDocument}
          searchKeyword={this.state.searchKeyword}
          searchKeywordChanged={this.searchKeywordChanged}
          userName={this.props.userName}
          logOut={this.logOut}
          toggleUserAccountModal={this.toggleUserAccountModal}
        />
        { this.renderModals() }
        { this.renderPageContent() }
      </div>
    }
  }
}

export default connect(state => ({
  ...state.user, ...state.doc, ...state.errors, ...state.ui
}))(Documents)
