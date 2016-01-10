import React, {Component} from 'react'
import AboutButton from '../ui/about.button'

export default class DocumentsNavbar extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const {isTemporaryUser, isAuthenticated} = this.props
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
        <button
          className="button button-destructive"
          disabled={!this.props.documentIsSelected}
          onClick={this.props.deleteDocument}>
          Delete
        </button>
        {accountButton}
        {exitButton}
      </div>
      <div className="navbar-controls-right">
        <input
          className="input-text-search"
          value={this.props.searchKeyword}
          onChange={this.props.searchKeywordChanged}
          placeholder="Search for Documents"/>
      </div>
    </div>
  }
}
