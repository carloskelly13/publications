import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { autobind } from 'core-decorators'

import DocumentsNavbar from 'components/documents/documents.navbar'
import DocumentItem from 'components/documents/document.item'
import NewDocumentModal from 'components/documents/documents.new.modal'
import UserAccountModal from 'components/user/user.account.modal'
import InputText from 'components/ui/input.text'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'
import * as ErrorActions from 'actions/errors'

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

  @autobind
  updateSelectedDocument(sender, event) {
    if (!!event) event.preventDefault()
    this.setState({selectedDocument: sender})
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
    this.props.newDocument({
      name: options.name,
      width: options.width,
      height: options.height,
      shapes: options.shapes
    })
  }

  @autobind
  editDocument() {
    const selectedDocument = this.state.selectedDocument

    if (selectedDocument) {
      const {id} = selectedDocument
      this.props.history.push(`/documents/${id}/edit`)
    }
  }

  @autobind
  deleteDocument() {
    const selectedDocument = this.state.selectedDocument

    if (!!selectedDocument) {
      this.props.removeDocument(selectedDocument)
      this.setState({ selectedDocument: null })
    }
  }

  @autobind
  logOut() {
    const {history, logoutUser, clearDocuments} = this.props

    logoutUser(() => {
      clearDocuments()
      this.props.history.push('/')
    })
  }

  render() {
    const { documents, children } = this.props

    if (children) {
      return <div>{ children }</div>

    } else {
      const documentItems = documents
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
             selectedDocument={this.state.selectedDocument}
             updateSelectedDocument={this.updateSelectedDocument} />
         })

      return <div>
        <UserAccountModal
          userId={this.props.userId}
          userName={this.props.userName}
          updateUser={this.props.updateUser}
          errors={this.props.errors}
          removeError={this.props.removeError}
          isTemporaryUser={this.props.isTemporaryUser}
          toggleModal={this.toggleUserAccountModal}
          isOpen={this.state.isUserAccountModalOpen} />
        <NewDocumentModal
          createNewDocument={this.createNewDocument}
          toggleNewDocumentModal={this.toggleNewDocumentModal}
          isOpen={this.state.isNewDocModalOpen} />
        <DocumentsNavbar
          isTemporaryUser={this.props.isTemporaryUser}
          isAuthenticated={this.props.isAuthenticated}
          documentIsSelected={this.state.selectedDocument !== null}
          editDocument={this.editDocument}
          deleteDocument={this.deleteDocument}
          createNewDocument={this.toggleNewDocumentModal}
          selectedDocument={this.state.selectedDocument}
          searchKeyword={this.state.searchKeyword}
          searchKeywordChanged={this.searchKeywordChanged}
          userName={this.props.userName}
          logOut={this.logOut}
          toggleUserAccountModal={this.toggleUserAccountModal} />
        <div className="app-content">
          <ul className="document-items" onClick={() => this.updateSelectedDocument(null, event)}>
            <div className="input-text-search">
              <input
                value={this.state.searchKeyword}
                onChange={this.searchKeywordChanged}
                placeholder="Search for Documents"/>
            </div>
            <ReactCSSTransitionGroup
            transitionName="document-item-animation"
            transitionAppear={true}
            transitionAppearTimeout={0}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
              {documentItems}
            </ReactCSSTransitionGroup>
          </ul>
          </div>
        </div>
    }
  }
}

const mapStateToProps = state => ({ ...state.user, ...state.doc, ...state.errors })
const mapDispatchToProps = dispatch => bindActionCreators(
    { ...UserActions, ...DocumentActions, ...ErrorActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Documents)
