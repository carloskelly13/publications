import range from "lodash.range"
import { put, takeEvery, call } from "redux-saga/effects"
import { handleActions, createAction } from "redux-actions"
import { push } from "react-router-redux"
import { createSelector } from "reselect"
import API from "../util/api"

const initialState = {
  documents: [],
  currentDocument: null,
  selectedShape: null,
  errorFetching: false
}

/**
 * Actions
 */
export const updateSelectedShape = createAction("UPDATE_SELECTED_SHAPE")
export const fetchDocuments = createAction("FETCH_DOCUMENTS_REQUEST")
export const fetchDocument = createAction("FETCH_DOCUMENT_REQUEST")
export const loadDocumentView = createAction("NAVIGATE_TO_DOCUMENT")
export const setEditingTextBox = createAction("SET_EDITING_TEXT_BOX")

/**
 * Sagas
 */
const getDocuments = function *() {
  const response = yield call(API.get, "documents")
  if (response.status !== 200) {
    yield put({ type: "FETCH_DOCUMENTS_FAILURE" })
    return
  }
  const documents = yield response.json()
  yield put({ type: "FETCH_DOCUMENTS_SUCCESS", payload: { documents } })
}

const getDocument = function *({ payload: id }) {
  const response = yield call(API.get, `documents/${id}`)
  if (response.status !== 200) {
    return
  }
  const document = yield response.json()
  yield put({ type: "FETCH_DOCUMENT_SUCCESS", payload: { document } })
}

const navigateToDocument = function *({ payload }) {
  yield put(push(`/documents/${payload.id}`))
}

export default function *() {
  yield takeEvery("FETCH_DOCUMENTS_REQUEST", getDocuments)
  yield takeEvery("FETCH_DOCUMENT_REQUEST", getDocument)
  yield takeEvery("NAVIGATE_TO_DOCUMENT", navigateToDocument)
}

/**
 * Reducer
 */
export const documentReducer = handleActions({
  FETCH_DOCUMENT_SUCCESS: (state, action) => ({
    ...state,
    currentDocument: action.payload.document
  }),

  FETCH_DOCUMENTS_SUCCESS: (state, action) => ({
    ...state,
    currentDocument: null,
    documents: action.payload.documents,
    errorFetching: false
  }),

  FETCH_DOCUMENTS_FAILURE: state => ({
    ...state,
    currentDocument: null,
    documents: [],
    errorFetching: true
  }),

  UPDATE_SELECTED_SHAPE: (state, action) => {
    const updatedState = {}
    const sender = action.payload
    /**
     * If sender is not null, then a new shape has been selected or existing
     * shape that is currently selected has been modified
     */
    if (sender !== null) {
      /**
       * Update shape action only send the delta, so create a new shape object
       * with the previous and new properties merged
       */
      const selectedShape = { ...state.selectedShape, ...sender }
      const currentShapes = state.currentDocument.shapes
      /**
       * If a currently selected shape is being modified replace the existing
       * shape in the documents shape array with a new shapes
       */
      if (
        state.selectedShape !== null && (
        typeof sender.id === "undefined" ||
        sender.id === state.selectedShape.id)
      ) {
        const idx = currentShapes.findIndex(shape => state.selectedShape.id === shape.id)
        const shapes = [
          ...currentShapes.slice(0, idx),
          selectedShape,
          ...currentShapes.slice(idx + 1)
        ]
        updatedState.currentDocument = { ...state.currentDocument, shapes };
      }
      updatedState.selectedShape = selectedShape

    } else {
      /**
       * A shape has been deselected so nullify the selectedShape property
       */
      updatedState.selectedShape = null
    }
    return { ...state, ...updatedState }
  },

  SET_EDITING_TEXT_BOX: (state, action) => ({
    ...state,
    editingTextBoxId: action.payload
  })

}, initialState)

/**
 * Selectors
 */
export const errorFetchingDocumentsSelector = state => state.doc.errorFetching
export const currentDocumentSelector = state => state.doc.currentDocument
export const selectedShapeSelector = state => state.doc.selectedShape
export const allDocumentsSelector = state => state.doc.documents
export const editingTextBoxIdSelector = state => state.doc.editingTextBoxId

export const sortedDocumentsSelector = createSelector(
  allDocumentsSelector,
  docs => docs
    .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
    .map(doc => ({
      ...doc,
      shapes: doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z)
    })))

export const documentMetricsSelector = createSelector(
  currentDocumentSelector,
  doc => (doc ? { width: doc.width, height: doc.height } : { width: 0, height: 0 }))

export const sortedShapesSelector = createSelector(
  currentDocumentSelector,
  doc => doc ? doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z) : [])

export const backgroundGridLineRangesSelector = createSelector(
  documentMetricsSelector,
  () => 1,
  ({ width, height }, zoom) => ({
    x: range(0, width * 72 * zoom, 0.25 * 72 * zoom),
    y: range(0, height * 72 * zoom, 0.25 * 72 * zoom)
  }))
