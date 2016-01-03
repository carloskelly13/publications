import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import DocumentStore from '../../stores/document.store'
import _ from 'lodash'

export default class AboutAppModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-about">
            <div className="modal-content">
              <div className="modal-header">
                <h1>Publications</h1>
                <h3></h3>
              </div>
              <div className="modal-form-buttons">
                <button className="button button-full" type="button" onClick={::this.dismiss}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }
}
