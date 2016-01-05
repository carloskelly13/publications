import React, {Component} from 'react'

export default class AboutAppModal extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-about">
            <div className="modal-content">
              <div className="modal-header">
                <div className="pub-logo-60"></div>
                <h1>Publications</h1>
                <h3>Publications is designed, developed and maintained by Mike Kelly and Carlos Paelinck.</h3>
                <h4>Powered by ReactJS.</h4>
              </div>
              <div className="modal-form-buttons">
                <button
                  className="button button-full"
                  type="button"
                  onClick={this.props.toggleModal}>
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
