import React, {Component, PropTypes} from 'react';

export default class DocumentNavbar extends Component {
  render() {

    return (
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="navbar-logo-icon"></div>
        </div>
        <div className="navbar-controls-center">
          <button className="button button-icon" onClick={this.props.addNewShape.bind(event, 'rect')}>
            <span className="icon icon-rect"></span>
          </button>
          <button className="button button-icon" onClick={this.props.addNewShape.bind(event, 'ellipse')}>
            <span className="icon icon-ellipse"></span>
          </button>
          <button className="button button-icon" onClick={this.props.addNewShape.bind(event, 'text')}>
            <span className="icon icon-text"></span>
          </button>
          <div className="spacer"></div>
          <button className="button button-icon" onClick={this.props.downloadPdf}>
            <span className="icon icon-download"></span>
          </button>
          <div className="spacer"></div>
          <button className="button button-icon" onClick={this.props.changeZoom.bind(event, 'zoom-in')}>
            <span className="icon icon-zoom-in"></span>
          </button>
          <span className="button-label button-label-bordered">{this.props.zoom * 100}%</span>
          <button className="button button-icon" onClick={this.props.changeZoom.bind(event, 'zoom-out')}>
            <span className="icon icon-zoom-out"></span>
          </button>
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
