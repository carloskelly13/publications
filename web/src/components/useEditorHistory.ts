import { useCallback, useRef, useState } from 'react'
import type { PublicationDocument } from '../types'

export type HistorySnapshot = {
  document: PublicationDocument
  selectedShapeIds: string[]
}

type HistoryState = {
  past: HistorySnapshot[]
  future: HistorySnapshot[]
}

const historyLimit = 100

export function useEditorHistory({
  document,
  selectedShapeIds,
  onRestore,
}: {
  document: PublicationDocument | null
  selectedShapeIds: string[]
  onRestore: ({ snapshot }: { snapshot: HistorySnapshot }) => void
}) {
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] })
  const transactionRef = useRef<HistorySnapshot | null>(null)
  const transactionChangedRef = useRef(false)
  const resetHistory = useCallback(() => {
    setHistory({ past: [], future: [] })
    transactionRef.current = null
    transactionChangedRef.current = false
  }, [])

  return {
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    resetHistory,
    recordDocumentChange,
    beginHistoryTransaction,
    commitHistoryTransaction,
    cancelHistoryTransaction,
    undo,
    redo,
  }

  function captureSnapshot(): HistorySnapshot | null {
    if (!document) {
      return null
    }
    return {
      document: structuredClone(document),
      selectedShapeIds: [...selectedShapeIds],
    }
  }

  function pushHistorySnapshot({ snapshot }: { snapshot: HistorySnapshot }) {
    setHistory((current) => ({
      past: [...current.past, snapshot].slice(-historyLimit),
      future: [],
    }))
  }

  function recordDocumentChange() {
    if (transactionRef.current) {
      transactionChangedRef.current = true
      return
    }
    const snapshot = captureSnapshot()
    if (snapshot) {
      pushHistorySnapshot({ snapshot })
    }
  }

  function beginHistoryTransaction() {
    if (transactionRef.current) {
      return
    }
    transactionRef.current = captureSnapshot()
    transactionChangedRef.current = false
  }

  function commitHistoryTransaction() {
    const snapshot = transactionRef.current
    const changed = transactionChangedRef.current
    transactionRef.current = null
    transactionChangedRef.current = false
    if (snapshot && changed) {
      pushHistorySnapshot({ snapshot })
    }
  }

  function cancelHistoryTransaction() {
    const snapshot = transactionRef.current
    transactionRef.current = null
    transactionChangedRef.current = false
    if (snapshot) {
      onRestore({ snapshot })
    }
  }

  function undo() {
    if (transactionRef.current || history.past.length === 0) {
      return
    }
    const snapshot = history.past.at(-1)
    const current = captureSnapshot()
    if (!snapshot || !current) {
      return
    }
    setHistory({
      past: history.past.slice(0, -1),
      future: [current, ...history.future].slice(0, historyLimit),
    })
    onRestore({ snapshot })
  }

  function redo() {
    if (transactionRef.current || history.future.length === 0) {
      return
    }
    const snapshot = history.future[0]
    const current = captureSnapshot()
    if (!current) {
      return
    }
    setHistory({
      past: [...history.past, current].slice(-historyLimit),
      future: history.future.slice(1),
    })
    onRestore({ snapshot })
  }
}
