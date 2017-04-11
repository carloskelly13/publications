import { Urls } from "../../util/constants"
import { setCsrfHeaders } from "./security"

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

export const addShape = newShape => {
  return dispatch => dispatch({
    type: ADD_SHAPE,
    newShape
  })
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
  return dispatch => {
    dispatch({ type: REQUEST_DOCUMENTS })
    fetch(`${Urls.ApiBase}/documents`, {
      method: "get",
      credentials: "include"
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      }
      throw new Error("Unable to parse document JSON")
    })
    .then(documents => {
      dispatch({
        type: RECEIVE_DOCUMENTS,
        documents
      })
    })
  }
}

export const newDocument = doc => {
  return (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    fetch(`${Urls.ApiBase}/documents`, {
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...csrfHeaders
      },
      credentials: "include",
      body: JSON.stringify(doc)
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      }
      throw new Error("Unable to create new document")
    })
    .then(documentJson => dispatch({
      type: POST_DOCUMENT,
      doc: documentJson
    }))
  }
}

export const removeDocument = doc => {
  return (dispatch, getState) => {
    const { csrfHeaders } = getState().security

    fetch(`${Urls.ApiBase}/documents/${doc.id}`, {
      method: "delete",
      credentials: "include",
      headers: csrfHeaders
    })
    .then(() => dispatch({
      type: DELETE_DOCUMENT,
      doc
    }))
  }
}

export const getDocument = id => {
  return dispatch => {
    dispatch({ type: REQUEST_DOCUMENT })

    fetch(`${Urls.ApiBase}/documents/${id}`, {
      method: "get",
      credentials: "include"
    })
    .then(response => {
      if (response.status === 200) {
        setCsrfHeaders(response.headers)(dispatch)
        return response.json()
      }
      throw new Error(`Unable to get document with id: ${id}`)
    })
    .then(documentJson => dispatch({
      type: RECEIVE_DOCUMENT,
      doc: documentJson
    }))
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
