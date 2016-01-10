import {Map} from 'immutable'

export const REQUEST_DOCUMENTS = 'REQUEST_DOCUMENTS'
export const RECEIVE_DOCUMENTS = 'RECEIVE_DOCUMENTS'

const requestDocuments = () => ({
  type: REQUEST_DOCUMENTS
})

const receiveDocuments = documents => ({
  type: RECEIVE_DOCUMENTS,
  documents
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
