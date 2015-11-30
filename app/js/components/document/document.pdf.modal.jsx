import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import DocumentStore from '../../stores/document.store';
import _ from 'lodash';

export default class DocumentPdfViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {currentUrl: null};
  }

  componentDidUpdate() {
    if (this.props.isOpen) {
      DocumentStore.pdf(this.props.doc.get('_id'))
        .then(blob => {
          const
            url = URL.createObjectURL(blob),
            pdfLink = ReactDOM.findDOMNode(this.refs.pdfLink)

          pdfLink.href = url
          pdfLink.innerHTML = 'Download'
          pdfLink.setAttribute('download', `${this.props.doc.get('name')}.pdf`)
          this.state.currentUrl = url
        })
    }
  }

  render() {
    if (this.props.isOpen) {
      return (
        <div className="modal-cover">
          <div className="modal modal-pdf">
            <div className="modal-content">
              <div className="modal-header">
                <h1>Export PDF</h1>
                <h3>{this.props.doc.get('name')} has been exported to PDF.</h3>
              </div>
              <div className="modal-form-buttons">
                <a className="button" role="button" href="#" target="_blank" ref="pdfLink">
                  Exporting…
                </a>
                <button className="button" type="button" onClick={::this.dismiss}>
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

  dismiss() {
    if (this.state.currentUrl) {
      URL.revokeObjectURL(this.state.currentUrl);
      this.state.currentUrl = null;
    }

    this.props.togglePdfDownloadModal();
  }
}
