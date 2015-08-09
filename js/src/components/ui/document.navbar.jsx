import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';
import UserAuth from '../../core/user-auth';

export default class DocumentNavbar extends Component {
  render() {
    return (
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="navbar-logo-icon"></div>
        </div>
        <div className="navbar-controls-center">
          <button className="button" onClick={this.props.addNewShape.bind(this, 'rect')}>Rectangle</button>
          <button className="button" onClick={this.props.addNewShape.bind(this, 'ellipse')}>Ellipse</button>
        </div>
        <div className="navbar-controls-right">
          <button className="button" onClick={this.props.save}>Save</button>
          <button className="button" onClick={this.props.viewAllDocuments}>All Documents</button>
        </div>
      </div>
    );
  }
}
