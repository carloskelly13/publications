import React, {Component} from 'react'
import {autobind} from 'core-decorators'
import AboutAppModal from './about.modal'

export default class AboutButton extends Component {
  state = {
    isAboutAppModalOpen: false
  }

  @autobind
  toggleAboutAppModal() {
    console.log('hi')
    this.setState({ isAboutAppModalOpen: !this.state.isAboutAppModalOpen })
  }

  render() {
    return (
      <div className="about-button">
        <AboutAppModal
          toggleModal={this.toggleAboutAppModal}
          isOpen={this.state.isAboutAppModalOpen}
        />
        <div
          className="navbar-logo"
          onClick={this.toggleAboutAppModal}
        >
          <div className="navbar-logo-icon"></div>
        </div>
      </div>
    )
  }
}
