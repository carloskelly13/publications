import _ from 'lodash';
import AuthComponent from '../core/auth-component';
import {DocumentStore} from '../stores/document.store';
import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';

import Canvas from './canvas/canvas';
import DocumentNavbar from './ui/document.navbar';
import InspectorBase from './ui/inspector.base';

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
    this.store.getDocument(this.props.params.id);
  }

  componentWillUnmount() {
    this.store.clearState();
    this.store.removeChangeListener(this.dataChanged);
  }

  render() {
    return (
      <div>
        <DocumentNavbar
          addNewShape={e => this.addNewShape(e)}
          toggleInspector={e => this.toggleInspector(e)}
          save={e => this.save(e)}
          viewAllDocuments={e => this.viewAllDocuments(e)} />
        <div className="app-content">
          <InspectorBase
            showInspector={this.state.showInspector} />
          <Canvas
            doc={this.state.doc}
            dpi={72}
            zoom={1}
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
  }

  updateSelectedCanvasObject(sender, event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({selectedShape: sender});
  }

  updateShape(sender) {
    this.setState({
      setSelectedShape: _.merge(this.state.selectedShape, sender)
    });
  }

  save(sender) {
    this.store.updateDocument();
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
