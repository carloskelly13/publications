import React, { PropTypes } from 'react'

const BaseView = ({ children }) => <div className="app-container">{ children }</div>
BaseView.propTypes = { children: PropTypes.element }

export default BaseView
