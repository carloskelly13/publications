import React, {Component, PropTypes, addons} from 'react';
import DocumentStore from '../../stores/document.store';
import _ from 'lodash';

const ReactCSSTransitionGroup = addons.CSSTransitionGroup;

export default class DocumentPdfViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {currentUrl: null};
  }

  componentDidUpdate() {
    if (this.props.isOpen) {
      DocumentStore.pdf(this.props.doc._id)
        .then(responseObj => {
          let blob = new Blob([responseObj.data], {type: 'application/pdf'}),
            url = URL.createObjectURL(blob),
            pdfLink = React.findDOMNode(this.refs.pdfLink);

          pdfLink.href = url;
          pdfLink.setAttribute('download', `${this.props.doc.name}.pdf`);
          this.state.currentUrl = url;
        });
    }
  }

  render() {
    if (this.props.isOpen) {
      return (
        <ReactCSSTransitionGroup transitionName="modal-anim">
          <div className="modal-cover">
            <div className="modal modal-new-document">
              <div className="modal-content">
                Pdf Me Yo!
                <a href="#" target="_blank" ref="pdfLink">Download My Pdf</a>
                <button type="button" onClick={() => this.dismiss()}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      )
    } else {
      return (
        <ReactCSSTransitionGroup transitionName="modal-anim" />
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
