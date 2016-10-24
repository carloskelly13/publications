import React from 'react'

export const AboutButton = ({ toggleAboutAppModal }) => (
  <div className="about-button">
    <div
      className="navbar-logo"
      onClick={toggleAboutAppModal}
    >
      <div className="navbar-logo-icon"></div>
    </div>
  </div>
)
