import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Circle,
  FileDown,
  Grid2x2,
  Grid2x2Check,
  Italic,
  Layers3,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Plus,
  Save,
  Shapes,
  Spline,
  Square,
  Strikethrough,
  Type,
  Underline,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../lib/cn'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export type ExportStatus = 'idle' | 'exporting' | 'error'

type Props = {
  documentTitle: string
  onRenameDocument: ({ name }: { name: string }) => Promise<void>
  zoom: number
  onZoomChange: (zoom: number) => void
  onSave: () => void
  saveStatus: SaveStatus
  onAddShape: (type: 'rect' | 'circle' | 'text' | 'line') => void
  onExportPdf: () => void
  exportStatus: ExportStatus
  layersOpen: boolean
  onToggleLayers: () => void
  snapToGrid: boolean
  onToggleSnapToGrid: () => void
}

type DocumentTitleControlProps = {
  title: string
  onRename: ({ name }: { name: string }) => Promise<void>
}

function DocumentTitleControl({ title, onRename }: DocumentTitleControlProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleMeasureRef = useRef<HTMLSpanElement>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collapsedWidth, setCollapsedWidth] = useState<number | null>(null)

  useLayoutEffect(() => {
    if (titleMeasureRef.current) {
      setCollapsedWidth(
        Math.min(176, Math.ceil(titleMeasureRef.current.getBoundingClientRect().width)),
      )
    }
  }, [title])

  useEffect(() => {
    if (!editing) {
      setDraft(title)
    }
  }, [editing, title])

  useEffect(() => {
    if (!editing) {
      return
    }
    const dismissOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node) && !saving) {
        setDraft(title)
        setError(null)
        setEditing(false)
      }
    }
    document.addEventListener('pointerdown', dismissOnOutsidePointer, true)
    return () => document.removeEventListener('pointerdown', dismissOnOutsidePointer, true)
  }, [editing, saving, title])

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 transition-[width] duration-200 ease-out motion-reduce:transition-none"
      style={{
        width: editing ? '11rem' : collapsedWidth === null ? 'fit-content' : collapsedWidth,
      }}
    >
      <span
        ref={titleMeasureRef}
        className="pointer-events-none absolute invisible whitespace-nowrap px-2 text-sm font-medium"
        aria-hidden="true"
      >
        {title}
      </span>
      {editing ? (
        <input
          className={cn(
            'h-8 w-full rounded-md border bg-white px-2 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-900 dark:text-gray-100',
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700',
          )}
          value={draft}
          aria-label="Document title"
          aria-invalid={Boolean(error)}
          title={error ?? 'Press Enter to save'}
          autoFocus
          disabled={saving}
          onChange={(event) => {
            setDraft(event.target.value)
            setError(null)
          }}
          onBlur={cancelEditing}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              void submitTitle()
            }
            if (event.key === 'Escape') {
              cancelEditing()
            }
          }}
        />
      ) : (
        <button
          className="h-8 w-full truncate rounded-md px-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:text-gray-200 dark:hover:bg-gray-800"
          type="button"
          title={`Rename ${title}`}
          onClick={() => setEditing(true)}
        >
          {title}
        </button>
      )}
    </div>
  )

  async function submitTitle() {
    const name = draft.trim()
    if (name.length < 2) {
      setError('Use at least 2 characters')
      return
    }
    if (name === title) {
      setEditing(false)
      return
    }

    setSaving(true)
    try {
      await onRename({ name })
      setEditing(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to rename document')
    } finally {
      setSaving(false)
    }
  }

  function cancelEditing() {
    if (saving) {
      return
    }
    setDraft(title)
    setError(null)
    setEditing(false)
  }
}

const zoomOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]
const minZoom = zoomOptions[0]
const maxZoom = zoomOptions[zoomOptions.length - 1]
const palette = [
  '#ffffff',
  '#d1d5db',
  '#6b7280',
  '#111827',
  '#000000',
  '#ef4444',
  '#f97316',
  '#fbbf24',
  '#facc15',
  '#a3e635',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#22d3ee',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
]

function normalizedHex(value: string) {
  const trimmed = value.trim()
  if (/^#[\da-f]{6}$/i.test(trimmed)) {
    return trimmed.toLowerCase()
  }
  if (/^#[\da-f]{3}$/i.test(trimmed)) {
    return `#${trimmed
      .slice(1)
      .split('')
      .map((character) => character.repeat(2))
      .join('')}`.toLowerCase()
  }
  return null
}

type ColorControlProps = {
  label: string
  icon: LucideIcon
  color?: string
  disabled: boolean
  panel?: boolean
  panelSide?: 'left' | 'right'
  onChange: (color: string) => void
}

export function ColorControl({
  label,
  icon: Icon,
  color,
  disabled,
  panel = false,
  panelSide = 'left',
  onChange,
}: ColorControlProps) {
  const [open, setOpen] = useState(false)
  const [hex, setHex] = useState(normalizedHex(color ?? '') ?? '')
  const containerRef = useRef<HTMLDivElement>(null)
  const validHex = normalizedHex(hex)

  useEffect(() => setHex(normalizedHex(color ?? '') ?? ''), [color])
  useEffect(() => {
    if (!open) {
      return
    }
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
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
      {panel && (
        <span className="block text-[11px] font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
      )}
      <button
        className={cn(
          'relative rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-35 dark:text-gray-300 dark:hover:bg-gray-800',
          panel
            ? 'mt-1 flex h-8 w-full items-center gap-2 border border-gray-300 bg-white p-2 dark:border-gray-700 dark:bg-gray-950'
            : 'grid size-8 place-items-center',
        )}
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon className="size-4" aria-hidden="true" />
        <span
          className={cn(
            'relative overflow-hidden rounded-full border border-black/20',
            panel ? 'h-4 min-w-0 flex-1 rounded-sm' : 'absolute bottom-0.5 left-1 right-1 h-1',
            color === 'none' && 'bg-white',
          )}
          style={{ background: color === 'none' ? undefined : color }}
          aria-hidden="true"
        >
          {color === 'none' && (
            <span className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-12 bg-red-500" />
          )}
        </span>
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-40 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900',
            panel ? 'top-14 w-[calc(200%+0.5rem)]' : 'left-0 top-10 w-64',
            panel && panelSide === 'left' && 'left-0',
            panel && panelSide === 'right' && 'right-0',
          )}
        >
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
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            type="button"
            onClick={() => {
              onChange('none')
              setOpen(false)
            }}
          >
            <span
              className="relative size-4 overflow-hidden rounded border border-gray-300 bg-white"
              aria-hidden="true"
            >
              <span className="absolute left-1/2 top-1/2 h-0.5 w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-red-500" />
            </span>
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
                if (normalized) {
                  onChange(normalized)
                }
              }}
            />
          </label>
          {hex && !validHex && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Use #RGB or #RRGGBB.</p>
          )}
        </div>
      )}
    </div>
  )
}

function AddShapeControl({
  onAddShape,
}: {
  onAddShape: (type: 'rect' | 'circle' | 'text' | 'line') => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
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

function TextFormatButton({
  label,
  icon: Icon,
  active = false,
  disabled = false,
  onClick,
}: {
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

export function TextFormattingControls({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current
        ? {
            bold: current.isActive('bold'),
            italic: current.isActive('italic'),
            underline: current.isActive('underline'),
            strike: current.isActive('strike'),
            bulletList: current.isActive('bulletList'),
            orderedList: current.isActive('orderedList'),
            alignment:
              ['center', 'right', 'justify'].find((alignment) =>
                current.isActive({ textAlign: alignment }),
              ) ?? 'left',
            color: current.getAttributes('textStyle').color as string | undefined,
            fontSize: current.getAttributes('textStyle').fontSize as string | undefined,
          }
        : null,
  })
  const disabled = !editor
  const currentPoints = state?.fontSize
    ? Math.round((Number.parseFloat(state.fontSize) * 72) / 96)
    : 12
  const run = (command: (editor: Editor) => void) => {
    if (editor) {
      command(editor)
    }
  }

  return (
    <>
      <div className="w-full">
        <select
          className="h-8 w-full rounded-md bg-gray-100 px-2 text-sm font-medium outline-none disabled:opacity-35 dark:bg-gray-800"
          aria-label="Font size"
          title="Font size"
          disabled={disabled}
          value={fontSizes.includes(currentPoints) ? currentPoints : 12}
          onChange={(event) =>
            run((current) =>
              current
                .chain()
                .focus()
                .setFontSize(`${(Number(event.target.value) * 96) / 72}px`)
                .run(),
            )
          }
        >
          {fontSizes.map((points) => (
            <option key={points} value={points}>
              {points} pt
            </option>
          ))}
        </select>
      </div>
      <TextFormatButton
        label="Bold"
        icon={Bold}
        active={state?.bold}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().toggleBold().run())}
      />
      <TextFormatButton
        label="Italic"
        icon={Italic}
        active={state?.italic}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().toggleItalic().run())}
      />
      <TextFormatButton
        label="Underline"
        icon={Underline}
        active={state?.underline}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().toggleUnderline().run())}
      />
      <TextFormatButton
        label="Strikethrough"
        icon={Strikethrough}
        active={state?.strike}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().toggleStrike().run())}
      />
      <ColorControl
        label="Text color"
        icon={Type}
        color={state?.color ?? '#111827'}
        disabled={disabled}
        onChange={(color) =>
          run((current) =>
            color === 'none'
              ? current.chain().focus().unsetColor().run()
              : current.chain().focus().setColor(color).run(),
          )
        }
      />
      <TextFormatButton
        label="Align left"
        icon={AlignLeft}
        active={state?.alignment === 'left'}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().setTextAlign('left').run())}
      />
      <TextFormatButton
        label="Align center"
        icon={AlignCenter}
        active={state?.alignment === 'center'}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().setTextAlign('center').run())}
      />
      <TextFormatButton
        label="Align right"
        icon={AlignRight}
        active={state?.alignment === 'right'}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().setTextAlign('right').run())}
      />
      <TextFormatButton
        label="Justify"
        icon={AlignJustify}
        active={state?.alignment === 'justify'}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().setTextAlign('justify').run())}
      />
      <TextFormatButton
        label="Bulleted list"
        icon={List}
        active={state?.bulletList}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().toggleBulletList().run())}
      />
      <TextFormatButton
        label="Numbered list"
        icon={ListOrdered}
        active={state?.orderedList}
        disabled={disabled}
        onClick={() => run((current) => current.chain().focus().toggleOrderedList().run())}
      />
    </>
  )
}

export function EditorToolbar({
  documentTitle,
  onRenameDocument,
  zoom,
  onZoomChange,
  onSave,
  saveStatus,
  onAddShape,
  onExportPdf,
  exportStatus,
  layersOpen,
  onToggleLayers,
  snapToGrid,
  onToggleSnapToGrid,
}: Props) {
  const zoomBy = (amount: number) => {
    onZoomChange(Math.min(maxZoom, Math.max(minZoom, Number((zoom + amount).toFixed(2)))))
  }

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-1"
      role="toolbar"
      aria-label="Document controls"
    >
      <DocumentTitleControl title={documentTitle} onRename={onRenameDocument} />
      <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
      <button
        className={cn(
          'grid size-8 place-items-center rounded-md transition hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 dark:hover:bg-gray-800',
          saveStatus === 'saved' && 'text-green-600 dark:text-green-400',
          saveStatus === 'error' && 'text-red-600 dark:text-red-400',
        )}
        type="button"
        onClick={onSave}
        disabled={saveStatus === 'saving'}
        aria-label={
          saveStatus === 'saving'
            ? 'Saving document'
            : saveStatus === 'saved'
              ? 'Document saved'
              : saveStatus === 'error'
                ? 'Document not saved'
                : 'Save document'
        }
        title={
          saveStatus === 'saving'
            ? 'Saving document'
            : saveStatus === 'saved'
              ? 'Document saved'
              : saveStatus === 'error'
                ? 'Document not saved'
                : 'Save document'
        }
      >
        {saveStatus === 'saving' ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-4" aria-hidden="true" />
        )}
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
          {snapToGrid ? (
            <Grid2x2Check className="size-4" aria-hidden="true" />
          ) : (
            <Grid2x2 className="size-4" aria-hidden="true" />
          )}
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
          {zoomOptions.map((option) => (
            <option key={option} value={option}>
              {Math.round(option * 100)}%
            </option>
          ))}
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
        <div className="ml-1 h-6 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
      </div>
    </div>
  )
}
