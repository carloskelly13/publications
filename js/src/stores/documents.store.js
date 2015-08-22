import _ from 'lodash';
import axios from 'axios';

import DocumentActions from '../actions/document.actions';
import Store from '../flux/flux.store';

class DocumentsStore extends Store {

  constructor() {
    super();

    let events = {};
    events[DocumentActions.LIST] = this.list;
    events[DocumentActions.REMOVE] = this.remove;
    events[DocumentActions.CREATE] = this.create;

    this.register(events);
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

  list() {
    let
      token = sessionStorage.getItem('access-token') || '',
      request = axios({
        url: 'http://api.publicationsapp.com/documents',
        method: 'get',
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });

    request.then(responseObj => {
      this.state = {
        documents: responseObj.data,
        selectedDocument: null,
        isNewDocModalOpen: false
      }
    });

    return request;
  }

  remove(payload) {
    let
      doc = payload.action.data.doc,
      token = sessionStorage.getItem('access-token') || '',
      request = axios({
        url: `http://api.publicationsapp.com/documents/${doc._id}`,
        method: 'delete',
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });

    request.then(responseObj => {
      this.state.documents = _.without(this.state.documents, doc);
    });

    return request;
  }

  create(payload) {
    let
      doc = payload.action.data.doc,
      token = sessionStorage.getItem('access-token') || '',
      request = axios({
        url: 'http://api.publicationsapp.com/documents',
        data: doc,
        method: 'post',
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });

    request.then(responseObj => {
      this.state.documents.push(responseObj.data);
    });

    return request;
  }
}

export default new DocumentsStore();
