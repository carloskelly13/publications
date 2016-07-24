import React from 'react'
import { version } from '../../../../package.json'

const AboutAppModal = ({ isOpen, toggleModal }) => {
  if (!isOpen) {
    return <div></div>
  }

  return <div className="modal-cover">
    <div className="modal modal-about">
      <div className="modal-content">
        <div className="modal-header">
          <div className="pub-logo-73"></div>
          <h1>Publications</h1>
          <div className="app-version">Version { version }</div>
          <h3>Publications is designed, developed and maintained by Mike Kelly and Carlos Paelinck.</h3>
          <h4>Powered by React, Redux and Spring Boot.</h4>
        </div>
        <div className="modal-form-buttons">
          <button
            className="btn"
            type="button"
            onClick={toggleModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
}

export default AboutAppModal
