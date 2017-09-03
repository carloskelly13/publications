/**
 * Document Selectors
 * Publications
 */
import { createSelector } from "reselect"
import range from "lodash.range"
import { zoomSelector } from "./app-ui"

export const currentDocumentSelector = state => state.doc.currentDocument
export const currentDocumentOriginalSelector = state => state.doc.currentDocumentOriginal
export const allDocumentsSelector = state => state.doc.documents
export const selectedShapeSelector = state => state.doc.selectedShape
export const clipboardDataSelector = state => state.doc.clipboardData

export const isDocumentActiveSelector = createSelector(
  currentDocumentSelector,
  doc => !!doc
)

export const sortedDocumentsSelector = createSelector(
  allDocumentsSelector,
  docs => docs
            .sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
            .map(doc => ({
              ...doc,
              shapes: doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z)
            }))
)

export const sortedShapesSelector = createSelector(
  currentDocumentSelector,
  doc => doc.shapes.sort((lhs, rhs) => lhs.z - rhs.z)
)

export const documentMetricsSelector = createSelector(
  currentDocumentSelector,
  doc => ({ width: doc.width, height: doc.height })
)

export const backgroundGridLineRangesSelector = createSelector(
  documentMetricsSelector,
  zoomSelector,
  ({ width, height }, zoom) => ({
    x: range(0, width * 72 * zoom, 0.25 * 72 * zoom),
    y: range(0, height * 72 * zoom, 0.25 * 72 * zoom)
  })
)
