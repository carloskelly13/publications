import React, {Component, PropTypes} from 'react';

export default class DocumentNavbar extends Component {
  render() {
    return (
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="navbar-logo-icon"></div>
        </div>
        <div className="navbar-controls-right">
          <button className="button" onClick={this.props.toggleInspector}>Inspector</button>
          <button className="button" onClick={this.props.save}>Save</button>
          <button className="button" onClick={this.props.viewAllDocuments}>All Documents</button>
        </div>
      </div>
    );
  }
}
