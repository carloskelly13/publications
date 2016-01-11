import {REQUEST_DOCUMENTS, RECEIVE_DOCUMENTS, POST_DOCUMENT, DELETE_DOCUMENT, REQUEST_DOCUMENT, RECEIVE_DOCUMENT, PATCH_DOCUMENT, UPDATE_DOCUMENT} from 'actions/document'

export default function documentReducer(state = {
  documents: [],
  currentDocument: null,
  isRequestingData: false
}, action) {

  switch (action.type) {
  case REQUEST_DOCUMENTS:
  case REQUEST_DOCUMENT:
    return Object.assign({}, state, {
      isRequestingData: true
    })

  case RECEIVE_DOCUMENTS:
    return Object.assign({}, state, {
      documents: action.documents,
      isRequestingData: false
    })

  case POST_DOCUMENT:
    return Object.assign({}, state, {
      documents: [...state.documents, action.doc]
    })

  case DELETE_DOCUMENT:
    return Object.assign({}, state, {
      documents: state.documents.filter(doc => doc.get('_id') !== action.doc.get('_id'))
    })

  case RECEIVE_DOCUMENT:
  case UPDATE_DOCUMENT:
    return Object.assign({}, state, {
      currentDocument: action.doc
    })

  default:
    return state
  }
}
