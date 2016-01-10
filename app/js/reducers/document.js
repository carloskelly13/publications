import {REQUEST_DOCUMENTS, RECEIVE_DOCUMENTS} from 'actions/document'

export default function documentReducer(state = {
  documents: [],
  currentDocument: null,
  isRequestingData: false
}, action) {

  switch (action.type) {
  case REQUEST_DOCUMENTS:
    return Object.assign({}, state, {
      isRequestingData: true
    })

  case RECEIVE_DOCUMENTS:
    return Object.assign({}, state, {
      documents: action.documents,
      isRequestingData: false
    })

  default:
    return state
  }
}
