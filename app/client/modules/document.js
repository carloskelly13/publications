import range from "lodash/range";
import shortid from "shortid";
import { put, takeEvery, call, select, race, take } from "redux-saga/effects";
import { handleActions, createAction } from "redux-actions";
import { EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import importTextStyle from "../util/import-text-style";
import { exporter as textStyleExporter } from "../components/shapes/text-box";
import { push } from "react-router-redux";
import { createSelector } from "reselect";
import API from "../util/api";
import { csrfHeadersSelector } from "./session";
import { showModal, hideModal } from "./ui";
import SaveChanges from "../components/documents/save-changes";

const initialState = {
  documents: [],
  currentDocument: null,
  selectedShape: null,
  errorFetching: false,
  clipboardData: null,
  zoom: 1,
};

/**
 * Actions
 */
export const fetchDocuments = createAction("FETCH_DOCUMENTS_REQUEST");
export const fetchDocument = createAction("FETCH_DOCUMENT_REQUEST");
export const saveDocument = createAction("SAVE_DOCUMENT_REQUEST");
export const newDocument = createAction("NEW_DOCUMENT_REQUEST");
export const loadDocumentView = createAction("NAVIGATE_TO_DOCUMENT");
export const setEditingTextBox = createAction("SET_EDITING_TEXT_BOX");
export const confirmSaveAction = createAction("CONFIRM_SAVE_ACTION");
export const confirmDiscardAction = createAction("CONFIRM_DISCARD_ACTION");
export const setZoom = createAction("SET_ZOOM");

export const addShape = createAction("ADD_SHAPE");
export const deleteShape = createAction("DELETE_SHAPE");
export const copyShape = createAction("COPY_SHAPE");
export const pasteShape = createAction("PASTE_SHAPE");
export const cutShape = createAction("CUT_SHAPE");
export const adjustShapeLayer = createAction("ADJUST_SHAPE_LAYER");
export const updateSelectedShape = createAction("UPDATE_SELECTED_SHAPE");

/**
 * Serialization and Unserialization
 * Publications needs to add EditorState objects to text boxes for
 * rich text formatting. We want to omit the config objects when we
 * post the JSON to the API.
 */

const addEditorStatesToDocument = document => ({
  ...document,
  shapes: document.shapes.map(shape => {
    if (shape.type === "text") {
      const contentState = stateFromHTML(shape.text, {
        customInlineFn: importTextStyle,
      });
      shape.editorState = EditorState.createWithContent(contentState);
    }
    return shape;
  }),
});

const packageDocumentToJson = document => ({
  width: document.width,
  height: document.height,
  name: document.name,
  shapes: document.shapes.map(shape => {
    if (shape.type === "text") {
      const { editorState, ...jsonShape } = shape;
      const inlineStyles = textStyleExporter(editorState);
      jsonShape.text = stateToHTML(editorState.getCurrentContent(), {
        inlineStyles,
      });
      return jsonShape;
    }
    return shape;
  }),
});

/**
 * Sagas
 */

const confirmSaveDocument = function*() {
  yield put(showModal(SaveChanges));

  const { save } = yield race({
    save: take(confirmSaveAction),
    discard: take(confirmDiscardAction),
  });

  if (save) {
    const document = yield select(currentDocumentSelector);
    yield* putDocument({ payload: document });
  }

  yield put(hideModal());
};

const receiveDocument = function*(response) {
  const document = yield response.json();
  yield put({ type: "FETCH_DOCUMENT_SUCCESS", payload: { document } });
};

const navigateToDocument = function*({ payload }) {
  const currentDocument = yield select(currentDocumentSelector);
  if (currentDocument) {
    yield* confirmSaveDocument();
  }
  yield put(push(`/documents/${payload.id}`));
  yield put(hideModal());
};

const getDocuments = function*() {
  const response = yield call(API.get, "documents");
  if (response.status !== 200) {
    yield put({ type: "FETCH_DOCUMENTS_FAILURE" });
    return;
  }
  const documents = yield response.json();
  yield put({ type: "FETCH_DOCUMENTS_SUCCESS", payload: { documents } });
};

const getDocument = function*({ payload: id }) {
  const response = yield call(API.get, `documents/${id}`);
  if (response.status !== 200) {
    return;
  }
  yield* receiveDocument(response);
};

const postDocument = function*({ payload }) {
  const csrfHeaders = yield select(csrfHeadersSelector);
  const response = yield call(API.post, "documents", payload, csrfHeaders);
  if (response.status !== 200) {
    yield put({ type: "NEW_DOCUMENT_FAILURE" });
    return;
  }
  const document = yield response.json();
  yield* navigateToDocument({ payload: document });
};

const putDocument = function*({ payload }) {
  const { id, ...body } = payload;
  const document = packageDocumentToJson(body);
  const csrfHeaders = yield select(csrfHeadersSelector);
  const response = yield call(
    API.put,
    `documents/${id}`,
    document,
    csrfHeaders
  );
  if (response.status !== 200) {
    yield put({ type: "SAVE_DOCUMENT_FAILURE" });
    return;
  }
  yield* receiveDocument(response);
};

export default function*() {
  yield takeEvery("FETCH_DOCUMENTS_REQUEST", getDocuments);
  yield takeEvery("FETCH_DOCUMENT_REQUEST", getDocument);
  yield takeEvery("NAVIGATE_TO_DOCUMENT", navigateToDocument);
  yield takeEvery("SAVE_DOCUMENT_REQUEST", putDocument);
  yield takeEvery("NEW_DOCUMENT_REQUEST", postDocument);
}

/**
 * Reducer
 */
export const documentReducer = handleActions(
  {
    FETCH_DOCUMENT_SUCCESS: (state, action) => ({
      ...state,
      currentDocument: addEditorStatesToDocument(action.payload.document),
      selectedShape: null,
    }),

    FETCH_DOCUMENTS_SUCCESS: (state, action) => ({
      ...state,
      documents: action.payload.documents.map(document =>
        addEditorStatesToDocument(document)
      ),
      errorFetching: false,
    }),

    FETCH_DOCUMENTS_FAILURE: state => ({
      ...state,
      currentDocument: null,
      documents: [],
      errorFetching: true,
    }),

    ADD_SHAPE: (state, action) => {
      const newShape = {
        ...action.payload,
        id: shortid.generate(),
        z: state.currentDocument.shapes.length + 1,
      };
      return {
        ...state,
        selectedShape: newShape,
        currentDocument: {
          ...state.currentDocument,
          shapes: [...state.currentDocument.shapes, newShape],
        },
      };
    },

    DELETE_SHAPE: state => {
      const shapeToDelete = state.selectedShape;
      const updatedShapes = [...state.currentDocument.shapes];
      updatedShapes.forEach(s => {
        if (s.z > shapeToDelete.z) {
          s.z -= 1;
        }
      });

      const updatedDocument = Object.assign({}, state.currentDocument, {
        shapes: updatedShapes.filter(s => s.id !== shapeToDelete.id),
      });

      return Object.assign({}, state, {
        currentDocument: updatedDocument,
        selectedShape: null,
      });
    },

    CUT_SHAPE: state => {
      const shapeToCut = state.selectedShape;
      const updatedShapes = [...state.currentDocument.shapes];
      updatedShapes.forEach(s => {
        if (s.z > shapeToCut.z) {
          s.z -= 1;
        }
      });

      const updatedDocument = Object.assign({}, state.currentDocument, {
        shapes: updatedShapes.filter(s => s.id !== shapeToCut.id),
      });

      const copiedShape = Object.assign({}, shapeToCut, { id: null, z: null });

      return Object.assign({}, state, {
        currentDocument: updatedDocument,
        clipboardData: copiedShape,
        selectedShape: null,
      });
    },

    COPY_SHAPE: state => {
      const shapeToCopy = state.selectedShape;
      const copiedShape = Object.assign({}, shapeToCopy, { id: null, z: null });
      return { ...state, clipboardData: copiedShape };
    },

    PASTE_SHAPE: state => {
      const z = state.currentDocument.shapes.length + 1;
      const pasteShape = Object.assign({}, state.clipboardData, {
        id: shortid.generate(),
        z,
      });

      const updatedDocument = Object.assign({}, state.currentDocument, {
        shapes: [...state.currentDocument.shapes, pasteShape],
      });

      return Object.assign({}, state, {
        currentDocument: updatedDocument,
        selectedShape: pasteShape,
      });
    },

    ADJUST_SHAPE_LAYER: (state, action) => {
      const { source, destination } = action.payload;
      if (!source || !destination) {
        return state;
      }

      const currentShapes = sortedShapesSelector({ doc: state });
      const fromIndex = source.index;
      const toIndex = destination.index;

      const sortedShapes = Array.from(currentShapes);
      const [adjustedShape] = sortedShapes.splice(fromIndex, 1);
      sortedShapes.splice(toIndex, 0, adjustedShape);

      const normalizedShapes = sortedShapes.map((shape, index) => ({
        ...shape,
        z: index + 1,
      }));

      const normalizedSelectedShape = normalizedShapes.find(
        shape => shape.id === adjustedShape.id
      );

      return {
        ...state,
        currentDocument: {
          ...state.currentDocument,
          shapes: normalizedShapes,
        },
        selectedShape: normalizedSelectedShape,
      };
    },

    UPDATE_SELECTED_SHAPE: (state, action) => {
      const updatedState = {};
      const sender = action.payload;
      /**
       * If sender is not null, then a new shape has been selected or existing
       * shape that is currently selected has been modified
       */
      if (sender !== null) {
        /**
         * Update shape action only send the delta, so create a new shape object
         * with the previous and new properties merged
         */
        const selectedShape = { ...state.selectedShape, ...sender };
        const currentShapes = state.currentDocument.shapes;
        /**
         * If a currently selected shape is being modified replace the existing
         * shape in the documents shape array with a new shapes
         */
        if (
          state.selectedShape !== null &&
          (typeof sender.id === "undefined" ||
            sender.id === state.selectedShape.id)
        ) {
          const idx = currentShapes.findIndex(
            shape => state.selectedShape.id === shape.id
          );
          const shapes = [
            ...currentShapes.slice(0, idx),
            selectedShape,
            ...currentShapes.slice(idx + 1),
          ];
          updatedState.currentDocument = { ...state.currentDocument, shapes };
        } else if (sender.type === "text") {
          selectedShape.editorState = EditorState.moveSelectionToEnd(
            selectedShape.editorState
          );
        }
        updatedState.selectedShape = selectedShape;
      } else {
        /**
         * A shape has been deselected so nullify the selectedShape property
         */
        updatedState.selectedShape = null;
      }
      return { ...state, ...updatedState };
    },

    SET_EDITING_TEXT_BOX: (state, action) => ({
      ...state,
      editingTextBoxId: action.payload,
    }),

    SET_ZOOM: (state, action) => ({
      ...state,
      zoom: action.payload,
    }),
  },
  initialState
);

/**
 * Selectors
 */

export const errorFetchingDocumentsSelector = state => state.doc.errorFetching;
export const currentDocumentSelector = state => state.doc.currentDocument;
export const selectedShapeSelector = state => state.doc.selectedShape;
export const allDocumentsSelector = state => state.doc.documents;
export const editingTextBoxIdSelector = state => state.doc.editingTextBoxId;
export const clipboardDataSelector = state => state.doc.clipboardData;
export const zoomSelector = state => state.doc.zoom;

export const sortedDocumentsSelector = createSelector(
  allDocumentsSelector,
  docs =>
    docs.sort((lhs, rhs) => rhs.lastModified - lhs.lastModified).map(doc => ({
      ...doc,
      shapes: doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z),
    }))
);

export const documentMetricsSelector = createSelector(
  currentDocumentSelector,
  doc =>
    doc ? { width: doc.width, height: doc.height } : { width: 0, height: 0 }
);

export const sortedShapesSelector = createSelector(
  currentDocumentSelector,
  doc => (doc ? doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z) : [])
);

export const backgroundGridLineRangesSelector = createSelector(
  documentMetricsSelector,
  zoomSelector,
  ({ width, height }, zoom) => ({
    x: range(0, width * 96 * zoom, 0.25 * 96 * zoom),
    y: range(0, height * 96 * zoom, 0.25 * 96 * zoom),
  })
);
