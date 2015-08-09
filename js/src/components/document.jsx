import _ from 'lodash';
import AuthComponent from '../core/auth-component';
import {DocumentStore} from '../stores/document.store';
import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';

import Canvas from './canvas/canvas';
import DocumentNavbar from './ui/document.navbar';

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
          save={e => this.save(e)}
          viewAllDocuments={e => this.viewAllDocuments(e)} />
        <div className="app-content">
          <div className="document-canvas-container">
            <Canvas
              doc={this.state.doc}
              dpi={72}
              zoom={1}
              selectable={true}
              selectedShape={this.store.state.selectedShape}
              updateSelectedCanvasObject={e => this.updateSelectedCanvasObject(e)}
              updateShape={e => this.updateShape(e)} />
          </div>
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

    this.store.setSelectedShape(sender);
  }

  updateShape(sender) {
    this.store.updateShape(sender);
  }

  save(sender) {
    this.store.updateDocument();
  }

  addNewShape(sender) {
    this.store.addNewShape(sender);
  }

  viewAllDocuments(sender) {
    this.context.router.transitionTo('documents');
  }
}

Document.contextTypes = {router: React.PropTypes.func.isRequired};
