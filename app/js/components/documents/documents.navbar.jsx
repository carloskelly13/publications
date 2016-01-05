import React, {Component} from 'react'
import AboutButton from '../ui/about.button'
import UserStore from '../../stores/user.store'

export default class DocumentsNavbar extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    const {temporary, authenticated} = UserStore.getState()
    const testDrive = temporary && authenticated

    const accountButton = authenticated ? <button
      className="button"
      onClick={this.props.toggleUserAccountModal}>
      {testDrive ? 'Create Account' : 'Change Password'}
    </button> : null

    const exitButton = authenticated ? <button
      className="button"
      onClick={this.props.logOut}>
      {testDrive ? 'Exit Test Drive' : 'Log Out'}
    </button> : null

    return (
      <div className="navbar-container">
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
    )
  }
}
