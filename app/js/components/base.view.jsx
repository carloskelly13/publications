import React, {PropTypes} from 'react'
import {Link} from 'react-router'

const BaseView = ({children}) => <div className="app-container">{children}</div>
BaseView.propTypes = {children: PropTypes.element}

export default BaseView
