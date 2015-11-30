import {without} from 'lodash'
import {Map} from 'immutable'
import {Promise} from 'es6-promise'
import fetch from 'isomorphic-fetch'

import DocumentActions from '../actions/document.actions'
import ShapeFactory from '../core/shape.factory'
import Store from '../flux/flux.store'

class DocumentStore extends Store {

  constructor() {
    super()

    let events = {}
    events[DocumentActions.GET] = this.get
    events[DocumentActions.PUT] = this.put
    events[DocumentActions.PDF] = this.pdf
    events[DocumentActions.UPDATE] = this.update
    events[DocumentActions.LIST] = this.list
    events[DocumentActions.REMOVE] = this.remove
    events[DocumentActions.CREATE] = this.create

    this.register(events)
    this.resetDocument()
    this.documents = []
  }

  resetDocument() {
    this.doc = Map({id: '', name: '', width: 0, height: 0, shapes: []})
  }

  getDocument() {
    return this.doc
  }

  getDocuments() {
    return this.documents
  }

  update(payload) {
    return new Promise(resolve => {
      this.doc = payload.action.data.doc
      resolve()
    });
  }

  list() {
    const token = sessionStorage.getItem('access-token') || ''

    return fetch('http://api.publicationsapp.com/documents', {
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(json => this.documents = json.map(doc => Map(doc)))
  }

  remove(payload) {
    let
      doc = payload.action.data.doc,
      token = sessionStorage.getItem('access-token') || '';

    return fetch(`http://api.publicationsapp.com/documents/${doc.get('_id')}`, {
      method: 'delete',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(() => this.documents = without(this.documents, doc))
  }

  create(payload) {
    let
      doc = payload.action.data.doc,
      token = sessionStorage.getItem('access-token') || ''

    return fetch('http://api.publicationsapp.com/documents', {
      method: 'post',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doc)
    })
    .then(response => response.json())
    .then(json => this.documents.push(Map(json)))
  }

  get(payload) {
    let
      id = payload.action.data.id,
      token = sessionStorage.getItem('access-token') || ''

    return fetch(`http://api.publicationsapp.com/documents/${id}`, {
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(json => this.doc = Map(json))
  }

  put(payload) {
    let
      id = payload.action.data.id,
      token = sessionStorage.getItem('access-token') || '',
      doc = {
        name: this.doc.get('name'),
        width: this.doc.get('width'),
        height: this.doc.get('height'),
        shapes: this.doc.get('shapes')
      }

    return fetch(`http://api.publicationsapp.com/documents/${id}`, {
      method: 'put',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doc)
    })
  }

  pdf(id) {
    const token = sessionStorage.getItem('access-token') || ''

    return fetch(`http://api.publicationsapp.com/documents/${id}/pdf`, {
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response => response.blob())
  }
}

export default new DocumentStore()
