import React, {Component, PropTypes, addons} from 'react';

const ReactCSSTransitionGroup = addons.CSSTransitionGroup;

export default class NewDocumentModal extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    if (this.props.isOpen) {
      return (
        <ReactCSSTransitionGroup transitionName="modal-anim">
          <div className="modal">
            Carlos
            <button onClick={this.props.toggleNewDocumentModal}>Close</button>
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
