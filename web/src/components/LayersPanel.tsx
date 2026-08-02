import {
  BringToFront,
  ArrowRight,
  Circle,
  Copy,
  GripVertical,
  ListChecks,
  ListX,
  MoveDown,
  MoveUp,
  SendToBack,
  Spline,
  Square,
  Star,
  Trash2,
  Type,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/cn'
import { elementLabel } from '../elements'
import type { ElementResponse } from '../types'

type LayerDirection = 'front' | 'up' | 'down' | 'back'
type DropPosition = 'before' | 'after'

type Props = {
  shapes: ElementResponse[]
  selectedShapeId: string | null
  selectedShapeIds: string[]
  onSelect: ({ shapeId, additive }: { shapeId: string; additive?: boolean }) => void
  onReorder: ({
    draggedShapeId,
    targetShapeId,
    position,
  }: {
    draggedShapeId: string
    targetShapeId: string
    position: DropPosition
  }) => void
  onMove: ({ shapeId, direction }: { shapeId: string; direction: LayerDirection }) => void
  onDuplicate: ({ shapeId }: { shapeId: string }) => void
  onDelete: ({ shapeIds }: { shapeIds: string[] }) => void
  onSelectionChange: ({ shapeIds }: { shapeIds: string[] }) => void
}

const layerName = ({ shape }: { shape: ElementResponse }) => elementLabel({ element: shape })

const LayerIcon = ({ shape }: { shape: ElementResponse }) => {
  if (shape.kind === 'shape' && shape.data.geometry.type === 'ellipse') {
    return <Circle className="size-4" aria-hidden="true" />
  }
  if (shape.kind === 'shape' && shape.data.geometry.type === 'star') {
    return <Star className="size-4" aria-hidden="true" />
  }
  if (shape.kind === 'shape' && shape.data.geometry.type === 'arrow') {
    return <ArrowRight className="size-4" aria-hidden="true" />
  }
  if (shape.kind === 'text') {
    return <Type className="size-4" aria-hidden="true" />
  }
  if (shape.kind === 'path') {
    return <Spline className="size-4" aria-hidden="true" />
  }
  return <Square className="size-4" aria-hidden="true" />
}

export function LayersPanel({
  shapes,
  selectedShapeId,
  selectedShapeIds,
  onSelect,
  onReorder,
  onMove,
  onDuplicate,
  onDelete,
  onSelectionChange,
}: Props) {
  const [draggedShapeId, setDraggedShapeId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ shapeId: string; position: DropPosition } | null>(
    null,
  )
  const layers = [...shapes].sort((left, right) => (right.z ?? 0) - (left.z ?? 0))
  const selectedIndex = layers.findIndex(({ id }) => id === selectedShapeId)
  const singleSelection = selectedShapeIds.length === 1

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Layers panel">
      <div className="flex h-7 shrink-0 items-center gap-2 border-b border-gray-300 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Layers</h2>
        {layers.length > 0 && (
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {layers.length}
          </span>
        )}
      </div>

      <div
        className="flex h-11 shrink-0 items-center justify-start gap-1 border-b border-gray-200 px-2 dark:border-gray-700"
        role="toolbar"
        aria-label="Selected layer controls"
      >
        {shapes.length > 0 && selectedShapeIds.length === shapes.length ? (
          <button
            className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            type="button"
            aria-label="Deselect all layers"
            title="Deselect all layers"
            onClick={() => onSelectionChange({ shapeIds: [] })}
          >
            <ListX className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-800"
            type="button"
            aria-label="Select all layers"
            title="Select all layers"
            disabled={shapes.length === 0}
            onClick={() => onSelectionChange({ shapeIds: shapes.map(({ id }) => id) })}
          >
            <ListChecks className="size-4" aria-hidden="true" />
          </button>
        )}
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Bring layer to front"
          title="Bring layer to front"
          disabled={!singleSelection || !selectedShapeId || selectedIndex <= 0}
          onClick={() =>
            selectedShapeId && onMove({ shapeId: selectedShapeId, direction: 'front' })
          }
        >
          <BringToFront className="size-4" aria-hidden="true" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Move layer forward"
          title="Move layer forward one position"
          disabled={!singleSelection || !selectedShapeId || selectedIndex <= 0}
          onClick={() => selectedShapeId && onMove({ shapeId: selectedShapeId, direction: 'up' })}
        >
          <MoveUp className="size-4" aria-hidden="true" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Move layer backward"
          title="Move layer backward one position"
          disabled={
            !singleSelection ||
            !selectedShapeId ||
            selectedIndex < 0 ||
            selectedIndex >= layers.length - 1
          }
          onClick={() => selectedShapeId && onMove({ shapeId: selectedShapeId, direction: 'down' })}
        >
          <MoveDown className="size-4" aria-hidden="true" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Send layer to back"
          title="Send layer to back"
          disabled={
            !singleSelection ||
            !selectedShapeId ||
            selectedIndex < 0 ||
            selectedIndex >= layers.length - 1
          }
          onClick={() => selectedShapeId && onMove({ shapeId: selectedShapeId, direction: 'back' })}
        >
          <SendToBack className="size-4" aria-hidden="true" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Duplicate layer"
          title="Duplicate layer"
          disabled={!singleSelection || !selectedShapeId}
          onClick={() => selectedShapeId && onDuplicate({ shapeId: selectedShapeId })}
        >
          <Copy className="size-4" aria-hidden="true" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:text-gray-300 dark:hover:bg-red-950 dark:hover:text-red-400"
          type="button"
          aria-label="Delete selected layers"
          title="Delete selected layers"
          disabled={selectedShapeIds.length === 0}
          onClick={() => onDelete({ shapeIds: selectedShapeIds })}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <ol className="min-h-0 flex-1 overflow-y-auto p-2" aria-label="Layers, front to back">
        {layers.length === 0 && (
          <li className="px-2 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
            No layers yet.
          </li>
        )}
        {layers.map((shape) => {
          const selected = selectedShapeIds.includes(shape.id)
          const isDropTarget = shape.id === dropTarget?.shapeId && shape.id !== draggedShapeId
          return (
            <li
              key={shape.id}
              className={cn(
                'relative mb-1 flex h-10 items-center rounded-md border transition',
                selected
                  ? 'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-200'
                  : 'border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                shape.id === draggedShapeId && 'opacity-40',
              )}
              draggable={singleSelection}
              onDragStart={(event) => {
                setDraggedShapeId(shape.id)
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', shape.id)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                const bounds = event.currentTarget.getBoundingClientRect()
                const position = event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after'
                setDropTarget({ shapeId: shape.id, position })
              }}
              onDragLeave={() => {
                if (dropTarget?.shapeId === shape.id) {
                  setDropTarget(null)
                }
              }}
              onDrop={(event) => {
                event.preventDefault()
                const sourceId = draggedShapeId ?? event.dataTransfer.getData('text/plain')
                if (sourceId && sourceId !== shape.id) {
                  onReorder({
                    draggedShapeId: sourceId,
                    targetShapeId: shape.id,
                    position: dropTarget?.position ?? 'before',
                  })
                }
                setDraggedShapeId(null)
                setDropTarget(null)
              }}
              onDragEnd={() => {
                setDraggedShapeId(null)
                setDropTarget(null)
              }}
            >
              {isDropTarget && (
                <span
                  className={cn(
                    'pointer-events-none absolute left-1 right-1 z-10 h-0.5 rounded-full bg-violet-500 shadow-[0_0_0_1px_rgba(255,255,255,0.8)]',
                    dropTarget?.position === 'before' ? '-top-[3px]' : '-bottom-[3px]',
                  )}
                  aria-hidden="true"
                />
              )}
              <GripVertical
                className="ml-1 size-4 shrink-0 cursor-grab text-gray-400 active:cursor-grabbing"
                aria-hidden="true"
              />
              <button
                className="flex min-w-0 flex-1 items-center gap-2 px-2 text-left text-sm"
                type="button"
                onClick={(event) =>
                  onSelect({
                    shapeId: shape.id,
                    additive: event.shiftKey || event.metaKey || event.ctrlKey,
                  })
                }
              >
                <span className="grid size-6 shrink-0 place-items-center rounded bg-white text-gray-500 shadow-sm ring-1 ring-black/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-white/10">
                  <LayerIcon shape={shape} />
                </span>
                <span className="truncate">{layerName({ shape })}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
