import React, {Component} from 'react'
import {select, contains, isEmpty} from 'lodash'

import DocumentsNavbar from './documents.navbar'
import DocumentItem from './document.item'
import NewDocumentModal from './documents.new.modal'
import UserAccountModal from '../user/user.account.modal'
import InputText from '../ui/input.text'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'
import * as ErrorActions from 'actions/errors'

const mapStateToProps = state => Object.assign({}, state.user, state.doc, state.errors)
const mapDispatchToProps = dispatch => bindActionCreators(
    Object.assign({}, UserActions, DocumentActions, ErrorActions
  ), dispatch)

export class Documents extends Component {
  constructor() {
    super(...arguments)

    this.state = {
      searchKeyword: '',
      selectedDocument: null,
      isNewDocModalOpen: false,
      isUserAccountModalOpen: false
    }
  }

  componentDidMount() {
    document.title = 'Publications — All Documents'
    this.props.getDocuments()
  }

  componentWillUnmount() {
    this.setState({selectedDocument: null})
    document.title = 'Publications'
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.documents.length > this.props.documents.length) {
      this.setState({isNewDocModalOpen: false})
    }
  }

  render() {
    const documentItems = select(this.props.documents, doc => {
      if (isEmpty(this.state.searchKeyword)) {
        return true
      } else {
        return contains(doc.get('name').toLowerCase(), this.state.searchKeyword.toLowerCase())
      }
    }).map(doc => {
      return (
        <DocumentItem
          key={doc.get('id')}
          doc={doc}
          editDocument={::this.editDocument}
          selectedDocument={this.state.selectedDocument}
          updateSelectedDocument={::this.updateSelectedDocument} />
      )
    })

    return (
      <div>
        <UserAccountModal
          userId={this.props.userId}
          userName={this.props.userName}
          updateUser={this.props.updateUser}
          errors={this.props.errors}
          removeError={this.props.removeError}
          isTemporaryUser={this.props.isTemporaryUser}
          toggleModal={::this.toggleUserAccountModal}
          isOpen={this.state.isUserAccountModalOpen}
        />
        <NewDocumentModal
          createNewDocument={::this.createNewDocument}
          toggleNewDocumentModal={::this.toggleNewDocumentModal}
          isOpen={this.state.isNewDocModalOpen}
        />
        <DocumentsNavbar
          isTemporaryUser={this.props.isTemporaryUser}
          isAuthenticated={this.props.isAuthenticated}
          documentIsSelected={this.state.selectedDocument !== null}
          editDocument={::this.editDocument}
          deleteDocument={::this.deleteDocument}
          createNewDocument={::this.toggleNewDocumentModal}
          searchKeyword={this.state.searchKeyword}
          searchKeywordChanged={::this.searchKeywordChanged}
          logOut={::this.logOut}
          toggleUserAccountModal={::this.toggleUserAccountModal}
        />
        <div className="app-content">
          <ul className="document-items" onClick={() => this.updateSelectedDocument(null, event)}>
            {documentItems}
          </ul>
        </div>
      </div>
    )
  }

  updateSelectedDocument(sender, event) {
    if (!!event) event.preventDefault()
    this.setState({selectedDocument: sender})
  }

  searchKeywordChanged(event) {
    this.setState({searchKeyword: event.target.value})
  }

  toggleNewDocumentModal() {
    this.setState({
      isNewDocModalOpen: !this.state.isNewDocModalOpen
    })
  }

  toggleUserAccountModal() {
    this.setState({
      isUserAccountModalOpen: !this.state.isUserAccountModalOpen
    })
  }

  createNewDocument(options) {
    this.props.newDocument({
      name: options.name,
      width: options.width,
      height: options.height,
      shapes: options.shapes
    })
  }

  editDocument() {
    const selectedDocument = this.state.selectedDocument

    if (selectedDocument) {
      const id = selectedDocument.get('id')
      this.props.history.push(`/documents/${id}/edit`)
    }
  }

  deleteDocument() {
    const selectedDocument = this.state.selectedDocument

    if (!!selectedDocument) {
      this.props.removeDocument(selectedDocument)
      this.setState({selectedDocument: null})
    }
  }

  logOut() {
    const {history, logoutUser, clearDocuments} = this.props
    logoutUser()
    clearDocuments()
    history.push('/')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents)
