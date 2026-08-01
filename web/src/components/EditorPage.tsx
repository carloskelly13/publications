import type { Editor } from '@tiptap/core'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { csrfHeaders } from '../api'
import type { DocumentDraft, PublicationDocument, ShapeInput, ShapeResponse } from '../types'
import { DocumentCanvas } from './DocumentCanvas'
import { EditorToolbar, type ExportStatus, type SaveStatus } from './EditorToolbar'
import { EditorWorkspace } from './EditorWorkspace'
import { LayersPanel } from './LayersPanel'

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
  const [layersWidth, setLayersWidth] = useState(256)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const exportCanvasRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!documentId) {
      setState({ status: 'error', message: 'This document has no identifier.' })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    setSelectedShapeIds([])
    setEditingShapeId(null)
    setTextEditor(null)
    fetch(`/api/documents/${documentId}`, { credentials: 'include', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 404 ? 'Document not found.' : 'Unable to load this document.')
        setState({ status: 'loaded', document: (await response.json()) as PublicationDocument })
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setState({ status: 'error', message: reason instanceof Error ? reason.message : 'Unable to load this document.' })
      })
    return () => controller.abort()
  }, [documentId])

  const updateShape = ({ shapeId, changes }: { shapeId: string; changes: Partial<ShapeInput> }) => {
    setState((current) => {
      if (current.status !== 'loaded') return current
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: (current.document.pages ?? []).map((page) => ({
            ...page,
            shapes: (page.shapes ?? []).map((shape) => shape.id === shapeId ? { ...shape, ...changes } : shape),
          })),
        },
      }
    })
    setSaveStatus('idle')
  }

  const reorderLayers = ({ draggedShapeId, targetShapeId, position }: { draggedShapeId: string; targetShapeId: string; position: 'before' | 'after' }) => {
    setState((current) => {
      if (current.status !== 'loaded') return current
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) return current
      const layers = [...(firstPage.shapes ?? [])].sort((left, right) => (right.z ?? 0) - (left.z ?? 0))
      const sourceIndex = layers.findIndex(({ id }) => id === draggedShapeId)
      const targetIndex = layers.findIndex(({ id }) => id === targetShapeId)
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return current
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

  const moveLayer = ({ shapeId, direction }: { shapeId: string; direction: 'front' | 'up' | 'down' | 'back' }) => {
    if (state.status !== 'loaded') return
    const layers = [...(state.document.pages?.[0]?.shapes ?? [])].sort((left, right) => (right.z ?? 0) - (left.z ?? 0))
    const sourceIndex = layers.findIndex(({ id }) => id === shapeId)
    const targetIndex = direction === 'front'
      ? 0
      : direction === 'back'
        ? layers.length - 1
        : direction === 'up' ? sourceIndex - 1 : sourceIndex + 1
    const target = layers[targetIndex]
    if (sourceIndex >= 0 && target) reorderLayers({
      draggedShapeId: shapeId,
      targetShapeId: target.id,
      position: direction === 'front' || direction === 'up' ? 'before' : 'after',
    })
  }

  const duplicateLayer = ({ shapeId }: { shapeId: string }) => {
    const duplicateId = `draft-${crypto.randomUUID()}`
    setState((current) => {
      if (current.status !== 'loaded') return current
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) return current
      const shapes = firstPage.shapes ?? []
      const original = shapes.find(({ id }) => id === shapeId)
      if (!original) return current
      const duplicate: ShapeResponse = {
        ...structuredClone(original),
        id: duplicateId,
        x: (original.x ?? 0) + 0.25,
        y: (original.y ?? 0) + 0.25,
        z: Math.max(0, ...shapes.map(({ z }) => z ?? 0)) + 1,
      }
      return {
        status: 'loaded',
        document: { ...current.document, pages: [{ ...firstPage, shapes: [...shapes, duplicate] }, ...pages.slice(1)] },
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
      if (current.status !== 'loaded') return current
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) return current
      return {
        status: 'loaded',
        document: {
          ...current.document,
          pages: [{ ...firstPage, shapes: (firstPage.shapes ?? []).filter(({ id }) => !deleting.has(id)) }, ...pages.slice(1)],
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
      if (current.status !== 'loaded') return current
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) return current
      const size = type === 'circle'
        ? { width: 1.5, height: 1.5 }
        : type === 'text'
          ? { width: 4, height: 1.5 }
          : type === 'line' ? { width: 4, height: 0 } : { width: 2, height: 1.5 }
      const shapes = firstPage.shapes ?? []
      const shape: ShapeResponse = {
        id,
        type: type === 'circle' ? 'ellipse' : type,
        x: Math.max(0, ((firstPage.width ?? 8.5) - size.width) / 2),
        y: Math.max(0, ((firstPage.height ?? 11) - size.height) / 2),
        ...size,
        pathGeometry: type === 'line'
          ? { version: 1, commands: [{ type: 'move', x: 0, y: 0 }, { type: 'line', x: size.width, y: size.height }] }
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
        richTextContent: type === 'text' ? { type: 'doc', content: [{ type: 'paragraph' }] } : undefined,
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
    if (state.status !== 'loaded' || !documentId) return
    setSaveStatus('saving')
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(await csrfHeaders()) },
        body: JSON.stringify(documentDraft(state.document)),
      })
      if (!response.ok) throw new Error('Unable to save this document.')
      setState({ status: 'loaded', document: (await response.json()) as PublicationDocument })
      setSelectedShapeIds([])
      setEditingShapeId(null)
      setTextEditor(null)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }

  const exportPdf = async () => {
    if (state.status !== 'loaded' || !documentId || !exportCanvasRef.current) return
    const page = state.document.pages?.[0]
    if (!page) return
    setExportStatus('exporting')
    try {
      const svg = new XMLSerializer().serializeToString(exportCanvasRef.current)
      const response = await fetch(`/api/documents/${documentId}/pdf`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(await csrfHeaders()) },
        body: JSON.stringify({ svg, width: page.width ?? 8.5, height: page.height ?? 11 }),
      })
      if (!response.ok) throw new Error('Unable to export this PDF.')
      const url = URL.createObjectURL(await response.blob())
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
    return <div className="grid min-h-0 flex-1 place-items-center bg-gray-200 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-400">Loading document…</div>
  }

  const page = state.status === 'loaded' ? state.document.pages?.[0] : undefined
  if (state.status === 'error' || !page) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center bg-gray-100 px-6 text-center dark:bg-gray-950">
        <div>
          <h1 className="text-lg font-semibold">Unable to open the editor</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{state.status === 'error' ? state.message : 'This document has no page.'}</p>
          <Link className="mt-5 inline-block text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400" to="/">Back to documents</Link>
        </div>
      </div>
    )
  }

  const selectedShapeId = selectedShapeIds.at(-1) ?? null
  const selectedShape = selectedShapeIds.length === 1
    ? page.shapes?.find((shape) => shape.id === selectedShapeId) ?? null
    : null

  const selectShapes = ({ shapeId, additive = false, preserveGroup = false }: { shapeId: string | null; additive?: boolean; preserveGroup?: boolean }) => {
    setSelectedShapeIds((current) => {
      if (!shapeId) return []
      if (additive) {
        return current.includes(shapeId)
          ? current.filter((selectedId) => selectedId !== shapeId)
          : [...current, shapeId]
      }
      if (preserveGroup && current.length > 1 && current.includes(shapeId)) return current
      return [shapeId]
    })
    if (shapeId !== editingShapeId) {
      setEditingShapeId(null)
      setTextEditor(null)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        onSave={() => void save()}
        saveStatus={saveStatus}
        selectedShape={selectedShape}
        onShapeChange={(changes) => {
          if (selectedShapeIds.length === 1 && selectedShapeId) updateShape({ shapeId: selectedShapeId, changes })
        }}
        onAddShape={addShape}
        onExportPdf={() => void exportPdf()}
        exportStatus={exportStatus}
        textEditor={textEditor}
        layersOpen={layersOpen}
        onToggleLayers={() => setLayersOpen((open) => !open)}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid((enabled) => !enabled)}
      />
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
        {layersOpen && (
          <LayersPanel
            shapes={page.shapes ?? []}
            selectedShapeId={selectedShapeId}
            selectedShapeIds={selectedShapeIds}
            onSelect={selectShapes}
            onReorder={reorderLayers}
            onMove={moveLayer}
            onDuplicate={duplicateLayer}
            onDelete={deleteLayers}
            width={layersWidth}
            onResize={({ width }) => setLayersWidth(width)}
          />
        )}
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
  )
}
