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
import ShapeFactory from '../../core/shape.factory';

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
    const DPI = 72.0;

    return (
      <div>
        <DocumentNavbar
          addNewShape={(t, e) => this.addNewShape(t, e)}
          changeZoom={(s, e) => this.changeZoom(s, e)}
          downloadPdf={() => this.downloadPdf()}
          save={e => this.save(e)}
          title={this.state.doc.name}
          toggleInspector={e => this.toggleInspector(e)}
          viewAllDocuments={e => this.viewAllDocuments(e)}
          zoom={this.state.zoom} />
        <div className="app-content" id="app-scroll-content">
          <InspectorBase
            doc={this.state.doc}
            dpi={DPI}
            zoom={this.state.zoom}
            selectedShape={this.state.selectedShape}
            updateDocument={e => this.updateDocument(e)}
            updateShape={e => this.updateShape(e)}
            showInspector={this.state.showInspector} />
          <RulerHorizontal
            doc={this.state.doc}
            dpi={DPI}
            zoom={this.state.zoom} />
          <RulerVertical
            doc={this.state.doc}
            dpi={DPI}
            zoom={this.state.zoom} />
          <Canvas
            doc={this.state.doc}
            dpi={DPI}
            zoom={this.state.zoom}
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

  addNewShape(type, event) {
    if (type === 'rect') {
      this.state.doc.shapes.push(ShapeFactory.rectangle());
    } else if (type === 'ellipse') {
      this.state.doc.shapes.push(ShapeFactory.ellipse());
    } else if (type === 'text') {
      this.state.doc.shapes.push(ShapeFactory.text());
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

  changeZoom(sender, event) {
    let currentZoom = this.state.zoom;

    if (sender === 'zoom-in' && currentZoom < 5.0) {
      this.setState({zoom: currentZoom + 0.25});
    } else if (sender === 'zoom-out' && currentZoom > 0.25) {
      this.setState({zoom: currentZoom - 0.25});
    }
  }

  downloadPdf() {
    console.log('Download PDf');
  }
}

Document.contextTypes = {router: React.PropTypes.func.isRequired};
