import React, {Component, PropTypes} from 'react';

export default class DocumentsNavbar extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="navbar-logo-icon"></div>
        </div>
        <div className="navbar-controls-center">
          <button className="button" disabled={!this.props.documentIsSelected} onClick={this.props.editDocument}>Edit</button>
          <button className="button button-destructive" disabled={!this.props.documentIsSelected} onClick={this.props.deleteDocument}>Delete</button>
        </div>
        <div className="navbar-controls-right">
          <button className="button" onClick={this.props.createNewDocument}>New Document</button>
          <button className="button" onClick={this.props.logOut}>Log Out</button>
        </div>
      </div>
    );
  }
}
