import {without} from 'lodash';
import axios from 'axios';
import {Map} from 'immutable';
import {Promise} from 'es6-promise';

import DocumentActions from '../actions/document.actions';
import ShapeFactory from '../core/shape.factory';
import Store from '../flux/flux.store';

class DocumentStore extends Store {

  constructor() {
    super();

    let events = {};
    events[DocumentActions.GET] = this.get;
    events[DocumentActions.PUT] = this.put;
    events[DocumentActions.PDF] = this.pdf;
    events[DocumentActions.UPDATE] = this.update;
    events[DocumentActions.LIST] = this.list;
    events[DocumentActions.REMOVE] = this.remove;
    events[DocumentActions.CREATE] = this.create;

    this.register(events);
    this.resetDocument();
    this.documents = [];
  }

  resetDocument() {
    this.doc = Map({id: '', name: '', width: 0, height: 0, shapes: []});
  }

  getDocument() {
    return this.doc;
  }

  getDocuments() {
    return this.documents;
  }

  update(payload) {
    return new Promise(resolve => {
      this.doc = payload.action.data.doc;
      resolve();
    });
  }

  list() {
    let token = sessionStorage.getItem('access-token') || '';

    return axios({
      url: 'http://api.publicationsapp.com/documents',
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    }).then(responseObj => {
      this.documents = responseObj.data.map(doc => Map(doc));
    });
  }

  remove(payload) {
    let
      doc = payload.action.data.doc,
      token = sessionStorage.getItem('access-token') || '';

    return axios({
      url: `http://api.publicationsapp.com/documents/${doc.get('_id')}`,
      method: 'delete',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    }).then(responseObj => {
      this.documents = without(this.documents, doc);
    });
  }

  create(payload) {
    let
      doc = payload.action.data.doc,
      token = sessionStorage.getItem('access-token') || '';

    return axios({
      url: 'http://api.publicationsapp.com/documents',
      data: doc,
      method: 'post',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    }).then(responseObj => {
      this.documents.push(Map(responseObj.data));
    });
  }

  get(payload) {
    let
      id = payload.action.data.id,
      token = sessionStorage.getItem('access-token') || '';

    return axios({
      url: `http://api.publicationsapp.com/documents/${id}`,
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    }).then(responseObj => this.doc = Map(responseObj.data));
  }

  put(payload) {
    let
      id = payload.action.data.id,
      token = sessionStorage.getItem('access-token') || '';

    return axios({
      url: `http://api.publicationsapp.com/documents/${id}`,
      method: 'put',
      data: {
        name: this.doc.get('name'),
        width: this.doc.get('width'),
        height: this.doc.get('height'),
        shapes: this.doc.get('shapes')
      },
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    });
  }

  pdf(id) {
    let
      token = sessionStorage.getItem('access-token') || '',
      request = axios({
        url: `http://api.publicationsapp.com/documents/${id}/pdf`,
        method: 'get',
        headers: {
          'Authorization' : `Bearer ${token}`
        },
        responseType: 'arraybuffer'
      });

    return request;
  }
}

export default new DocumentStore();
