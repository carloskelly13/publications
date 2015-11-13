import {merge, isEmpty} from 'lodash';
import AuthComponent from '../../core/auth-component';
import DocumentStore from '../../stores/document.store';
import React, {Component, PropTypes} from 'react';
import {Router, RouteHandler, Link} from 'react-router';

import Canvas from '../canvas/canvas';
import DocumentNavbar from './document.navbar';
import InspectorBase from '../inspector/inspector.base';
import RulerHorizontal from '../rulers/ruler.horizontal';
import RulerVertical from '../rulers/ruler.vertical';
import DocumentPdfViewModal from './document.pdf.modal';

import DocumentActions from '../../actions/document.actions';
import ShapeFactory from '../../core/shape.factory';

export default class Document extends AuthComponent {

  constructor(props, context) {
    super(props);

    this.dataChanged = this.dataChanged.bind(this);
    this.state = {
      doc: DocumentStore.getDocument(),
      selectedShape: null,
      showInspector: false,
      isPdfModalOpen: false,
      zoom: 1.0
    };
  }

  componentWillMount() {
    DocumentStore.addChangeListener(this.dataChanged);
  }

  componentDidMount() {
    DocumentActions.get(this.props.params.id);
  }

  componentWillUnmount() {
    DocumentStore.resetDocument();
    DocumentStore.removeChangeListener(this.dataChanged);
    document.title = 'Publications';
  }

  render() {
    const DPI = 72.0;
    let documentLoaded = !isEmpty(this.state.doc.get('_id'));

    return (
      <div>
        <DocumentPdfViewModal
          doc={this.state.doc}
          togglePdfDownloadModal={::this.togglePdfDownloadModal}
          isOpen={this.state.isPdfModalOpen} />
        <DocumentNavbar
          addNewShape={::this.addNewShape}
          changeZoom={::this.changeZoom}
          downloadPdf={::this.togglePdfDownloadModal}
          save={::this.save}
          title={this.state.doc.get('name')}
          toggleInspector={::this.toggleInspector}
          viewAllDocuments={::this.viewAllDocuments}
          zoom={this.state.zoom} />
        <div className="app-content" id="app-scroll-content">
          <InspectorBase
            doc={this.state.doc}
            dpi={DPI}
            zoom={this.state.zoom}
            selectedShape={this.state.selectedShape}
            updateDocument={::this.updateDocument}
            updateShape={::this.updateShape}
            updateSelectedCanvasObject={::this.updateSelectedCanvasObject}
            showInspector={this.state.showInspector} />
          {
            (() => {
              if (documentLoaded) {
                return (
                  <div>
                    <RulerVertical
                      doc={this.state.doc}
                      dpi={DPI}
                      zoom={this.state.zoom} />
                    <RulerHorizontal
                      doc={this.state.doc}
                      dpi={DPI}
                      zoom={this.state.zoom} />
                  </div>
                )
              }
            })()
          }
          <Canvas
            doc={this.state.doc}
            dpi={DPI}
            zoom={this.state.zoom}
            showInspector={this.state.showInspector}
            selectable={true}
            selectedShape={this.state.selectedShape}
            updateSelectedCanvasObject={::this.updateSelectedCanvasObject}
            updateShape={::this.updateShape} />
        </div>
      </div>
    );
  }

  dataChanged() {
    this.setState({doc: DocumentStore.getDocument()});
    document.title = `Publications — ${this.state.doc.get('name')}`;
  }

  updateSelectedCanvasObject(sender, event) {
    if (event) {
      event.preventDefault();
    }

    this.setState({selectedShape: sender});
  }

  updateDocument(sender) {
    DocumentActions.update(sender);
  }

  updateShape(sender) {
    this.setState({
      setSelectedShape: merge(this.state.selectedShape, sender)
    });
  }

  save() {
    DocumentActions.put(this.props.params.id);
  }

  addNewShape(type) {
    let newShape = null;

    if (type === 'ellipse') {
      newShape = ShapeFactory.ellipse();
    } else if (type === 'text') {
      newShape = ShapeFactory.text();
    } else {
      newShape = ShapeFactory.rectangle();
    }

    let updatedDocument = this.state.doc.update('shapes', shapes => {
      shapes.push(newShape);
      return shapes;
    });

    this.updateDocument(updatedDocument);
    this.updateSelectedCanvasObject(newShape, null);
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

  togglePdfDownloadModal() {
    this.setState({isPdfModalOpen: !this.state.isPdfModalOpen});
  }
}

Document.contextTypes = {router: React.PropTypes.func.isRequired};
