import {REQUEST_DOCUMENTS, RECEIVE_DOCUMENTS, POST_DOCUMENT, POST_DOCUMENT_FAILURE, RESET_POST_DOCUMENT_FAILURE, DELETE_DOCUMENT, REQUEST_DOCUMENT, RECEIVE_DOCUMENT, PATCH_DOCUMENT, UPDATE_DOCUMENT, RESET_DOCUMENTS} from 'actions/document'

export default function documentReducer(state = {
  documents: [],
  currentDocument: null,
  isRequestingData: false,
  postDocumentFailure: false
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

  case POST_DOCUMENT_FAILURE:
    return Object.assign({}, state, {
      postDocumentFailure: true
    })

  case RESET_POST_DOCUMENT_FAILURE:
    return Object.assign({}, state, {
      postDocumentFailure: false
    })

  case DELETE_DOCUMENT:
    return Object.assign({}, state, {
      documents: state.documents.filter(doc => doc.get('id') !== action.doc.get('id'))
    })

  case RECEIVE_DOCUMENT:
  case UPDATE_DOCUMENT:
    return Object.assign({}, state, {
      currentDocument: action.doc
    })

  case RESET_DOCUMENTS:
    return {
      documents: [],
      currentDocument: null,
      isRequestingData: false
    }

  default:
    return state
  }
}
