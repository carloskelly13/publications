import _ from 'lodash';
import axios from 'axios';

import DocumentActions from '../actions/document.actions';
import ShapeFactory from '../core/shape.factory';
import Store from '../flux/flux.store';

class DocumentStore extends Store {

  constructor() {
    super();

    let events = {};
    events[DocumentActions.GET] = this.get;
    events[DocumentActions.UPDATE] = this.update;
    events[DocumentActions.PDF] = this.pdf;

    this.register(events);
    this.initState();
  }

  initState() {
    this.clearState();
  }

  clearState() {
    this.setState({
      doc: {id: '', name: '', width: 0, height: 0, shapes: []},
      selectedShape: null,
      showInspector: false,
      zoom: 1.0
    });
  }

  get(payload) {
    let
      id = payload.action.data.id,
      token = sessionStorage.getItem('access-token') || '',
      request = axios({
        url: `http://api.publicationsapp.com/documents/${id}`,
        method: 'get',
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });

    request.then(responseObj => {
      this.state = {
        doc: responseObj.data,
        selectedShape: null,
        showInspector: true
      }
    });

    return request;
  }

  update(payload) {
    let
      id = payload.action.data.id,
      token = sessionStorage.getItem('access-token') || '',
      request = axios({
        url: `http://api.publicationsapp.com/documents/${id}`,
        method: 'put',
        data: {
          name: this.state.doc.name,
          width: this.state.doc.width,
          height: this.state.doc.height,
          shapes: this.state.doc.shapes
        },
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });

    return request;
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
