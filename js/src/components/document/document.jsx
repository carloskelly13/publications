import _ from 'lodash';
import AuthComponent from '../../core/auth-component';
import DocumentStore from '../../stores/document.store';
import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';

import Canvas from '../canvas/canvas';
import DocumentNavbar from './document.navbar';
import InspectorBase from '../inspector/inspector.base';
import RulerHorizontal from '../rulers/ruler.horizontal';
import RulerVertical from '../rulers/ruler.vertical';

import DocumentActions from '../../actions/document.actions';

export default class Document extends AuthComponent {

  constructor(props, context) {
    super(props);
    this.dataChanged = this.dataChanged.bind(this);
    this.store = DocumentStore;
    this.state = this.store.getState();
  }

  componentWillMount() {
    this.store.addChangeListener(this.dataChanged);
  }

  componentDidMount() {
    DocumentActions.get(this.props.params.id);
  }

  componentWillUnmount() {
    this.store.clearState();
    this.store.removeChangeListener(this.dataChanged);
    document.title = 'Publications';
  }

  render() {
    let zoom = 1;
    const DPI = 72.0;

    return (
      <div>
        <DocumentNavbar
          addNewShape={e => this.addNewShape(e)}
          toggleInspector={e => this.toggleInspector(e)}
          save={e => this.save(e)}
          title={this.state.doc.name}
          viewAllDocuments={e => this.viewAllDocuments(e)} />
        <div className="app-content" id="app-scroll-content">
          <InspectorBase
            doc={this.state.doc}
            dpi={DPI}
            zoom={zoom}
            selectedShape={this.state.selectedShape}
            updateDocument={e => this.updateDocument(e)}
            updateShape={e => this.updateShape(e)}
            showInspector={this.state.showInspector} />
          <RulerHorizontal
            doc={this.state.doc}
            dpi={DPI}
            zoom={zoom} />
          <RulerVertical
            doc={this.state.doc}
            dpi={DPI}
            zoom={zoom} />
          <Canvas
            doc={this.state.doc}
            dpi={DPI}
            zoom={zoom}
            showInspector={this.state.showInspector}
            selectable={true}
            selectedShape={this.state.selectedShape}
            updateSelectedCanvasObject={e => this.updateSelectedCanvasObject(e)}
            updateShape={e => this.updateShape(e)} />
        </div>
      </div>
    );
  }

  dataChanged() {
    this.setState(this.store.getState());
    document.title = `Publications — ${this.state.doc.name}`;
  }

  updateSelectedCanvasObject(sender, event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({selectedShape: sender});
  }

  updateDocument(sender) {
    this.setState({
      doc: _.merge(this.state.doc, sender)
    });
  }

  updateShape(sender) {
    this.setState({
      setSelectedShape: _.merge(this.state.selectedShape, sender)
    });
  }

  save() {
    DocumentActions.update(this.props.params.id);
  }

  addNewShape(sender) {
    if (type === 'rect') {
      this.state.doc.shapes.push(ShapeFactory.rectangle());
    } else if (type === 'ellipse') {
      this.state.doc.shapes.push(ShapeFactory.ellipse());
    } else {
      return;
    }

    this.setState({doc: this.state.doc});
  }

  viewAllDocuments(sender) {
    this.context.router.transitionTo('documents');
  }

  toggleInspector(sender) {
    this.setState({showInspector: !this.state.showInspector});
  }
}

Document.contextTypes = {router: React.PropTypes.func.isRequired};
