/**
 * Document Selectors
 * Publications
 */
import { createSelector } from "reselect"

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
  docs => docs.sort((lhs, rhs) => rhs.lastModified - lhs.lastModified)
)
