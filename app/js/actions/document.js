import {Map} from 'immutable'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'
export const RESET_DOCUMENTS = 'RESET_DOCUMENTS'
export const POST_DOCUMENT = 'POST_DOCUMENT'
export const DELETE_DOCUMENT = 'DELETE_DOCUMENT'
export const REQUEST_DOCUMENT = 'REQUEST_DOCUMENT'
export const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
export const PUT_DOCUMENT = 'PUT_DOCUMENT'
export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'

const requestDocuments = () => ({
  type: REQUEST_DOCUMENTS
})

const receiveDocuments = documents => ({
  type: RECEIVE_DOCUMENTS,
  documents
})

const postDocument = doc => ({
  type: POST_DOCUMENT,
  doc
})

const deleteDocument = doc => ({
  type: DELETE_DOCUMENT,
  doc
})

const requestDocument = () => ({
  type: REQUEST_DOCUMENT
})

const receiveDocument = doc => ({
  type: RECEIVE_DOCUMENT,
  doc
})

const putDocument = () => ({
  type: PUT_DOCUMENT
})

const updateDocument = doc => ({
  type: UPDATE_DOCUMENT,
  doc
})

const resetDocuments = () => ({
  type: RESET_DOCUMENTS
})

export function getDocuments() {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      return
    }

    dispatch(requestDocuments())

    fetch('http://api.publicationsapp.com/documents', {
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(json => {
      const documents = json.map(doc => Map(doc))
      dispatch(receiveDocuments(documents))
    })
  }
}

export function newDocument(doc) {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      return
    }

    fetch('http://api.publicationsapp.com/documents', {
      method: 'post',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(doc)
    })
    .then(response => response.json())
    .then(documentJson => dispatch(postDocument(Map(documentJson))))
  }
}

export function removeDocument(doc) {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      return
    }

    fetch(`http://api.publicationsapp.com/documents/${doc.get('_id')}`, {
      method: 'delete',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(() => dispatch(deleteDocument(doc)))
  }
}

export function getDocument(id) {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      return
    }

    dispatch(requestDocument())

    fetch(`http://api.publicationsapp.com/documents/${id}`, {
      method: 'get',
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(documentJson => {
      const doc = Map(documentJson)
      dispatch(receiveDocument(doc))
    })
  }
}

export function saveDocument(doc, completion = () => {}) {
  return dispatch => {
    const token = sessionStorage.getItem('access-token')

    if (!token) {
      return
    }

    const id = doc.get('_id')

    const documentJson = {
      name: doc.get('name'),
      width: doc.get('width'),
      height: doc.get('height'),
      shapes: doc.get('shapes')
    }

    fetch(`http://api.publicationsapp.com/documents/${id}`, {
      method: 'put',
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(documentJson)
    })
    .then(completion)
  }
}

export function documentChanged(doc) {
  return dispatch => dispatch(updateDocument(doc))
}

export function clearDocuments() {
  return dispatch => dispatch(resetDocuments())
}
