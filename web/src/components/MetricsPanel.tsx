import type { Editor } from '@tiptap/core'
import { Link2, Unlink2 } from 'lucide-react'
import { PaintBucket, PenLine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import type { ShapeInput, ShapeResponse } from '../types'
import { ColorControl, TextFormattingControls } from './EditorToolbar'

type Props = {
  shapes: ShapeResponse[]
  textEditor: Editor | null
  onChange: ({ changes }: { changes: Partial<ShapeInput> }) => void
}

type MetricInputProps = {
  label?: string
  ariaLabel?: string
  subtleLabel?: boolean
  value: number | null
  unit: 'in' | 'px' | '°'
  min?: number
  step?: number
  decimals?: number
  placeholder?: string
  onCommit: ({ value }: { value: number }) => void
}

const displayedValue = ({ value, decimals }: { value: number | null; decimals: number }) =>
  value === null ? '' : value.toFixed(decimals)

function MetricInput({
  label,
  ariaLabel,
  subtleLabel = false,
  value,
  unit,
  min,
  step = 0.25,
  decimals = 2,
  placeholder,
  onCommit,
}: MetricInputProps) {
  const [draft, setDraft] = useState(displayedValue({ value, decimals }))

  useEffect(() => setDraft(displayedValue({ value, decimals })), [value, decimals])

  const commit = () => {
    if (draft.trim() === '') {
      setDraft(displayedValue({ value, decimals }))
      return
    }
    const parsed = Number(draft)
    if (!Number.isFinite(parsed)) {
      setDraft(displayedValue({ value, decimals }))
      return
    }
    const constrainedValue = min === undefined ? parsed : Math.max(min, parsed)
    const nextValue = Number(constrainedValue.toFixed(decimals))
    setDraft(displayedValue({ value: nextValue, decimals }))
    onCommit({ value: nextValue })
  }

  return (
    <label
      className={cn(
        'block text-[11px] font-medium',
        subtleLabel ? 'text-gray-500 dark:text-gray-400' : 'text-gray-600 dark:text-gray-300',
      )}
    >
      {label && <span>{label}</span>}
      <span
        className={cn(
          'flex h-8 items-center rounded-md border border-gray-300 bg-white focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 dark:border-gray-700 dark:bg-gray-950',
          label && 'mt-1',
        )}
      >
        <input
          className="min-w-0 flex-1 bg-transparent px-2 text-right text-xs font-medium tabular-nums text-gray-900 outline-none dark:text-gray-100"
          type="number"
          aria-label={ariaLabel ?? label}
          value={draft}
          placeholder={placeholder}
          min={min}
          step={step}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commit()
              event.currentTarget.blur()
            }
            if (event.key === 'Escape') {
              setDraft(displayedValue({ value, decimals }))
              event.currentTarget.blur()
            }
          }}
        />
        <span className="pr-2 text-[10px] text-gray-400">{unit}</span>
      </span>
    </label>
  )
}

const groupPosition = ({ shapes }: { shapes: ShapeResponse[] }) => ({
  x: Math.min(
    ...shapes.map((shape) => Math.min(shape.x ?? 0, (shape.x ?? 0) + (shape.width ?? 0))),
  ),
  y: Math.min(
    ...shapes.map((shape) => Math.min(shape.y ?? 0, (shape.y ?? 0) + (shape.height ?? 0))),
  ),
})

export function PropertiesPanel({ shapes, textEditor, onChange }: Props) {
  const [cornersLinked, setCornersLinked] = useState(true)
  const shape = shapes.length === 1 ? shapes[0] : undefined
  const position = shape
    ? { x: shape.x ?? 0, y: shape.y ?? 0 }
    : shapes.length > 0
      ? groupPosition({ shapes })
      : undefined
  const rotation =
    shape?.type === 'line'
      ? ((Math.round((Math.atan2(shape.height ?? 0, shape.width ?? 0) * 180) / Math.PI) % 360) +
          360) %
        360
      : (shape?.rotation ?? 0)
  const borderThickness = ((shape?.strokeWidth ?? 0) * 96) / 72
  const cornerRadii = [
    shape?.radiusTopLeft ?? 0,
    shape?.radiusTopRight ?? 0,
    shape?.radiusBottomRight ?? 0,
    shape?.radiusBottomLeft ?? 0,
  ].map((radius) => (radius * 96) / 72)
  const unifiedCornerRadius = cornerRadii.every(
    (radius) => Math.abs(radius - cornerRadii[0]) < 0.001,
  )
    ? cornerRadii[0]
    : null

  useEffect(() => {
    if (shape?.id) {
      setCornersLinked(unifiedCornerRadius !== null)
    }
  }, [shape?.id, unifiedCornerRadius])

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col" aria-label="Properties panel">
      <div className="flex h-7 shrink-0 items-center gap-2 border-b border-gray-300 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Properties</h2>
        {shapes.length > 1 && (
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {shapes.length} selected
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!position && (
          <p className="py-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Nothing selected
          </p>
        )}
        {position && (
          <>
            {shape && (
              <div className="mb-3 flex flex-wrap items-center gap-1 border-b border-gray-200 pb-3 dark:border-gray-700">
                {shape.type === 'text' ? (
                  <TextFormattingControls editor={textEditor} />
                ) : (
                  <div className="grid w-full grid-cols-2 gap-2">
                    {shape.type !== 'line' && (
                      <ColorControl
                        label="Fill"
                        icon={PaintBucket}
                        color={shape.fill}
                        disabled={false}
                        panel
                        panelSide="left"
                        onChange={(fill) => onChange({ changes: { fill } })}
                      />
                    )}
                    <ColorControl
                      label="Border"
                      icon={PenLine}
                      color={shape.stroke}
                      disabled={false}
                      panel
                      panelSide={shape.type === 'line' ? 'left' : 'right'}
                      onChange={(border) => onChange({ changes: { stroke: border } })}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <MetricInput
                label="X"
                value={position.x}
                unit="in"
                onCommit={({ value }) => onChange({ changes: { x: value } })}
              />
              <MetricInput
                label="Y"
                value={position.y}
                unit="in"
                onCommit={({ value }) => onChange({ changes: { y: value } })}
              />
              {shape && (
                <>
                  <MetricInput
                    label="Width"
                    value={shape.width ?? 0}
                    unit="in"
                    min={shape.type === 'line' ? undefined : 0.05}
                    onCommit={({ value }) => onChange({ changes: { width: value } })}
                  />
                  <MetricInput
                    label="Height"
                    value={shape.height ?? 0}
                    unit="in"
                    min={shape.type === 'line' ? undefined : 0.05}
                    onCommit={({ value }) => onChange({ changes: { height: value } })}
                  />
                  <MetricInput
                    label="Rotation"
                    value={rotation}
                    unit="°"
                    step={1}
                    decimals={0}
                    onCommit={({ value }) =>
                      onChange({ changes: { rotation: ((Math.round(value) % 360) + 360) % 360 } })
                    }
                  />
                  {shape.type !== 'text' && (
                    <>
                      <div
                        className="col-span-2 h-px bg-gray-200 dark:bg-gray-700"
                        aria-hidden="true"
                      />
                      <MetricInput
                        label="Border width"
                        value={borderThickness}
                        unit="px"
                        min={0}
                        step={1}
                        decimals={0}
                        onCommit={({ value }) =>
                          onChange({ changes: { strokeWidth: (Math.min(100, value) * 72) / 96 } })
                        }
                      />
                      {shape.type === 'rect' && (
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                              Radius
                            </span>
                            <button
                              className="grid size-4 place-items-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                              type="button"
                              aria-label={
                                cornersLinked ? 'Edit corners separately' : 'Edit corners together'
                              }
                              title={
                                cornersLinked ? 'Edit corners separately' : 'Edit corners together'
                              }
                              aria-pressed={cornersLinked}
                              onClick={() => setCornersLinked((linked) => !linked)}
                            >
                              {cornersLinked ? (
                                <Link2 className="size-3" aria-hidden="true" />
                              ) : (
                                <Unlink2 className="size-3" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                          <div className="mt-1 grid grid-cols-2 gap-3">
                            {cornersLinked ? (
                              <MetricInput
                                ariaLabel="All corners radius"
                                value={unifiedCornerRadius}
                                unit="px"
                                min={0}
                                step={1}
                                decimals={0}
                                placeholder="Mixed"
                                onCommit={({ value }) => {
                                  const radius = (value * 72) / 96
                                  onChange({
                                    changes: {
                                      radiusTopLeft: radius,
                                      radiusTopRight: radius,
                                      radiusBottomRight: radius,
                                      radiusBottomLeft: radius,
                                    },
                                  })
                                }}
                              />
                            ) : (
                              <>
                                <MetricInput
                                  label="Top left"
                                  subtleLabel
                                  value={cornerRadii[0]}
                                  unit="px"
                                  min={0}
                                  step={1}
                                  decimals={0}
                                  onCommit={({ value }) =>
                                    onChange({ changes: { radiusTopLeft: (value * 72) / 96 } })
                                  }
                                />
                                <MetricInput
                                  label="Top right"
                                  subtleLabel
                                  value={cornerRadii[1]}
                                  unit="px"
                                  min={0}
                                  step={1}
                                  decimals={0}
                                  onCommit={({ value }) =>
                                    onChange({ changes: { radiusTopRight: (value * 72) / 96 } })
                                  }
                                />
                                <MetricInput
                                  label="Bottom left"
                                  subtleLabel
                                  value={cornerRadii[3]}
                                  unit="px"
                                  min={0}
                                  step={1}
                                  decimals={0}
                                  onCommit={({ value }) =>
                                    onChange({ changes: { radiusBottomLeft: (value * 72) / 96 } })
                                  }
                                />
                                <MetricInput
                                  label="Bottom right"
                                  subtleLabel
                                  value={cornerRadii[2]}
                                  unit="px"
                                  min={0}
                                  step={1}
                                  decimals={0}
                                  onCommit={({ value }) =>
                                    onChange({ changes: { radiusBottomRight: (value * 72) / 96 } })
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
