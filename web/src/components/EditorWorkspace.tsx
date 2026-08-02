import type { CanvasPage } from '../types'
import type { ElementPatch } from '../elements'
import type { Editor } from '@tiptap/core'
import { DocumentCanvas } from './DocumentCanvas'
import { EditorRulers, RULER_SIZE } from './EditorRulers'
import { RichTextEditor } from './RichTextShape'

type Props = {
  page: CanvasPage
  title: string
  zoom?: number
  selectedShapeId: string | null
  selectedShapeIds: string[]
  onSelectShape: ({
    shapeId,
    additive,
    preserveGroup,
  }: {
    shapeId: string | null
    additive?: boolean
    preserveGroup?: boolean
  }) => void
  onSelectShapes: ({ shapeIds }: { shapeIds: string[] }) => void
  onShapeChange: (shapeId: string, changes: ElementPatch) => void
  onInteractionStart: () => void
  onInteractionEnd: () => void
  editingShapeId: string | null
  onStartTextEditing: (shapeId: string) => void
  onFinishTextEditing: () => void
  onTextEditorChange: (editor: Editor | null) => void
  snapToGrid: boolean
}

const BASE_PIXELS_PER_INCH = 96

export function EditorWorkspace({
  page,
  title,
  zoom = 1,
  selectedShapeId,
  selectedShapeIds,
  onSelectShape,
  onSelectShapes,
  onShapeChange,
  onInteractionStart,
  onInteractionEnd,
  editingShapeId,
  onStartTextEditing,
  onFinishTextEditing,
  onTextEditorChange,
  snapToGrid,
}: Props) {
  const pixelsPerInch = BASE_PIXELS_PER_INCH * zoom
  const canvasWidth = (page.width ?? 8.5) * pixelsPerInch
  const canvasHeight = (page.height ?? 11) * pixelsPerInch
  const editingShape = (page.elements ?? []).find(
    (shape) => 'id' in shape && shape.id === editingShapeId,
  )

  return (
    <div
      className="min-h-0 flex-1 overflow-auto bg-gray-200 outline-none dark:bg-gray-950"
      tabIndex={0}
      aria-label={`${title} canvas workspace`}
    >
      <div
        className="grid min-h-full min-w-full w-max"
        style={{
          gridTemplateColumns: `${RULER_SIZE}px minmax(${canvasWidth}px, 1fr)`,
          gridTemplateRows: `${RULER_SIZE}px minmax(${canvasHeight}px, 1fr)`,
        }}
      >
        <EditorRulers page={page} pixelsPerInch={pixelsPerInch} />
        <div
          className="relative col-start-2 row-start-2 self-start justify-self-start bg-white shadow-xl ring-1 ring-black/10"
          style={{ width: canvasWidth, height: canvasHeight }}
        >
          <DocumentCanvas
            page={page}
            title={title}
            pixelsPerInch={pixelsPerInch}
            showGrid
            selectedShapeId={selectedShapeId}
            selectedShapeIds={selectedShapeIds}
            onSelectShape={onSelectShape}
            onSelectShapes={onSelectShapes}
            onShapeChange={onShapeChange}
            onInteractionStart={onInteractionStart}
            onInteractionEnd={onInteractionEnd}
            editingShapeId={editingShapeId}
            onStartTextEditing={onStartTextEditing}
            snapToGrid={snapToGrid}
            className="block bg-white"
          />
          {editingShape?.kind === 'text' && editingShapeId && (
            <div
              className="absolute overflow-hidden outline outline-2 outline-violet-500"
              style={{
                left: editingShape.x * pixelsPerInch,
                top: editingShape.y * pixelsPerInch,
                width: editingShape.data.size.width * pixelsPerInch,
                height: editingShape.data.size.height * pixelsPerInch,
                transform: `rotate(${editingShape.rotation}deg)`,
              }}
            >
              <RichTextEditor
                element={editingShape}
                scale={zoom}
                onChange={(changes) => onShapeChange(editingShapeId, changes)}
                onEditorChange={onTextEditorChange}
                onFinishEditing={onFinishTextEditing}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
