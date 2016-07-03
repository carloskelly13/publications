import React, {Component, PropTypes} from 'react'
import {autobind} from 'core-decorators'
import AboutButton from '../ui/about.button'
import { Urls } from 'core/constants'

export default class DocumentNavbar extends Component {
  @autobind
  zoomIn() {
    this.props.changeZoom('zoom-in')
  }

  @autobind
  zoomOut() {
    this.props.changeZoom('zoom-out')
  }

  render() {
    return (
      <div className="navbar-container">
        <div className="navbar-controls-left">
          <AboutButton />
          <button className="button" onClick={this.props.save}>Save</button>
          <a
            className="button"
            href={ `${Urls.ApiBase}/documents/${this.props.doc.id}/pdf` }
            target="_blank">
            PDF
          </a>
          <button className="button" onClick={this.props.viewAllDocuments}>All Documents</button>
        </div>
        <div className="navbar-controls-right">
          <button className="button button-icon" onClick={this.zoomIn}>
            <span className="icon icon-zoom-in"></span>
          </button>
          <span className="button-label">{this.props.zoom * 100}%</span>
          <button className="button button-icon" onClick={this.zoomOut}>
            <span className="icon icon-zoom-out"></span>
          </button>
          <div className="spacer"></div>
          <button disabled={!this.props.selectedShape} className="button button-icon" onClick={this.props.cutShape}>
            <span className="icon icon-cut"></span>
          </button>
          <button disabled={!this.props.selectedShape} className="button button-icon" onClick={this.props.copyShape}>
            <span className="icon icon-copy"></span>
          </button>
          <button disabled={!this.props.clipboard} className="button button-icon" onClick={this.props.pasteShape}>
            <span className="icon icon-paste"></span>
          </button>
          <button disabled={!this.props.selectedShape} className="button button-icon" onClick={this.props.deleteShape}>
            <span className="icon icon-delete"></span>
          </button>
          <div className="spacer"></div>
          <button className="button button-icon" onClick={this.props.toggleInspector}>
            <span className={`icon icon-inspector ${this.props.showInspector ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
    );
  }
}
