import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Circle, FileDown, Italic, Layers3, List, ListOrdered, Magnet, Minus, PaintBucket, PenLine, Plus, RotateCw, Save, Shapes, Spline, Square, SquareRoundCorner, Strikethrough, Type, Underline, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import type { ShapeInput, ShapeResponse } from '../types'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export type ExportStatus = 'idle' | 'exporting' | 'error'

type Props = {
  zoom: number
  onZoomChange: (zoom: number) => void
  onSave: () => void
  saveStatus: SaveStatus
  selectedShape: ShapeResponse | null
  onShapeChange: (changes: Partial<ShapeInput>) => void
  onAddShape: (type: 'rect' | 'circle' | 'text' | 'line') => void
  onExportPdf: () => void
  exportStatus: ExportStatus
  textEditor: Editor | null
  layersOpen: boolean
  onToggleLayers: () => void
  snapToGrid: boolean
  onToggleSnapToGrid: () => void
}

const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]
const minZoom = zoomOptions[0]
const maxZoom = zoomOptions[zoomOptions.length - 1]
const palette = [
  '#ffffff', '#d1d5db', '#6b7280', '#111827', '#000000',
  '#ef4444', '#f97316', '#fbbf24', '#facc15', '#a3e635',
  '#22c55e', '#10b981', '#14b8a6', '#22d3ee', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899',
]

function normalizedHex(value: string) {
  const trimmed = value.trim()
  if (/^#[\da-f]{6}$/i.test(trimmed)) return trimmed.toLowerCase()
  if (/^#[\da-f]{3}$/i.test(trimmed)) {
    return `#${trimmed.slice(1).split('').map((character) => character.repeat(2)).join('')}`.toLowerCase()
  }
  return null
}

type ColorControlProps = {
  label: string
  icon: LucideIcon
  color?: string
  disabled: boolean
  onChange: (color: string) => void
}

function ColorControl({ label, icon: Icon, color, disabled, onChange }: ColorControlProps) {
  const [open, setOpen] = useState(false)
  const [hex, setHex] = useState(normalizedHex(color ?? '') ?? '')
  const containerRef = useRef<HTMLDivElement>(null)
  const validHex = normalizedHex(hex)

  useEffect(() => setHex(normalizedHex(color ?? '') ?? ''), [color])
  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="relative grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-35 dark:text-gray-300 dark:hover:bg-gray-800"
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon className="size-4" aria-hidden="true" />
        <span className="absolute bottom-0.5 left-1 right-1 h-1 rounded-full border border-black/20" style={{ background: color === 'none' ? 'transparent' : color }} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-40 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-5 gap-1.5">
            {palette.map((swatch) => (
              <button
                key={swatch}
                className={cn(
                  'aspect-square rounded-md border shadow-sm transition hover:scale-105',
                  color?.toLowerCase() === swatch
                    ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-gray-900'
                    : 'border-black/15',
                )}
                style={{ backgroundColor: swatch }}
                type="button"
                aria-label={`${label} ${swatch}`}
                onClick={() => {
                  onChange(swatch)
                  setOpen(false)
                }}
              />
            ))}
          </div>
          <button
            className="mt-3 w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            type="button"
            onClick={() => {
              onChange('none')
              setOpen(false)
            }}
          >
            No color
          </button>
          <label className="mt-3 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Hex color
            <input
              className={cn(
                'mt-1 h-9 w-full rounded-md border bg-white px-2 font-mono text-sm text-gray-900 outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-950 dark:text-gray-100',
                hex && !validHex ? 'border-red-500' : 'border-gray-300 dark:border-gray-700',
              )}
              value={hex}
              placeholder="#8b5cf6"
              spellCheck={false}
              onChange={(event) => {
                const value = event.target.value
                setHex(value)
                const normalized = normalizedHex(value)
                if (normalized) onChange(normalized)
              }}
            />
          </label>
          {hex && !validHex && <p className="mt-1 text-xs text-red-600 dark:text-red-400">Use #RGB or #RRGGBB.</p>}
        </div>
      )}
    </div>
  )
}

const radiusFields: Array<{ key: 'radiusTopLeft' | 'radiusTopRight' | 'radiusBottomRight' | 'radiusBottomLeft'; label: string }> = [
  { key: 'radiusTopLeft', label: 'Top left' },
  { key: 'radiusTopRight', label: 'Top right' },
  { key: 'radiusBottomRight', label: 'Bottom right' },
  { key: 'radiusBottomLeft', label: 'Bottom left' },
]
const pointsToPixels = (points?: number) => (points ?? 0) * 96 / 72
const pixelsToPoints = (pixels: number) => pixels * 72 / 96

type CornerControlProps = {
  shape: ShapeResponse | null
  onChange: (changes: Partial<ShapeInput>) => void
}

function CornerControl({ shape, onChange }: CornerControlProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const disabled = !shape || shape.type !== 'rect'
  const pixelRadii = radiusFields.map(({ key }) => pointsToPixels(shape?.[key]))
  const unifiedRadius = pixelRadii.every((radius) => Math.abs(radius - pixelRadii[0]) < 0.001) ? pixelRadii[0] : null

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const radiusValue = (value: string) => {
    const pixels = Number(value)
    return Number.isFinite(pixels) ? pixelsToPoints(Math.max(0, pixels)) : null
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-35 dark:text-gray-300 dark:hover:bg-gray-800"
        type="button"
        aria-label="Corner radii"
        title="Corner radii"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        <SquareRoundCorner className="size-4" aria-hidden="true" />
      </button>
      {open && !disabled && (
        <div className="absolute left-0 top-10 z-40 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
            All corners
            <span className="mt-1 flex h-9 items-center rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950">
              <input
                className="min-w-0 flex-1 bg-transparent px-2 text-right text-sm font-medium outline-none"
                type="number"
                min="0"
                step="1"
                placeholder="Mixed"
                value={unifiedRadius === null ? '' : Math.round(unifiedRadius * 100) / 100}
                onChange={(event) => {
                  const radius = radiusValue(event.target.value)
                  if (radius !== null) onChange(Object.fromEntries(radiusFields.map(({ key }) => [key, radius])))
                }}
              />
              <span className="pr-2 text-xs text-gray-400">px</span>
            </span>
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
            {radiusFields.map(({ key, label }, index) => (
              <label key={key} className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {label}
                <span className="mt-1 flex h-9 items-center rounded-md border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950">
                  <input
                    className="min-w-0 flex-1 bg-transparent px-2 text-right text-sm font-medium outline-none"
                    type="number"
                    min="0"
                    step="1"
                    value={Math.round(pixelRadii[index] * 100) / 100}
                    onChange={(event) => {
                      const radius = radiusValue(event.target.value)
                      if (radius !== null) onChange({ [key]: radius })
                    }}
                  />
                  <span className="pr-2 text-xs text-gray-400">px</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AddShapeControl({ onAddShape }: { onAddShape: (type: 'rect' | 'circle' | 'text' | 'line') => void }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const options = [
    { type: 'rect' as const, label: 'Rectangle', icon: Square },
    { type: 'circle' as const, label: 'Circle', icon: Circle },
    { type: 'text' as const, label: 'Text', icon: Type },
    { type: 'line' as const, label: 'Line', icon: Spline },
  ]

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        type="button"
        aria-label="Add shape"
        title="Add shape"
        onClick={() => setOpen((value) => !value)}
      >
        <Shapes className="size-4" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-0 top-10 z-40 grid w-52 grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {options.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg bg-gray-100 text-xs font-medium text-gray-700 hover:bg-violet-100 hover:text-violet-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-violet-950 dark:hover:text-violet-300"
              type="button"
              onClick={() => {
                onAddShape(type)
                setOpen(false)
              }}
            >
              <Icon className="size-7" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const fontSizes = [8, 9, 10, 11, 12, 14, 18, 24, 36, 48, 72]

function TextFormatButton({ label, icon: Icon, active = false, disabled = false, onClick }: {
  label: string
  icon: LucideIcon
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'grid size-8 place-items-center rounded-md disabled:opacity-35',
        active
          ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      )}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  )
}

function TextFormattingControls({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => current ? {
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      underline: current.isActive('underline'),
      strike: current.isActive('strike'),
      bulletList: current.isActive('bulletList'),
      orderedList: current.isActive('orderedList'),
      alignment: (['center', 'right', 'justify'].find((alignment) => current.isActive({ textAlign: alignment })) ?? 'left'),
      color: current.getAttributes('textStyle').color as string | undefined,
      fontSize: current.getAttributes('textStyle').fontSize as string | undefined,
    } : null,
  })
  const disabled = !editor
  const currentPoints = state?.fontSize ? Math.round(Number.parseFloat(state.fontSize) * 72 / 96) : 12
  const run = (command: (editor: Editor) => void) => {
    if (editor) command(editor)
  }

  return (
    <>
      <select
        className="h-8 rounded-md bg-gray-100 px-2 text-sm font-medium outline-none disabled:opacity-35 dark:bg-gray-800"
        aria-label="Font size"
        title="Font size"
        disabled={disabled}
        value={fontSizes.includes(currentPoints) ? currentPoints : 12}
        onChange={(event) => run((current) => current.chain().focus().setFontSize(`${Number(event.target.value) * 96 / 72}px`).run())}
      >
        {fontSizes.map((points) => <option key={points} value={points}>{points} pt</option>)}
      </select>
      <TextFormatButton label="Bold" icon={Bold} active={state?.bold} disabled={disabled} onClick={() => run((current) => current.chain().focus().toggleBold().run())} />
      <TextFormatButton label="Italic" icon={Italic} active={state?.italic} disabled={disabled} onClick={() => run((current) => current.chain().focus().toggleItalic().run())} />
      <TextFormatButton label="Underline" icon={Underline} active={state?.underline} disabled={disabled} onClick={() => run((current) => current.chain().focus().toggleUnderline().run())} />
      <TextFormatButton label="Strikethrough" icon={Strikethrough} active={state?.strike} disabled={disabled} onClick={() => run((current) => current.chain().focus().toggleStrike().run())} />
      <ColorControl
        label="Text color"
        icon={Type}
        color={state?.color ?? '#111827'}
        disabled={disabled}
        onChange={(color) => run((current) => color === 'none'
          ? current.chain().focus().unsetColor().run()
          : current.chain().focus().setColor(color).run())}
      />
      <TextFormatButton label="Align left" icon={AlignLeft} active={state?.alignment === 'left'} disabled={disabled} onClick={() => run((current) => current.chain().focus().setTextAlign('left').run())} />
      <TextFormatButton label="Align center" icon={AlignCenter} active={state?.alignment === 'center'} disabled={disabled} onClick={() => run((current) => current.chain().focus().setTextAlign('center').run())} />
      <TextFormatButton label="Align right" icon={AlignRight} active={state?.alignment === 'right'} disabled={disabled} onClick={() => run((current) => current.chain().focus().setTextAlign('right').run())} />
      <TextFormatButton label="Justify" icon={AlignJustify} active={state?.alignment === 'justify'} disabled={disabled} onClick={() => run((current) => current.chain().focus().setTextAlign('justify').run())} />
      <TextFormatButton label="Bulleted list" icon={List} active={state?.bulletList} disabled={disabled} onClick={() => run((current) => current.chain().focus().toggleBulletList().run())} />
      <TextFormatButton label="Numbered list" icon={ListOrdered} active={state?.orderedList} disabled={disabled} onClick={() => run((current) => current.chain().focus().toggleOrderedList().run())} />
    </>
  )
}

export function EditorToolbar({ zoom, onZoomChange, onSave, saveStatus, selectedShape, onShapeChange, onAddShape, onExportPdf, exportStatus, textEditor, layersOpen, onToggleLayers, snapToGrid, onToggleSnapToGrid }: Props) {
  const zoomBy = (amount: number) => {
    onZoomChange(Math.min(maxZoom, Math.max(minZoom, Number((zoom + amount).toFixed(2)))))
  }

  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900" role="toolbar" aria-label="Document controls">
      <button
        className={cn(
          'grid size-8 place-items-center rounded-md transition hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-gray-800',
          saveStatus === 'error' && 'text-red-600 dark:text-red-400',
        )}
        type="button"
        onClick={onSave}
        disabled={saveStatus === 'saving'}
        aria-label="Save document"
        title="Save document"
      >
        <Save className="size-4" aria-hidden="true" />
      </button>
      <button
        className={cn(
          'grid size-8 place-items-center rounded-md transition hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-gray-800',
          exportStatus === 'error' && 'text-red-600 dark:text-red-400',
        )}
        type="button"
        onClick={onExportPdf}
        disabled={exportStatus === 'exporting'}
        aria-label="Export PDF"
        title="Export PDF"
      >
        <FileDown className="size-4" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
      <AddShapeControl onAddShape={onAddShape} />
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
      {selectedShape?.type === 'text' ? (
        <TextFormattingControls editor={textEditor} />
      ) : (
        <>
          {selectedShape?.type !== 'line' && (
            <ColorControl
              label="Fill color"
              icon={PaintBucket}
              color={selectedShape?.fill}
              disabled={!selectedShape}
              onChange={(fill) => onShapeChange({ fill })}
            />
          )}
          <ColorControl
            label="Stroke color"
            icon={PenLine}
            color={selectedShape?.stroke}
            disabled={!selectedShape}
            onChange={(stroke) => onShapeChange({ stroke })}
          />
          {selectedShape?.type !== 'line' && <CornerControl shape={selectedShape} onChange={onShapeChange} />}
          <label className={cn('flex h-8 items-center rounded-md bg-gray-100 pl-2 text-sm dark:bg-gray-800', !selectedShape && 'opacity-35')} title="Stroke thickness">
            <input
              className="w-12 bg-transparent text-right font-medium outline-none"
              type="number"
              min="0"
              max="100"
              step="1"
              aria-label="Stroke thickness in pixels"
              disabled={!selectedShape}
              value={Math.round((selectedShape?.strokeWidth ?? 0) * 96 / 72)}
              onChange={(event) => {
                const pixels = Math.min(100, Math.max(0, Number(event.target.value)))
                if (Number.isFinite(pixels)) onShapeChange({ strokeWidth: pixels * 72 / 96 })
              }}
            />
            <span className="px-2 text-xs text-gray-500 dark:text-gray-400">px</span>
          </label>
        </>
      )}
      {selectedShape?.type !== 'line' && <label className={cn('flex h-8 items-center rounded-md bg-gray-100 pl-2 text-sm dark:bg-gray-800', !selectedShape && 'opacity-35')} title="Rotation in degrees">
        <RotateCw className="size-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        <input
          className="w-16 bg-transparent text-right font-medium outline-none"
          type="number"
          step="1"
          aria-label="Rotation in degrees"
          disabled={!selectedShape}
          value={Math.round(selectedShape?.rotation ?? 0)}
          onChange={(event) => {
            const degrees = Number(event.target.value)
            if (Number.isFinite(degrees)) onShapeChange({ rotation: ((Math.round(degrees) % 360) + 360) % 360 })
          }}
        />
        <span className="px-2 text-xs text-gray-500 dark:text-gray-400">°</span>
      </label>}

      <div className="ml-auto flex items-center gap-1">
        <button
          className={cn(
            'grid size-8 place-items-center rounded-md',
            snapToGrid
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          )}
          type="button"
          aria-label={snapToGrid ? 'Disable snap to grid' : 'Enable snap to grid'}
          title={`${snapToGrid ? 'Disable' : 'Enable'} snap to ¼-inch grid`}
          aria-pressed={snapToGrid}
          onClick={onToggleSnapToGrid}
        >
          <Magnet className="size-4" aria-hidden="true" />
        </button>
        <button
          className={cn(
            'grid size-8 place-items-center rounded-md',
            layersOpen
              ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          )}
          type="button"
          aria-label={layersOpen ? 'Close layers panel' : 'Open layers panel'}
          title={layersOpen ? 'Close layers panel' : 'Open layers panel'}
          aria-pressed={layersOpen}
          onClick={onToggleLayers}
        >
          <Layers3 className="size-4" aria-hidden="true" />
        </button>
        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Zoom out"
          title="Zoom out"
          onClick={() => zoomBy(-0.25)}
          disabled={zoom <= minZoom}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <select
          className="h-8 rounded-md bg-gray-100 px-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:bg-gray-800"
          aria-label="Zoom level"
          value={zoom}
          onChange={(event) => onZoomChange(Number(event.target.value))}
        >
          {zoomOptions.map((option) => <option key={option} value={option}>{Math.round(option * 100)}%</option>)}
        </select>
        <button
          className="grid size-8 place-items-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
          type="button"
          aria-label="Zoom in"
          title="Zoom in"
          onClick={() => zoomBy(0.25)}
          disabled={zoom >= maxZoom}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
