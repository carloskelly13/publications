import React, {Component} from 'react'
import AboutButton from '../ui/about.button'
import { Urls } from 'core/constants'

export default class DocumentsNavbar extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const { isTemporaryUser, isAuthenticated, selectedDocument } = this.props
    const testDrive = isTemporaryUser && isAuthenticated

    const accountButton = isAuthenticated ? <button
      className="button"
      onClick={this.props.toggleUserAccountModal}>
      {isTemporaryUser ? 'Create Account' : 'Change Password'}
    </button> : null

    const exitButton = isAuthenticated ? <button
      className="button"
      onClick={this.props.logOut}>
      {testDrive ? 'Exit Test Drive' : 'Log Out'}
    </button> : null

    const pdfUrl = selectedDocument ? `${Urls.ApiBase}/documents/${selectedDocument.id}/pdf` : undefined

    const userName = !isTemporaryUser ? <div className="user-name">
      { this.props.userName }
    </div> : undefined

    return <div className="navbar-container">
      <div className="navbar-controls-left">
        <AboutButton />
        <button
          className="button"
          onClick={this.props.createNewDocument}>
          New
        </button>
        <button
          className="button"
          disabled={!this.props.documentIsSelected}
          onClick={this.props.editDocument}>
          Edit
        </button>
        <a
          className={ `button ${this.props.documentIsSelected ? '' : 'disabled'}` }
          href={ pdfUrl }
          target="_blank">
          PDF
        </a>
        <button
          className="button button-destructive"
          disabled={!this.props.documentIsSelected}
          onClick={this.props.deleteDocument}>
          Delete
        </button>
      </div>
      <div className="navbar-controls-right">
        { userName }
        { accountButton }
        { exitButton }
      </div>
    </div>
  }
}
