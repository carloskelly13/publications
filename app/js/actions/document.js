import {Map} from 'immutable'
import {Urls} from '../core/constants'
import {addError} from './errors'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
export const RESET_DOCUMENTS = 'RESET_DOCUMENTS'
export const POST_DOCUMENT = 'POST_DOCUMENT'
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT'
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
export const UPDATE_SELECTED_SHAPE = 'UPDATE_SELECTED_SHAPE'

export function updateSelectedShape(selectedShape) {
  return dispatch => dispatch({
    type: UPDATE_SELECTED_SHAPE,
    selectedShape
  })
}

export function updateDocumentProperty(sender) {
  return (dispatch, getState) => dispatch({
    type: UPDATE_DOCUMENT,
    doc: Object.assign({}, getState().doc.currentDocument, sender)
  })
}

export function getDocuments() {
  return dispatch => {
    dispatch({
      type: REQUEST_DOCUMENTS
    })

    fetch(`${Urls.ApiBase}/documents`, {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      }
    })
    .then(documents => {
      dispatch({
        type: RECEIVE_DOCUMENTS,
        documents
      })
    })
  }
}

export function newDocument(doc) {
  return dispatch => {
    fetch(`${Urls.ApiBase}/documents`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(doc)
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        addError('create_doc_error')(dispatch)
      }
    })
    .then(documentJson => dispatch({
      type: POST_DOCUMENT,
      doc: Map(documentJson)
    }))
  }
}

export function removeDocument(doc) {
  return dispatch => {
    fetch(`${Urls.ApiBase}/documents/${doc.id}`, {
      method: 'delete',
      credentials: 'include'
    })
    .then(() => dispatch({
      type: DELETE_DOCUMENT,
      doc
    }))
  }
}

export function getDocument(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DOCUMENT
    })

    fetch(`${Urls.ApiBase}/documents/${id}`, {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 200) {
        return response.json()
      }
    })
    .then(documentJson => dispatch({
      type: RECEIVE_DOCUMENT,
      doc: documentJson
    }))
  }
}

export function saveDocument(doc, completion = () => {}) {
  return dispatch => {
    const {id} = doc

    const documentJson = {
      name: doc.name,
      width: doc.width,
      height: doc.height,
      shapes: doc.shapes
    }

    fetch(`${Urls.ApiBase}/documents/${id}`, {
      method: 'put',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(documentJson)
    })
    .then(completion)
  }
}

export function documentChanged(doc) {
  return dispatch => dispatch({
    type: UPDATE_DOCUMENT,
    doc
  })
}

export function clearDocuments() {
  return dispatch => dispatch({
    type: RESET_DOCUMENTS
  })
}
