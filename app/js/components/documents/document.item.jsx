import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';

import Canvas from '../canvas/canvas';

export default class DocumentItem extends Component {

  constructor(props, context) {
    super(props);
  }

  render() {
    let selected = !!this.props.selectedDocument &&
                     this.props.selectedDocument.get('_id') == this.props.doc.get('_id');

    return (
      <li className={selected ? 'document-item selected' : 'document-item'}>
        <div onClick={::this.documentSelected} onDoubleClick={::this.documentDoubleClicked}>
          <Canvas doc={this.props.doc} dpi={72} zoom={0.2} selectable={false} />
          <span className="document-item-name">{this.props.doc.get('name')}</span>
          <span className="document-item-description">{this.props.doc.get('width')}&#8221;&#32;&#215;&#32;{this.props.doc.get('height')}&#8221;</span>
        </div>
      </li>
    );
  }

  documentSelected(event) {
    event.stopPropagation();
    this.props.updateSelectedDocument(this.props.doc, null);
  }

  documentDoubleClicked(event) {
    event.stopPropagation();
    this.props.updateSelectedDocument(this.props.doc, null);
    this.props.editDocument();
  }
}
