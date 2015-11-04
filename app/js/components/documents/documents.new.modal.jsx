import React, {Component, PropTypes, addons} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';

export default class NewDocumentModal extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      form: {
        name:  null,
        width: null,
        height: null,
        valid: false
      }
    };
  }

  render() {
    if (this.props.isOpen) {
      return (
        <ReactCSSTransitionGroup
          transitionName="modal-anim"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          <div className="modal-cover">
            <div className="modal modal-new-document">
              <div className="modal-content">
                <div className="modal-header">
                  <h1>Create New Document</h1>
                  <h3>Specify the name, width and height of the new blank document.</h3>
                </div>
                <div className="modal-inner-content">
                  <form onSubmit={e => this.handleSubmit(e)}>
                    <input type="text"
                      name="name"
                      value={this.state.form.name}
                      onChange={e => this.validate(e)} />
                    <input type="text"
                      name="width"
                      value={this.state.form.width}
                      onChange={e => this.validate(e)} />
                    <input type="text"
                      name="height"
                      value={this.state.form.height}
                      onChange={e => this.validate(e)} />
                    <button type="submit" disabled={!this.state.form.valid}>
                      Create Document
                    </button>
                    <button type="button" onClick={this.props.toggleNewDocumentModal}>
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      )
    } else {
      return (
        <ReactCSSTransitionGroup 
          transitionName="modal-anim"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={0} />
      )
    }
  }

  validate(event) {
    this.state.form[event.target.name] = event.target.value;
    this.state.form.valid = this.isFormValid();
    this.setState({form: this.state.form});
  }

  isFormValid() {
    let
      width = parseFloat(this.state.form.width),
      height = parseFloat(this.state.form.height);

    return (
      _.isString(this.state.form.name) &&
      _.isNumber(width) && !_.isNaN(width) && width > 1.0 &&
      _.isNumber(height) && !_.isNaN(height) && height > 1.0);
  }

  handleSubmit(event) {
    event.preventDefault();

    let
      width = parseFloat(this.state.form.width),
      height = parseFloat(this.state.form.height);

    this.props.createNewDocument({
      name: this.state.form.name,
      width: width,
      height: height
    });
  }
}
