import type { Editor } from '@tiptap/core'
import { createPortal } from 'react-dom'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError, api, fetchClient } from '../api'
import { applyElementPatch, elementBounds, elementInput } from '../elements'
import type { ElementPatch } from '../elements'
import type { DocumentDraft, ElementResponse, PublicationDocument } from '../types'
import { DocumentCanvas } from './DocumentCanvas'
import { EditorToolbar, type ExportStatus, type SaveStatus } from './EditorToolbar'
import { EditorSidebar } from './EditorSidebar'
import { EditorWorkspace } from './EditorWorkspace'
import { LayersPanel } from './LayersPanel'
import { PropertiesPanel } from './MetricsPanel'

type LoadState =
  | { status: 'loading' }
  | { status: 'loaded'; document: PublicationDocument }
  | { status: 'error'; message: string }

type HistorySnapshot = {
  document: PublicationDocument
  selectedShapeIds: string[]
}

type HistoryState = {
  past: HistorySnapshot[]
  future: HistorySnapshot[]
}

const historyLimit = 100

const documentDraft = (document: PublicationDocument): DocumentDraft => ({
  name: document.name ?? 'Untitled',
  pages: (document.pages ?? []).map((page, index) => ({
    pageNumber: page.pageNumber ?? index + 1,
    width: page.width ?? 8.5,
    height: page.height ?? 11,
    elements: (page.elements ?? []).map((element) => elementInput({ element })),
  })),
})

const wait = ({ durationMs }: { durationMs: number }) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, durationMs))

export function EditorPage() {
  const { documentId } = useParams<{ documentId: string }>()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [zoom, setZoom] = useState(1)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle')
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([])
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null)
  const [textEditor, setTextEditor] = useState<Editor | null>(null)
  const [layersOpen, setLayersOpen] = useState(true)
  const [layersWidth, setLayersWidth] = useState(272)
  const [layersPanelHeight, setLayersPanelHeight] = useState(308)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [clipboardShapes, setClipboardShapes] = useState<ElementResponse[]>([])
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] })
  const [toolbarTarget, setToolbarTarget] = useState<HTMLElement | null>(null)
  const exportCanvasRef = useRef<SVGSVGElement>(null)
  const saveFeedbackTimerRef = useRef<number | null>(null)
  const pasteCountRef = useRef(0)
  const transactionRef = useRef<HistorySnapshot | null>(null)
  const transactionChangedRef = useRef(false)
  const documentQuery = api.useQuery(
    'get',
    '/api/documents/{id}',
    { params: { path: { id: documentId ?? '' } } },
    { enabled: Boolean(documentId) },
  )
  const saveMutation = api.useMutation('put', '/api/documents/{id}')

  useEffect(() => {
    setToolbarTarget(document.getElementById('editor-toolbar-slot'))
  }, [])

  useEffect(
    () => () => {
      if (saveFeedbackTimerRef.current !== null) {
        window.clearTimeout(saveFeedbackTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!documentId) {
      setState({ status: 'error', message: 'This document has no identifier.' })
      return
    }
    setState({ status: 'loading' })
    setSelectedShapeIds([])
    setEditingShapeId(null)
    setTextEditor(null)
    setHistory({ past: [], future: [] })
    transactionRef.current = null
    transactionChangedRef.current = false
  }, [documentId])

  useEffect(() => {
    if (documentQuery.data) {
      setState({ status: 'loaded', document: documentQuery.data })
    }
  }, [documentQuery.data])

  useEffect(() => {
    const queryError: unknown = documentQuery.error
    if (!queryError) {
      return
    }
    setState({
      status: 'error',
      message:
        queryError instanceof ApiError && queryError.status === 404
          ? 'Document not found'
          : 'Unable to load this document',
    })
  }, [documentQuery.error])

  const handleKeyboard = useEffectEvent((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    const typing =
      target?.isContentEditable ||
      target?.closest('input, textarea, select, [contenteditable="true"]') !== null
    if (typing || editingShapeId) {
      return
    }

    const modifier = event.metaKey || event.ctrlKey
    const key = event.key.toLowerCase()
    if (modifier && key === 'z' && event.shiftKey && history.future.length > 0) {
      event.preventDefault()
      redo()
    } else if (modifier && key === 'z' && history.past.length > 0) {
      event.preventDefault()
      undo()
    } else if (modifier && key === 'y' && history.future.length > 0) {
      event.preventDefault()
      redo()
    } else if (modifier && key === 'x' && selectedShapeIds.length > 0) {
      event.preventDefault()
      cutSelection()
    } else if (modifier && key === 'c' && selectedShapeIds.length > 0) {
      event.preventDefault()
      copySelection()
    } else if (modifier && key === 'v' && clipboardShapes.length > 0) {
      event.preventDefault()
      pasteSelection()
    } else if (modifier && key === 'd' && selectedShapeIds.length > 0) {
      event.preventDefault()
      duplicateSelection()
    } else if (modifier && key === 'a' && state.status === 'loaded') {
      event.preventDefault()
      selectAllShapes()
    } else if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      selectedShapeIds.length > 0
    ) {
      event.preventDefault()
      deleteLayers({ shapeIds: selectedShapeIds })
    } else if (event.key === 'Escape' && selectedShapeIds.length > 0) {
      setSelectedShapeIds([])
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [])

  const updateShape = ({ shapeId, changes }: { shapeId: string; changes: ElementPatch }) => {
    recordDocumentChange()
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: (current.document.pages ?? []).map((page) => ({
            ...page,
            elements: (page.elements ?? []).map((shape) =>
              shape.id === shapeId ? applyElementPatch({ element: shape, patch: changes }) : shape,
            ),
          })),
        },
      }
    })
    setSaveStatus('idle')
  }

  const reorderLayers = ({
    draggedShapeId,
    targetShapeId,
    position,
  }: {
    draggedShapeId: string
    targetShapeId: string
    position: 'before' | 'after'
  }) => {
    const currentLayers = [
      ...(state.status === 'loaded' ? (state.document.pages?.[0]?.elements ?? []) : []),
    ]
    const sourceIndex = currentLayers.findIndex(({ id }) => id === draggedShapeId)
    const targetIndex = currentLayers.findIndex(({ id }) => id === targetShapeId)
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
      return
    }
    recordDocumentChange()
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      const layers = [...(firstPage.elements ?? [])].sort(
        (left, right) => (right.z ?? 0) - (left.z ?? 0),
      )
      const sourceIndex = layers.findIndex(({ id }) => id === draggedShapeId)
      const targetIndex = layers.findIndex(({ id }) => id === targetShapeId)
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return current
      }
      const [moved] = layers.splice(sourceIndex, 1)
      const adjustedTargetIndex = layers.findIndex(({ id }) => id === targetShapeId)
      const insertionIndex = adjustedTargetIndex + (position === 'after' ? 1 : 0)
      layers.splice(insertionIndex, 0, moved)
      const shapes = layers.reverse().map((shape, index) => ({ ...shape, z: index + 1 }))
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [{ ...firstPage, elements: shapes }, ...pages.slice(1)],
        },
      }
    })
    setSaveStatus('idle')
  }

  const moveLayer = ({
    shapeId,
    direction,
  }: {
    shapeId: string
    direction: 'front' | 'up' | 'down' | 'back'
  }) => {
    if (state.status !== 'loaded') {
      return
    }
    const layers = [...(state.document.pages?.[0]?.elements ?? [])].sort(
      (left, right) => (right.z ?? 0) - (left.z ?? 0),
    )
    const sourceIndex = layers.findIndex(({ id }) => id === shapeId)
    const targetIndex =
      direction === 'front'
        ? 0
        : direction === 'back'
          ? layers.length - 1
          : direction === 'up'
            ? sourceIndex - 1
            : sourceIndex + 1
    const target = layers[targetIndex]
    if (sourceIndex >= 0 && target) {
      reorderLayers({
        draggedShapeId: shapeId,
        targetShapeId: target.id,
        position: direction === 'front' || direction === 'up' ? 'before' : 'after',
      })
    }
  }

  const duplicateLayer = ({ shapeId }: { shapeId: string }) => {
    const original =
      state.status === 'loaded'
        ? state.document.pages?.[0]?.elements?.find(({ id }) => id === shapeId)
        : undefined
    if (!original) {
      return
    }
    recordDocumentChange()
    const duplicateId = `draft-${crypto.randomUUID()}`
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      const shapes = firstPage.elements ?? []
      const original = shapes.find(({ id }) => id === shapeId)
      if (!original) {
        return current
      }
      const duplicate: ElementResponse = {
        ...structuredClone(original),
        id: duplicateId,
        x: (original.x ?? 0) + 0.25,
        y: (original.y ?? 0) + 0.25,
        z: Math.max(0, ...shapes.map(({ z }) => z ?? 0)) + 1,
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [{ ...firstPage, elements: [...shapes, duplicate] }, ...pages.slice(1)],
        },
      }
    })
    setSelectedShapeIds([duplicateId])
    setEditingShapeId(null)
    setTextEditor(null)
    setSaveStatus('idle')
  }

  const deleteLayers = ({ shapeIds }: { shapeIds: string[] }) => {
    const deleting = new Set(shapeIds)
    const hasMatchingShape =
      state.status === 'loaded' &&
      state.document.pages?.[0]?.elements?.some(({ id }) => deleting.has(id))
    if (!hasMatchingShape) {
      return
    }
    recordDocumentChange()
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [
            {
              ...firstPage,
              elements: (firstPage.elements ?? []).filter(({ id }) => !deleting.has(id)),
            },
            ...pages.slice(1),
          ],
        },
      }
    })
    setSelectedShapeIds((current) => current.filter((shapeId) => !deleting.has(shapeId)))
    if (editingShapeId && deleting.has(editingShapeId)) {
      setEditingShapeId(null)
      setTextEditor(null)
    }
    setSaveStatus('idle')
  }

  const addShape = (type: 'rect' | 'circle' | 'text' | 'line') => {
    if (state.status !== 'loaded' || !state.document.pages?.[0]) {
      return
    }
    recordDocumentChange()
    const id = `draft-${crypto.randomUUID()}`
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      const size =
        type === 'circle'
          ? { width: 1.5, height: 1.5 }
          : type === 'text'
            ? { width: 4, height: 1.5 }
            : type === 'line'
              ? { width: 4, height: 0 }
              : { width: 2, height: 1.5 }
      const shapes = firstPage.elements ?? []
      const common = {
        id,
        x: Math.max(0, ((firstPage.width ?? 8.5) - size.width) / 2),
        y: Math.max(0, ((firstPage.height ?? 11) - size.height) / 2),
        z: Math.max(0, ...shapes.map((item) => item.z ?? 0)) + 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        hidden: false,
      }
      const shape: ElementResponse =
        type === 'line'
          ? {
              ...common,
              kind: 'path',
              data: {
                commands: [
                  { type: 'move', x: 0, y: 0 },
                  { type: 'line', x: size.width, y: size.height },
                ],
                fill: null,
                border: { color: '#7c3aed', opacity: 1, width: 2 },
              },
            }
          : type === 'text'
            ? {
                ...common,
                kind: 'text',
                data: {
                  size,
                  content: { type: 'doc', content: [{ type: 'paragraph' }] },
                  padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  verticalAlignment: 'top',
                },
              }
            : {
                ...common,
                kind: 'shape',
                data: {
                  size,
                  geometry:
                    type === 'circle'
                      ? { type: 'ellipse' }
                      : {
                          type: 'rectangle',
                          radius: {
                            topLeft: 0,
                            topRight: 0,
                            bottomRight: 0,
                            bottomLeft: 0,
                          },
                        },
                  fill: { color: '#a78bfa', opacity: 1 },
                  border: { color: '#7c3aed', opacity: 1, width: 1 },
                },
              }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [{ ...firstPage, elements: [...shapes, shape] }, ...pages.slice(1)],
        },
      }
    })
    setSelectedShapeIds([id])
    setEditingShapeId(type === 'text' ? id : null)
    setSaveStatus('idle')
  }

  const save = async () => {
    if (state.status !== 'loaded' || !documentId) {
      return
    }
    if (saveFeedbackTimerRef.current !== null) {
      window.clearTimeout(saveFeedbackTimerRef.current)
    }
    setSaveStatus('saving')
    try {
      const requestPromise = saveMutation.mutateAsync({
        params: { path: { id: documentId } },
        body: documentDraft(state.document),
      })
      const [request] = await Promise.allSettled([requestPromise, wait({ durationMs: 1000 })])
      if (request.status === 'rejected') {
        throw request.reason
      }
      setState({ status: 'loaded', document: request.value })
      setSelectedShapeIds([])
      setEditingShapeId(null)
      setTextEditor(null)
      setSaveStatus('saved')
      saveFeedbackTimerRef.current = window.setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      saveFeedbackTimerRef.current = window.setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const exportPdf = async () => {
    if (state.status !== 'loaded' || !documentId || !exportCanvasRef.current) {
      return
    }
    const page = state.document.pages?.[0]
    if (!page) {
      return
    }
    setExportStatus('exporting')
    try {
      const svg = new XMLSerializer().serializeToString(exportCanvasRef.current)
      const { data: pdf } = await fetchClient.POST('/api/documents/{id}/pdf', {
        params: { path: { id: documentId } },
        body: { svg, width: page.width ?? 8.5, height: page.height ?? 11 },
        parseAs: 'blob',
      })
      if (!(pdf instanceof Blob)) {
        throw new Error('Unable to export this PDF')
      }
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = `${(state.document.name ?? 'Untitled').replace(/[\\/:*?"<>|]/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setExportStatus('idle')
    } catch {
      setExportStatus('error')
    }
  }

  if (state.status === 'loading') {
    return (
      <div className="grid min-h-0 flex-1 place-items-center bg-gray-200 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-400">
        Loading document…
      </div>
    )
  }

  const page = state.status === 'loaded' ? state.document.pages?.[0] : undefined
  if (state.status === 'error' || !page) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center bg-gray-100 px-6 text-center dark:bg-gray-950">
        <div>
          <h1 className="text-lg font-semibold">Unable to open the editor</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {state.status === 'error' ? state.message : 'This document has no page.'}
          </p>
          <Link
            className="mt-5 inline-block text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
            to="/"
          >
            Back to documents
          </Link>
        </div>
      </div>
    )
  }

  const selectedShapeId = selectedShapeIds.at(-1) ?? null
  const selectedShapes = (page.elements ?? []).filter(({ id }) => selectedShapeIds.includes(id))

  return (
    <>
      {toolbarTarget &&
        createPortal(
          <EditorToolbar
            documentTitle={state.document.name ?? 'Untitled'}
            zoom={zoom}
            onZoomChange={setZoom}
            onSave={() => void save()}
            saveStatus={saveStatus}
            onAddShape={addShape}
            onExportPdf={() => void exportPdf()}
            exportStatus={exportStatus}
            layersOpen={layersOpen}
            onToggleLayers={() => setLayersOpen((open) => !open)}
            snapToGrid={snapToGrid}
            onToggleSnapToGrid={() => setSnapToGrid((enabled) => !enabled)}
            canEditSelection={selectedShapeIds.length > 0}
            canPaste={clipboardShapes.length > 0}
            allSelected={
              (page.elements?.length ?? 0) > 0 && selectedShapeIds.length === page.elements?.length
            }
            onCut={cutSelection}
            onCopy={copySelection}
            onPaste={pasteSelection}
            onDuplicate={duplicateSelection}
            onDelete={() => deleteLayers({ shapeIds: selectedShapeIds })}
            onSelectAll={selectAllShapes}
            onDeselectAll={() => setSelectedShapeIds([])}
            canUndo={history.past.length > 0}
            canRedo={history.future.length > 0}
            onUndo={undo}
            onRedo={redo}
          />,
          toolbarTarget,
        )}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1">
          <EditorWorkspace
            page={page}
            title={state.document.name ?? 'Untitled'}
            zoom={zoom}
            selectedShapeId={selectedShapeId}
            selectedShapeIds={selectedShapeIds}
            onSelectShape={selectShapes}
            onSelectShapes={({ shapeIds }) => {
              if (editingShapeId) {
                finishTextEditing()
              }
              setSelectedShapeIds(shapeIds)
            }}
            onShapeChange={(shapeId, changes) => updateShape({ shapeId, changes })}
            onInteractionStart={beginHistoryTransaction}
            onInteractionEnd={commitHistoryTransaction}
            editingShapeId={editingShapeId}
            onStartTextEditing={startTextEditing}
            onFinishTextEditing={finishTextEditing}
            onTextEditorChange={setTextEditor}
            snapToGrid={snapToGrid}
          />
          <EditorSidebar
            open={layersOpen}
            width={layersWidth}
            onResize={({ width }) => setLayersWidth(width)}
            layersHeight={layersPanelHeight}
            onSplitResize={({ height }) => setLayersPanelHeight(height)}
            layers={
              <LayersPanel
                shapes={page.elements ?? []}
                selectedShapeId={selectedShapeId}
                selectedShapeIds={selectedShapeIds}
                onSelect={selectShapes}
                onReorder={reorderLayers}
                onMove={moveLayer}
                onDuplicate={duplicateLayer}
                onDelete={deleteLayers}
                onSelectionChange={({ shapeIds }) => {
                  if (editingShapeId) {
                    finishTextEditing()
                  }
                  setSelectedShapeIds(shapeIds)
                }}
              />
            }
            properties={
              <PropertiesPanel
                documentName={state.document.name ?? 'Untitled'}
                page={page}
                shapes={selectedShapes}
                textEditor={textEditor}
                onChange={updateMetrics}
                onDocumentNameChange={updateDocumentName}
                onPageChange={updatePageMetrics}
                onEditStart={beginHistoryTransaction}
                onEditEnd={commitHistoryTransaction}
                onEditCancel={cancelHistoryTransaction}
              />
            }
          />
        </div>
        <div className="hidden" aria-hidden="true">
          <DocumentCanvas
            ref={exportCanvasRef}
            page={page}
            title={state.document.name ?? 'Untitled'}
            pixelsPerInch={72}
            className="block bg-white"
          />
        </div>
      </div>
    </>
  )

  function captureSnapshot(): HistorySnapshot | null {
    if (state.status !== 'loaded') {
      return null
    }
    return {
      document: structuredClone(state.document),
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
      restoreSnapshot({ snapshot })
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
    restoreSnapshot({ snapshot })
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
    restoreSnapshot({ snapshot })
  }

  function restoreSnapshot({ snapshot }: { snapshot: HistorySnapshot }) {
    setState({ status: 'loaded', document: structuredClone(snapshot.document) })
    setSelectedShapeIds([...snapshot.selectedShapeIds])
    setEditingShapeId(null)
    setTextEditor(null)
    setSaveStatus('idle')
  }

  function startTextEditing(shapeId: string) {
    beginHistoryTransaction()
    setEditingShapeId(shapeId)
  }

  function finishTextEditing() {
    commitHistoryTransaction()
    setEditingShapeId(null)
    setTextEditor(null)
  }

  function updateDocumentName({ name }: { name: string }) {
    recordDocumentChange()
    setState((current) =>
      current.status === 'loaded'
        ? { status: 'loaded', document: { ...current.document, name } }
        : current,
    )
    setSaveStatus('idle')
  }

  function updateMetrics({ changes }: { changes: ElementPatch }) {
    if (selectedShapes.length === 0) {
      return
    }
    if (selectedShapes.length === 1) {
      const shape = selectedShapes[0]
      const nextChanges = { ...changes }
      if (shape.kind === 'path' && changes.rotation !== undefined) {
        const endpoint = shape.data.commands.at(-1)
        const currentAngle = Math.atan2(endpoint?.y ?? 0, endpoint?.x ?? 0)
        const nextAngle = (changes.rotation * Math.PI) / 180
        const delta = nextAngle - currentAngle
        const cos = Math.cos(delta)
        const sin = Math.sin(delta)
        const rotatePoint = ({ x, y }: { x: number; y: number }) => ({
          x: Number((x * cos - y * sin).toFixed(4)),
          y: Number((x * sin + y * cos).toFixed(4)),
        })
        nextChanges.commands = shape.data.commands.map((command) => {
          const point = rotatePoint({ x: command.x, y: command.y })
          if (command.type !== 'quadratic') {
            return { ...command, ...point }
          }
          const control = rotatePoint({ x: command.controlX, y: command.controlY })
          return { ...command, ...point, controlX: control.x, controlY: control.y }
        })
        nextChanges.rotation = 0
      }
      updateShape({ shapeId: shape.id, changes: nextChanges })
      return
    }

    const selectedIds = new Set(selectedShapeIds)
    const left = Math.min(...selectedShapes.map((shape) => elementBounds({ element: shape }).left))
    const top = Math.min(...selectedShapes.map((shape) => elementBounds({ element: shape }).top))
    const dx = changes.x === undefined ? 0 : changes.x - left
    const dy = changes.y === undefined ? 0 : changes.y - top
    recordDocumentChange()
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: (current.document.pages ?? []).map((currentPage, pageIndex) =>
            pageIndex === 0
              ? {
                  ...currentPage,
                  elements: (currentPage.elements ?? []).map((shape) =>
                    selectedIds.has(shape.id)
                      ? { ...shape, x: (shape.x ?? 0) + dx, y: (shape.y ?? 0) + dy }
                      : shape,
                  ),
                }
              : currentPage,
          ),
        },
      }
    })
    setSaveStatus('idle')
  }

  function updatePageMetrics({ changes }: { changes: Pick<typeof page, 'width' | 'height'> }) {
    recordDocumentChange()
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [{ ...firstPage, ...changes }, ...pages.slice(1)],
        },
      }
    })
    setSaveStatus('idle')
  }

  function selectShapes({
    shapeId,
    additive = false,
    preserveGroup = false,
  }: {
    shapeId: string | null
    additive?: boolean
    preserveGroup?: boolean
  }) {
    if (editingShapeId && shapeId !== editingShapeId) {
      finishTextEditing()
    }
    setSelectedShapeIds((current) => {
      if (!shapeId) {
        return []
      }
      if (additive) {
        return current.includes(shapeId)
          ? current.filter((selectedId) => selectedId !== shapeId)
          : [...current, shapeId]
      }
      if (preserveGroup && current.length > 1 && current.includes(shapeId)) {
        return current
      }
      return [shapeId]
    })
  }

  function copySelection() {
    const copied = (page.elements ?? [])
      .filter(({ id }) => selectedShapeIds.includes(id))
      .map((shape) => structuredClone(shape))
    if (copied.length === 0) {
      return
    }
    setClipboardShapes(copied)
    pasteCountRef.current = 0
  }

  function cutSelection() {
    if (selectedShapeIds.length === 0) {
      return
    }
    copySelection()
    deleteLayers({ shapeIds: selectedShapeIds })
  }

  function pasteSelection() {
    if (clipboardShapes.length === 0) {
      return
    }
    pasteCountRef.current += 1
    insertCopies({ sourceShapes: clipboardShapes, offset: pasteCountRef.current * 0.25 })
  }

  function duplicateSelection() {
    const sourceShapes = (page.elements ?? []).filter(({ id }) => selectedShapeIds.includes(id))
    if (sourceShapes.length === 0) {
      return
    }
    insertCopies({ sourceShapes, offset: 0.25 })
  }

  function insertCopies({
    sourceShapes,
    offset,
  }: {
    sourceShapes: ElementResponse[]
    offset: number
  }) {
    if (sourceShapes.length === 0) {
      return
    }
    recordDocumentChange()
    const existingShapes = page.elements ?? []
    const topZ = Math.max(0, ...existingShapes.map(({ z }) => z ?? 0))
    const copies = sourceShapes.map((source, index) => ({
      ...structuredClone(source),
      id: `draft-${crypto.randomUUID()}`,
      x: (source.x ?? 0) + offset,
      y: (source.y ?? 0) + offset,
      z: topZ + index + 1,
    }))
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [
            { ...firstPage, elements: [...(firstPage.elements ?? []), ...copies] },
            ...pages.slice(1),
          ],
        },
      }
    })
    setSelectedShapeIds(copies.map(({ id }) => id))
    setEditingShapeId(null)
    setTextEditor(null)
    setSaveStatus('idle')
  }

  function selectAllShapes() {
    setSelectedShapeIds((page.elements ?? []).map(({ id }) => id))
    setEditingShapeId(null)
    setTextEditor(null)
  }
}
