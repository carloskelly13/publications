import {findIndex, without} from 'lodash'

import {
  REQUEST_DOCUMENTS,
  RECEIVE_DOCUMENTS,
  POST_DOCUMENT,
  DELETE_DOCUMENT,
  REQUEST_DOCUMENT,
  RECEIVE_DOCUMENT,
  PATCH_DOCUMENT,
  UPDATE_DOCUMENT,
  RESET_DOCUMENTS,
  UPDATE_SELECTED_SHAPE,
  ADD_SHAPE,
  DELETE_SHAPE
} from 'actions/document'

export default function documentReducer(state = {
  documents: [],
  currentDocument: null,
  selectedShape: null,
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

  case ADD_SHAPE: {
    const updatedDocument = Object.assign({}, state.currentDocument, {
      shapes: [
        ...state.currentDocument.shapes,
        action.newShape
      ]
    })

    return Object.assign({}, state, {
      currentDocument: updatedDocument,
      selectedShape: action.newShape
    })
  }

  case DELETE_SHAPE: {
    const updatedDocument = Object.assign({}, state.currentDocument, {
      shapes: state.currentDocument.shapes.filter(s => s.id !== action.shapeToDelete.id)
    })

    return Object.assign({}, state, {
      currentDocument: updatedDocument,
      selectedShape: null
    })
  }

  case UPDATE_SELECTED_SHAPE: {
    let updatedState = {}
    const sender = action.selectedShape

    /**
     * If sender is not null, then a new shape has been selected or existing
     * shape that is currently selected has been modified
     */
    if (sender !== null) {
      /**
       * Update shape action only send the delta, so create a new shape object
       * with the previous and new properties merged
       */
      const selectedShape = Object.assign({}, state.selectedShape, sender)
      const currentShapes = state.currentDocument.shapes

      /**
       * If a currently selected shape is being modified replace the existing
       * shape in the documents shape array with a new shapes
       */
      if (state.selectedShape !== null && (
          typeof sender.id === 'undefined' ||
          sender.id == state.selectedShape.id)) {

        const idx = findIndex(currentShapes, shape => state.selectedShape.id == shape.id)
        const shapes = [
          ...currentShapes.slice(0, idx),
          ...currentShapes.slice(idx + 1, currentShapes.length),
          selectedShape
        ]

        updatedState.currentDocument = Object.assign({}, state.currentDocument, {shapes})
      }

      updatedState.selectedShape = selectedShape

    } else {
      /**
       * A shape has been deselected so nullify the selectedShape property
       */
      updatedState.selectedShape = null
    }

    return Object.assign({}, state, updatedState)
  }

  case POST_DOCUMENT:
    return Object.assign({}, state, {
      documents: [...state.documents, action.doc]
    })

  case DELETE_DOCUMENT:
    return Object.assign({}, state, {
      documents: state.documents.filter(doc => doc.id !== action.doc.id)
    })

  case RECEIVE_DOCUMENT:
  case UPDATE_DOCUMENT: {
    let updatedState = {currentDocument: action.doc}

    if (!action.doc) {
      updatedState.selectedShape = null
    }

    return Object.assign({}, state, updatedState)
  }

  case RESET_DOCUMENTS:
    return {
      documents: [],
      currentDocument: null,
      isRequestingData: false,
      selectedShape: null
    }

  default:
    return state
  }
}
