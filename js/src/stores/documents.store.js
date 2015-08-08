import _ from 'lodash';
import Api from '../core/api';
import {Promise} from 'es6-promise';
import Router from 'react-router';
import Store from '../flux/flux.store';

const DOCUMENTS_PATH = '/documents';

class DocumentsStoreFactory extends Store {

  constructor() {
    super();
    this.initState();
  }

  initState() {
    this.setState({documents: [], selectedDocument: null, isNewDocModalOpen: false});
  }

  setSelectedDocument(sender) {
    this.state.selectedDocument = sender;
    this.emitChange();
  }

  toggleNewDocumentModal() {
    this.state.isNewDocModalOpen = !this.state.isNewDocModalOpen;
    this.emitChange();
  }

  getAllDocuments() {
    Api.get({
      path: DOCUMENTS_PATH,
      success: (responseObj) => {
        this.state = {documents: responseObj, selectedDocument: null, isNewDocModalOpen: false};
        this.emitChange();
      },
      failure: (error) => {
        console.log(error);
      }
    });
  }

  createNewDocument(options) {
    Api.post({
      path: DOCUMENTS_PATH,
      data: options,
      success: (responseObj) => {
        this.state.documents.push(responseObj);
        this.emitChange();
      },
      failure: (error) => {
        console.log(error);
      }
    });
  }

  deleteDocument(doc) {
    if (this.state.selectedDocument === doc) {
      this.state.selectedDocument = null;
    }

    Api.del({
      path: DOCUMENTS_PATH + '/' + doc._id,
      success: (responseObj) => {
        this.state.documents = _.without(this.state.documents, doc);
        this.emitChange();
      },
      failure: (error) => {
        console.log(error);
      }
    });
  }
}

export const DocumentsStore = new DocumentsStoreFactory();
