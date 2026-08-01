import type { Editor } from '@tiptap/core'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { csrfHeaders } from '../api'
import type { DocumentDraft, PublicationDocument, ShapeInput, ShapeResponse } from '../types'
import { DocumentCanvas } from './DocumentCanvas'
import { EditorToolbar, type ExportStatus, type SaveStatus } from './EditorToolbar'
import { EditorWorkspace } from './EditorWorkspace'

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
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null)
  const [textEditor, setTextEditor] = useState<Editor | null>(null)
  const exportCanvasRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!documentId) {
      setState({ status: 'error', message: 'This document has no identifier.' })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    setSelectedShapeId(null)
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

  const updateShape = (shapeId: string, changes: Partial<ShapeInput>) => {
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

  const addShape = (type: 'rect' | 'circle' | 'text') => {
    const id = `draft-${crypto.randomUUID()}`
    setState((current) => {
      if (current.status !== 'loaded') return current
      const pages = current.document.pages ?? []
      const firstPage = pages[0]
      if (!firstPage) return current
      const size = type === 'circle'
        ? { width: 1.5, height: 1.5 }
        : type === 'text' ? { width: 4, height: 1.5 } : { width: 2, height: 1.5 }
      const shapes = firstPage.shapes ?? []
      const shape: ShapeResponse = {
        id,
        type: type === 'circle' ? 'ellipse' : type,
        x: Math.max(0, ((firstPage.width ?? 8.5) - size.width) / 2),
        y: Math.max(0, ((firstPage.height ?? 11) - size.height) / 2),
        ...size,
        z: Math.max(0, ...shapes.map((item) => item.z ?? 0)) + 1,
        radiusTopLeft: 0,
        radiusTopRight: 0,
        radiusBottomRight: 0,
        radiusBottomLeft: 0,
        rotation: 0,
        fill: type === 'text' ? 'none' : '#a78bfa',
        fillOpacity: 1,
        stroke: type === 'text' ? 'none' : '#7c3aed',
        strokeWidth: type === 'text' ? 0 : 1,
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
    setSelectedShapeId(id)
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
      setSelectedShapeId(null)
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

  const selectedShape = page.shapes?.find((shape) => shape.id === selectedShapeId) ?? null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        onSave={() => void save()}
        saveStatus={saveStatus}
        selectedShape={selectedShape}
        onShapeChange={(changes) => {
          if (selectedShapeId) updateShape(selectedShapeId, changes)
        }}
        onAddShape={addShape}
        onExportPdf={() => void exportPdf()}
        exportStatus={exportStatus}
        textEditor={textEditor}
      />
      <EditorWorkspace
        page={page}
        title={state.document.name ?? 'Untitled'}
        zoom={zoom}
        selectedShapeId={selectedShapeId}
        onSelectShape={(shapeId) => {
          setSelectedShapeId(shapeId)
          if (shapeId !== editingShapeId) {
            setEditingShapeId(null)
            setTextEditor(null)
          }
        }}
        onShapeChange={updateShape}
        editingShapeId={editingShapeId}
        onStartTextEditing={setEditingShapeId}
        onFinishTextEditing={() => {
          setEditingShapeId(null)
          setTextEditor(null)
        }}
        onTextEditorChange={setTextEditor}
      />
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
