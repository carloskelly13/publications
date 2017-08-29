import shortid from "shortid"
import { push } from "react-router-redux"
import { Urls } from "../../util/constants"
import { setCsrfHeaders } from "./security"
import { showModal, hideModal } from "./app-ui"
import SaveChanges from "../../components/documents/save-changes"
import { currentDocumentSelector, currentDocumentOriginalSelector } from "../selectors"
import isEqual from "lodash.isequal"

export const REQUEST_DOCUMENTS = "REQUEST_DOCUMENTS"
export const RECEIVE_DOCUMENTS = "RECEIVE_DOCUMENTS"
export const RESET_DOCUMENTS = "RESET_DOCUMENTS"
export const POST_DOCUMENT = "POST_DOCUMENT"
export const DELETE_DOCUMENT = "DELETE_DOCUMENT"
export const REQUEST_DOCUMENT = "REQUEST_DOCUMENT"
export const RECEIVE_DOCUMENT = "RECEIVE_DOCUMENT"
export const UPDATE_DOCUMENT = "UPDATE_DOCUMENT"
export const UPDATE_SELECTED_SHAPE = "UPDATE_SELECTED_SHAPE"
export const ADD_SHAPE = "ADD_SHAPE"
export const DELETE_SHAPE = "DELETE_SHAPE"
export const CUT_SHAPE = "CUT_SHAPE"
export const COPY_SHAPE = "COPY_SHAPE"
export const PASTE_SHAPE = "PASTE_SHAPE"
export const REPLACE_DOCUMENT = "REPLACE_DOCUMENT"
export const ADJUST_SHAPE_LAYER = "ADJUST_SHAPE_LAYER"

export const updateSelectedShape = selectedShape => {
  return dispatch => dispatch({
    type: UPDATE_SELECTED_SHAPE,
    selectedShape
  })
}

export const updateCurrentDocument = doc => {
  return dispatch => dispatch({
    type: RECEIVE_DOCUMENT,
    doc
  })
}

export const addShape = shapeData => {
  return (dispatch, getState) => {
    const newShape = {
      ...shapeData,
      id: shortid.generate(),
      z: getState().doc.currentDocument.shapes.length + 1
    }
    dispatch({
      type: ADD_SHAPE,
      payload: newShape
    })
    dispatch(updateSelectedShape(newShape))
  }
}

export const deleteShape = () => {
  return dispatch => dispatch({ type: DELETE_SHAPE })
}

export const cutShape = () => {
  return dispatch => dispatch({ type: CUT_SHAPE })
}

export const copyShape = () => {
  return dispatch => dispatch({ type: COPY_SHAPE })
}

export const pasteShape = () => {
  return dispatch => dispatch({ type: PASTE_SHAPE })
}

export const adjustShapeLayer = ({ shape, direction }) => ({
  type: ADJUST_SHAPE_LAYER,
  payload: { shape, direction }
})

export const updateDocumentProperty = sender => {
  return (dispatch, getState) => dispatch({
    type: UPDATE_DOCUMENT,
    doc: { ...getState().doc.currentDocument, ...sender }
  })
}

export const getDocuments = () => {
  return async dispatch => {
    dispatch({ type: REQUEST_DOCUMENTS })

    const response = await fetch(`${Urls.ApiBase}/documents`, {
      method: "get",
      credentials: "include"
    })

    if (response.status !== 200) {
      throw new Error("Unable to parse document JSON")
    }

    const documents = await response.json()

    dispatch({
      type: RECEIVE_DOCUMENTS,
      documents: documents || []
    })
  }
}

export const saveDocument = doc => {
  return (dispatch, getState) => {
    const { id, width, height, shapes, name } = doc
    const { csrfHeaders } = getState().security

    dispatch({
      type: "REPLACE_DOCUMENT",
      payload: { ...doc, lastModified: (new Date()).getTime() }
    })

    fetch(`${Urls.ApiBase}/documents/${id}`, {
      method: "put",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...csrfHeaders
      },
      body: JSON.stringify({ width, height, shapes, name })
    })
  }
}

export const newDocument = doc => {
  return async (dispatch, getState) => {
    const { csrfHeaders } = getState().security
    const response = await fetch(`${Urls.ApiBase}/documents`, {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...csrfHeaders
      },
      credentials: "include",
      body: JSON.stringify(doc)
    })

    if (response.status !== 200) {
      throw new Error("Unable to create new document")
    }

    dispatch(setCsrfHeaders(response.headers))

    const json = await response.json()

    dispatch({ type: POST_DOCUMENT, payload: json })

    const currentDocument = currentDocumentSelector(getState())
    const currentDocumentOriginal = currentDocumentOriginalSelector(getState())

    if (!isEqual(currentDocument, currentDocumentOriginal)) {
      return dispatch(showModal(SaveChanges, {
        handleRouteChange: () => dispatch(push(`/documents/${json.id}`)),
        saveDocument: sender => saveDocument(sender)(dispatch, getState)
      }))
    }

    dispatch(hideModal())
    return dispatch(push(`/documents/${json.id}`))
  }
}

export const removeDocument = doc => {
  return async (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    await fetch(`${Urls.ApiBase}/documents/${doc.id}`, {
      method: "delete",
      credentials: "include",
      headers: csrfHeaders
    })

    dispatch({ type: DELETE_DOCUMENT, doc })
  }
}

export const getDocument = id => {
  return async dispatch => {
    dispatch({ type: REQUEST_DOCUMENT })

    const response = await fetch(`${Urls.ApiBase}/documents/${id}`, {
      method: "get",
      credentials: "include"
    })

    if (response.status !== 200) {
      return dispatch(push("/documents"))
    }

    dispatch(setCsrfHeaders(response.headers))

    const json = await response.json()

    return dispatch({ type: RECEIVE_DOCUMENT, doc: json })
  }
}

export const documentChanged = doc => {
  return dispatch => dispatch({
    type: UPDATE_DOCUMENT,
    doc
  })
}

export const clearDocuments = () => {
  return dispatch => dispatch({
    type: RESET_DOCUMENTS
  })
}
