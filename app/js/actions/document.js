import { Urls } from '../core/constants'
import { addError } from './errors'
import { setCsrfHeaders } from './security'
import NProgress from 'nprogress'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
export const RESET_DOCUMENTS = 'RESET_DOCUMENTS'
export const POST_DOCUMENT = 'POST_DOCUMENT'
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT'
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
export const UPDATE_SELECTED_SHAPE = 'UPDATE_SELECTED_SHAPE'
export const ADD_SHAPE = 'ADD_SHAPE'
export const DELETE_SHAPE = 'DELETE_SHAPE'
export const CUT_SHAPE = 'CUT_SHAPE'
export const COPY_SHAPE = 'COPY_SHAPE'
export const PASTE_SHAPE = 'PASTE_SHAPE'

export function updateSelectedShape(selectedShape) {
  return dispatch => dispatch({
    type: UPDATE_SELECTED_SHAPE,
    selectedShape
  })
}

export function updateCurrentDocument(doc) {
  return dispatch => dispatch({
    type: RECEIVE_DOCUMENT,
    doc
  })
}

export function addShape(newShape) {
  return dispatch => dispatch({
    type: ADD_SHAPE,
    newShape
  })
}

export function deleteShape(shapeToDelete) {
  return dispatch => dispatch({type: DELETE_SHAPE})
}

export function cutShape(shapeToCut) {
  return dispatch => dispatch({type: CUT_SHAPE})
}

export function copyShape(shapeToCopy) {
  return dispatch => dispatch({type: COPY_SHAPE})
}

export function pasteShape() {
  return dispatch => dispatch({type: PASTE_SHAPE})
}

export function updateDocumentProperty(sender) {
  return (dispatch, getState) => dispatch({
    type: UPDATE_DOCUMENT,
    doc: { ...getState().doc.currentDocument, ...sender }
  })
}

export function getDocuments() {
  return dispatch => {
    NProgress.start()

    dispatch({
      type: REQUEST_DOCUMENTS
    })

    fetch(`${Urls.ApiBase}/documents`, {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      }
    })
    .then(documents => {
      NProgress.done()

      dispatch({
        type: RECEIVE_DOCUMENTS,
        documents
      })
    })
  }
}

export function newDocument(doc) {
  return (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    fetch(`${Urls.ApiBase}/documents`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...csrfHeaders
      },
      credentials: 'include',
      body: JSON.stringify(doc)
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      } else {
        addError('create_doc_error')(dispatch)
      }
    })
    .then(documentJson => dispatch({
      type: POST_DOCUMENT,
      doc: documentJson
    }))
  }
}

export function removeDocument(doc) {
  return (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    fetch(`${Urls.ApiBase}/documents/${doc.id}`, {
      method: 'delete',
      credentials: 'include',
      headers: csrfHeaders
    })
    .then(() => dispatch({
      type: DELETE_DOCUMENT,
      doc
    }))
  }
}

export function getDocument(id) {
  return dispatch => {
    dispatch({ type: REQUEST_DOCUMENT })

    fetch(`${Urls.ApiBase}/documents/${id}`, {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
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
  return (dispatch, getState) => {
    const { id } = doc
    const { csrfHeaders } = getState().security

    NProgress.start()

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
        'Content-Type': 'application/json',
        ...csrfHeaders
      },
      body: JSON.stringify(documentJson)
    })
    .then(() => {
      NProgress.done()
      completion()
    })
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
