import React, {Component, PropTypes, addons} from 'react';
import _ from 'lodash';

const ReactCSSTransitionGroup = addons.CSSTransitionGroup;

export default class DocumentPdfViewModal extends Component {
  render() {
    if (this.props.isOpen) {
      return (
        <ReactCSSTransitionGroup transitionName="modal-anim">
          <div className="modal-cover">

          </div>
        </ReactCSSTransitionGroup>
      )
    } else {
      return (
        <ReactCSSTransitionGroup transitionName="modal-anim" />
      )
    }
  }
}
