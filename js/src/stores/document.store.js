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

  clearState() {
    this.setState({
      doc: {id: '', name: '', width: 0, height: 0, shapes: []},
      selectedShape: null,
      showInspector: false
    });
  }

  getDocument(id) {
    Api.get({
      path: `${DOCUMENTS_PATH}/${id}`,
      success: (responseObj) => {
        this.state = {doc: responseObj, selectedShape: null, showInspector: true};
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
