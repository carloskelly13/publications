import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';

import Canvas from './canvas/canvas';

export default class DocumentItem extends Component {

  constructor(props, context) {
    super(props);
    this.documentSelected = this.documentSelected.bind(this);
  }

  render() {
    let selected = !!this.props.selectedDocument &&
                     this.props.selectedDocument._id == this.props.doc._id;

    return (
      <li className={selected ? 'document-item selected' : 'document-item'}>
        <div onClick={this.documentSelected}>
          <Canvas doc={this.props.doc} dpi={72} zoom={0.2} selectable={false} />
          <span className="document-item-name">{this.props.doc.name}</span>
          <span className="document-item-description">{this.props.doc.width}&#8221;&#32;&#215;&#32;{this.props.doc.height}&#8221;</span>
        </div>
      </li>
    );
  }

  documentSelected(event) {
    event.stopPropagation();
    this.props.updateSelectedDocument(this.props.doc, null);
  }
}
