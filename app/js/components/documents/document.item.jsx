import React, { Component, PropTypes } from 'react'
import { Router, RouteHandler, Link } from 'react-router'
import { autobind } from 'core-decorators'
import moment from 'moment'

import Canvas from '../canvas/canvas'

export default class DocumentItem extends Component {
  constructor() {
    super(...arguments)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.selectedDocument && nextProps.selectedDocument.id === this.props.doc.id) ||
      (this.props.selectedDocument && this.props.selectedDocument.id === this.props.doc.id)
  }

  render() {
    const selected = (!!this.props.selectedDocument &&
      this.props.selectedDocument.id == this.props.doc.id)

    const lastModifiedDate = new Date(this.props.doc.lastModified)
    const formattedDate = moment(lastModifiedDate).format('MMM D, h:mm A')

    return (
      <li className={`document-item ${selected ? 'selected' : ''}`}>
        <div
          onClick={this.documentSelected}
          onDoubleClick={this.documentDoubleClicked}>
          <Canvas
            doc={this.props.doc}
            dpi={72}
            zoom={0.2}
            selectable={false} />
          <span className="document-item-name">
            {this.props.doc.name}
          </span>
          <span className="document-item-description">
            { formattedDate }
          </span>
          <span className="document-item-description">
            {this.props.doc.width}&#8221;&#32;&#215;&#32;{this.props.doc.height}&#8221;
          </span>
        </div>
      </li>
    )
  }

  @autobind
  documentSelected(event) {
    event.stopPropagation()
    this.props.updateSelectedDocument(this.props.doc, null)
  }

  @autobind
  documentDoubleClicked(event) {
    event.stopPropagation()
    this.props.updateSelectedDocument(this.props.doc, null)
    this.props.editDocument()
  }
}
