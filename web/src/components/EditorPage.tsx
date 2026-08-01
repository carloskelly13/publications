import type { Editor } from '@tiptap/core'
import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError, api, fetchClient } from '../api'
import type { DocumentDraft, PublicationDocument, ShapeInput, ShapeResponse } from '../types'
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

const shapeInput = (shape: ShapeResponse): ShapeInput => ({
  type: shape.type,
  width: shape.width,
  height: shape.height,
  x: shape.x,
  y: shape.y,
  pathGeometry: shape.pathGeometry,
  z: shape.z,
  radiusTopLeft: shape.radiusTopLeft,
  radiusTopRight: shape.radiusTopRight,
  radiusBottomRight: shape.radiusBottomRight,
  radiusBottomLeft: shape.radiusBottomLeft,
  rotation: shape.rotation,
  fill: shape.fill,
  fillOpacity: shape.fillOpacity,
  stroke: shape.stroke,
  strokeWidth: shape.strokeWidth,
  strokeOpacity: shape.strokeOpacity,
  text: shape.text,
  richTextContent: shape.richTextContent,
  contentVersion: shape.contentVersion,
})

const documentDraft = (document: PublicationDocument): DocumentDraft => ({
  name: document.name ?? 'Untitled',
  pages: (document.pages ?? []).map((page, index) => ({
    pageNumber: page.pageNumber ?? index + 1,
    width: page.width ?? 8.5,
    height: page.height ?? 11,
    shapes: (page.shapes ?? []).map(shapeInput),
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
  const [toolbarTarget, setToolbarTarget] = useState<HTMLElement | null>(null)
  const exportCanvasRef = useRef<SVGSVGElement>(null)
  const saveFeedbackTimerRef = useRef<number | null>(null)
  const documentQuery = api.useQuery(
    'get',
    '/api/documents/{id}',
    { params: { path: { id: documentId ?? '' } } },
    { enabled: Boolean(documentId) },
  )
  const saveMutation = api.useMutation('put', '/api/documents/{id}')
  const renameMutation = api.useMutation('patch', '/api/documents/{id}')

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

  const updateShape = ({ shapeId, changes }: { shapeId: string; changes: Partial<ShapeInput> }) => {
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
            shapes: (page.shapes ?? []).map((shape) =>
              shape.id === shapeId ? { ...shape, ...changes } : shape,
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
    setState((current) => {
      if (current.status !== 'loaded') {
        return current
      }
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) {
        return current
      }
      const layers = [...(firstPage.shapes ?? [])].sort(
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
        document: { ...current.document, pages: [{ ...firstPage, shapes }, ...pages.slice(1)] },
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
    const layers = [...(state.document.pages?.[0]?.shapes ?? [])].sort(
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
      const shapes = firstPage.shapes ?? []
      const original = shapes.find(({ id }) => id === shapeId)
      if (!original) {
        return current
      }
      const duplicate: ShapeResponse = {
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
          pages: [{ ...firstPage, shapes: [...shapes, duplicate] }, ...pages.slice(1)],
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
              shapes: (firstPage.shapes ?? []).filter(({ id }) => !deleting.has(id)),
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
      const shapes = firstPage.shapes ?? []
      const shape: ShapeResponse = {
        id,
        type: type === 'circle' ? 'ellipse' : type,
        x: Math.max(0, ((firstPage.width ?? 8.5) - size.width) / 2),
        y: Math.max(0, ((firstPage.height ?? 11) - size.height) / 2),
        ...size,
        pathGeometry:
          type === 'line'
            ? {
                version: 1,
                commands: [
                  { type: 'move', x: 0, y: 0 },
                  { type: 'line', x: size.width, y: size.height },
                ],
              }
            : undefined,
        z: Math.max(0, ...shapes.map((item) => item.z ?? 0)) + 1,
        radiusTopLeft: 0,
        radiusTopRight: 0,
        radiusBottomRight: 0,
        radiusBottomLeft: 0,
        rotation: 0,
        fill: type === 'text' || type === 'line' ? 'none' : '#a78bfa',
        fillOpacity: 1,
        stroke: type === 'text' ? 'none' : '#7c3aed',
        strokeWidth: type === 'text' ? 0 : type === 'line' ? 2 : 1,
        strokeOpacity: 1,
        richTextContent:
          type === 'text' ? { type: 'doc', content: [{ type: 'paragraph' }] } : undefined,
        contentVersion: 1,
      }
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [{ ...firstPage, shapes: [...shapes, shape] }, ...pages.slice(1)],
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
  const selectedShapes = (page.shapes ?? []).filter(({ id }) => selectedShapeIds.includes(id))

  return (
    <>
      {toolbarTarget &&
        createPortal(
          <EditorToolbar
            documentTitle={state.document.name ?? 'Untitled'}
            onRenameDocument={renameDocument}
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
              setSelectedShapeIds(shapeIds)
              setEditingShapeId(null)
              setTextEditor(null)
            }}
            onShapeChange={(shapeId, changes) => updateShape({ shapeId, changes })}
            editingShapeId={editingShapeId}
            onStartTextEditing={setEditingShapeId}
            onFinishTextEditing={() => {
              setEditingShapeId(null)
              setTextEditor(null)
            }}
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
                shapes={page.shapes ?? []}
                selectedShapeId={selectedShapeId}
                selectedShapeIds={selectedShapeIds}
                onSelect={selectShapes}
                onReorder={reorderLayers}
                onMove={moveLayer}
                onDuplicate={duplicateLayer}
                onDelete={deleteLayers}
                onSelectionChange={({ shapeIds }) => {
                  setSelectedShapeIds(shapeIds)
                  setEditingShapeId(null)
                  setTextEditor(null)
                }}
              />
            }
            properties={
              <PropertiesPanel
                shapes={selectedShapes}
                textEditor={textEditor}
                onChange={updateMetrics}
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

  async function renameDocument({ name }: { name: string }) {
    if (!documentId) {
      throw new Error('This document has no identifier')
    }
    await renameMutation.mutateAsync({
      params: { path: { id: documentId } },
      body: { name },
    })
    setState((current) =>
      current.status === 'loaded'
        ? { status: 'loaded', document: { ...current.document, name } }
        : current,
    )
  }

  function updateMetrics({ changes }: { changes: Partial<ShapeInput> }) {
    if (selectedShapes.length === 0) {
      return
    }
    if (selectedShapes.length === 1) {
      const shape = selectedShapes[0]
      const nextChanges = { ...changes }
      if (shape.type === 'line' && shape.pathGeometry && changes.rotation !== undefined) {
        const currentAngle = Math.atan2(shape.height ?? 0, shape.width ?? 0)
        const nextAngle = (changes.rotation * Math.PI) / 180
        const delta = nextAngle - currentAngle
        const cos = Math.cos(delta)
        const sin = Math.sin(delta)
        const rotatePoint = ({ x, y }: { x: number; y: number }) => ({
          x: Number((x * cos - y * sin).toFixed(4)),
          y: Number((x * sin + y * cos).toFixed(4)),
        })
        nextChanges.pathGeometry = {
          ...shape.pathGeometry,
          commands: shape.pathGeometry.commands.map((command) => {
            const point = rotatePoint({ x: command.x, y: command.y })
            if (command.type !== 'quadratic') {
              return { ...command, ...point }
            }
            const control = rotatePoint({ x: command.controlX, y: command.controlY })
            return { ...command, ...point, controlX: control.x, controlY: control.y }
          }),
        }
        const endpoint = nextChanges.pathGeometry.commands.at(-1)
        nextChanges.width = endpoint?.x ?? shape.width
        nextChanges.height = endpoint?.y ?? shape.height
        nextChanges.rotation = 0
      }
      if (
        shape.type === 'line' &&
        shape.pathGeometry &&
        (changes.width !== undefined || changes.height !== undefined)
      ) {
        const width = changes.width ?? shape.width ?? 0
        const height = changes.height ?? shape.height ?? 0
        nextChanges.pathGeometry = {
          ...shape.pathGeometry,
          commands: shape.pathGeometry.commands.map((command, index, commands) =>
            index === commands.length - 1 && command.type !== 'move'
              ? { ...command, x: width, y: height }
              : command,
          ),
        }
      }
      updateShape({ shapeId: shape.id, changes: nextChanges })
      return
    }

    const selectedIds = new Set(selectedShapeIds)
    const left = Math.min(
      ...selectedShapes.map((shape) => Math.min(shape.x ?? 0, (shape.x ?? 0) + (shape.width ?? 0))),
    )
    const top = Math.min(
      ...selectedShapes.map((shape) =>
        Math.min(shape.y ?? 0, (shape.y ?? 0) + (shape.height ?? 0)),
      ),
    )
    const dx = changes.x === undefined ? 0 : changes.x - left
    const dy = changes.y === undefined ? 0 : changes.y - top
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
                  shapes: (currentPage.shapes ?? []).map((shape) =>
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

  function selectShapes({
    shapeId,
    additive = false,
    preserveGroup = false,
  }: {
    shapeId: string | null
    additive?: boolean
    preserveGroup?: boolean
  }) {
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
    if (shapeId !== editingShapeId) {
      setEditingShapeId(null)
      setTextEditor(null)
    }
  }
}
