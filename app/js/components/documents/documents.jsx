import AuthComponent from '../../core/auth-component'
import React, {Component, PropTypes} from 'react'
import {select, contains, isEmpty} from 'lodash'

import DocumentsNavbar from './documents.navbar'
import DocumentItem from './document.item'
import NewDocumentModal from './documents.new.modal'
import UserAccountModal from '../user/user.account.modal'
import DocumentStore from '../../stores/document.store'
import InputText from '../ui/input.text'

// import DocumentActions from '../../actions/document.actions'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as UserActions from 'actions/user'
import * as DocumentActions from 'actions/document'

const mapStateToProps = state => Object.assign({}, state.user, state.doc)
const mapDispatchToProps = dispatch => bindActionCreators(
    Object.assign({}, UserActions, DocumentActions
  ), dispatch)

export class Documents extends Component {
  constructor() {
    super(...arguments)
    this.dataChanged = this.dataChanged.bind(this)

    this.state = {
      searchKeyword: '',
      selectedDocument: null,
      isNewDocModalOpen: false,
      isUserAccountModalOpen: false
    }
  }

  componentWillMount() {
    DocumentStore.addChangeListener(this.dataChanged)

    const {isAuthenticated, getUser, getDocuments} = this.props

    if (!isAuthenticated) {
      getUser()
    } else {
      getDocuments()
      // DocumentActions.list()
    }
  }

  componentDidMount() {
    document.title = 'Publications — All Documents'
  }

  componentWillUnmount() {
    DocumentStore.removeChangeListener(this.dataChanged)
    this.setState({selectedDocument: null})
    document.title = 'Publications'
  }

  componentWillReceiveProps(nextProps) {
    const previousDocuments = this.props.documents
    const {isAuthenticated, isRequestingData, failedAuthentication, history, getDocuments, documents} = nextProps

    if (failedAuthentication) {
      history.push('/')
    } else if (isAuthenticated && !isRequestingData && (previousDocuments === documents)) {
      getDocuments()
    }
  }

  render() {
    let documentItems = select(this.props.documents, doc => {
      if (isEmpty(this.state.searchKeyword)) {
        return true
      } else {
        return contains(doc.get('name').toLowerCase(), this.state.searchKeyword.toLowerCase())
      }
    }).map(doc => {
      return (
        <DocumentItem
          key={doc.get('_id')}
          doc={doc}
          editDocument={::this.editDocument}
          selectedDocument={this.state.selectedDocument}
          updateSelectedDocument={::this.updateSelectedDocument} />
      )
    })

    return (
      <div>
        <UserAccountModal
          userName={this.props.userName}
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

  dataChanged() {
    this.setState({
      documents: DocumentStore.getDocuments(),
      isNewDocModalOpen: false
    })
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
    // DocumentActions.create({
    //   name: options.name,
    //   width: options.width,
    //   height: options.height
    // })
  }

  editDocument() {
    const selectedDocument = this.state.selectedDocument

    if (selectedDocument) {
      const id = selectedDocument.get('_id')
      this.props.history.push(`/documents/${id}/edit`)
      // this.props.history.pushState
      // this.context.router.transitionTo('document-edit', {id: })
    }
  }

  deleteDocument() {
    const selectedDocument = this.state.selectedDocument

    if (!!selectedDocument) {
      // DocumentActions.remove(selectedDocument)
    }
  }

  logOut() {
    const {history, logoutUser} = this.props
    logoutUser()
    history.push('/')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Documents)
