import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';
import UserAuth from '../../core/user-auth';

export default class DocumentNavbar extends Component {
  constructor(props, context) {
    super(props);

    this.save = this.save.bind(this);
    this.viewAllDocuments = this.viewAllDocuments.bind(this);
    this.addNewShape = this.addNewShape.bind(this);
  }

  render() {

    return (
      <div className="navbar-container">
        <div className="navbar-wordmark">
          <span className="navbar-title">Publications</span>
        </div>
        <div className="navbar-controls-center">
          <button className="button" onClick={this.addNewShape.bind(this, 'rect')}>Rectangle</button>
          <button className="button" onClick={this.addNewShape.bind(this, 'ellipse')}>Ellipse</button>
        </div>
        <div className="navbar-controls-right">
          <button className="button" onClick={this.save}>Save</button>
          <button className="button" onClick={this.viewAllDocuments}>All Documents</button>
        </div>
      </div>
    );
  }

  save(sender) {
    this.props.store.updateDocument();
  }

  addNewShape(sender) {
    this.props.store.addNewShape(sender);
  }

  viewAllDocuments(sender) {
    this.context.router.transitionTo('documents');
  }
}

DocumentNavbar.contextTypes = {router: React.PropTypes.func.isRequired};
