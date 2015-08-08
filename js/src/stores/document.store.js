import _ from 'lodash';
import Api from '../core/api';
import {Promise} from 'es6-promise';
import Router from 'react-router';
import ShapeFactory from '../core/shape.factory';
import Store from '../flux/flux.store';

const DOCUMENTS_PATH = '/documents';

class DocumentStoreFactory extends Store {

  constructor() {
    super();
    this.initState();
  }

  initState() {
    this.clearState();
  }

  setSelectedShape(sender) {
    this.state.selectedShape = sender;
    this.emitChange();
  }

  updateShape(options) {
    _.extend(this.state.selectedShape, options);
    this.emitChange();
  }

  clearState() {
    this.setState({
      doc: {id: '', name: '', width: 0, height: 0, shapes: []},
      selectedShape: null
    });
  }

  addNewShape(type) {
    switch (type) {
      case 'rect':
      this.state.doc.shapes.push(ShapeFactory.rectangle());
      break;

      case 'ellipse':
      this.state.doc.shapes.push(ShapeFactory.ellipse());
      break;

      default: break;
    }

    this.emitChange();
  }

  getDocument(id) {
    Api.get({
      path: `${DOCUMENTS_PATH}/${id}`,
      success: (responseObj) => {
        this.state = {doc: responseObj, selectedShape: null};
        this.emitChange();
      },
      failure: (error) => {
        console.log(error);
      }
    });
  }

  updateDocument() {
    Api.put({
      path: `${DOCUMENTS_PATH}/${this.state.doc._id}`,
      data: {
        name: this.state.doc.name,
        width: this.state.doc.width,
        height: this.state.doc.height,
        shapes: this.state.doc.shapes
      },
      success: (responseObj) => {
        this.state.doc = responseObj;
        this.emitChange();
      },
      failure: (error) => {
        console.log(error);
      }
    });
  }
}

export const DocumentStore = new DocumentStoreFactory();
