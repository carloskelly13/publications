import type { Editor } from '@tiptap/core'
import { Link2, Unlink2 } from 'lucide-react'
import { PaintBucket, PenLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  onValueChange: ({ value }: { value: number }) => void
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
  onValueChange,
}: MetricInputProps) {
  const [draft, setDraft] = useState(displayedValue({ value, decimals }))
  const editingRef = useRef(false)
  const discardOnBlurRef = useRef(false)
  const valueOnFocusRef = useRef<number | null>(value)

  useEffect(() => {
    if (!editingRef.current) {
      setDraft(displayedValue({ value, decimals }))
    }
  }, [value, decimals])

  function applyDraft({ draftValue, finalize }: { draftValue: string; finalize: boolean }) {
    if (draftValue.trim() === '') {
      if (finalize) {
        setDraft(displayedValue({ value, decimals }))
      }
      return
    }
    const parsed = Number(draftValue)
    if (!Number.isFinite(parsed)) {
      if (finalize) {
        setDraft(displayedValue({ value, decimals }))
      }
      return
    }
    const constrainedValue = min === undefined ? parsed : Math.max(min, parsed)
    const nextValue = finalize ? Number(constrainedValue.toFixed(decimals)) : constrainedValue
    if (finalize) {
      setDraft(displayedValue({ value: nextValue, decimals }))
    }
    onValueChange({ value: nextValue })
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
          onFocus={() => {
            editingRef.current = true
            valueOnFocusRef.current = value
          }}
          onChange={(event) => {
            const draftValue = event.target.value
            setDraft(draftValue)
            applyDraft({ draftValue, finalize: false })
          }}
          onBlur={() => {
            editingRef.current = false
            if (discardOnBlurRef.current) {
              discardOnBlurRef.current = false
              return
            }
            applyDraft({ draftValue: draft, finalize: true })
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur()
            }
            if (event.key === 'Escape') {
              const originalValue = valueOnFocusRef.current
              discardOnBlurRef.current = true
              setDraft(displayedValue({ value: originalValue, decimals }))
              if (originalValue !== null) {
                onValueChange({ value: originalValue })
              }
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

type Point = { x: number; y: number }
type LinePoint = 'start' | 'end' | 'bend'
type Axis = 'x' | 'y'

function lineMetricPoints({ shape }: { shape: ShapeResponse }) {
  const origin = { x: shape.x ?? 0, y: shape.y ?? 0 }
  const commands = shape.pathGeometry?.commands ?? []
  const startCommand = commands[0]
  const endCommand = commands[1]
  const start = {
    x: origin.x + (startCommand?.x ?? 0),
    y: origin.y + (startCommand?.y ?? 0),
  }
  const end = {
    x: origin.x + (endCommand?.x ?? shape.width ?? 0),
    y: origin.y + (endCommand?.y ?? shape.height ?? 0),
  }
  const curved = endCommand?.type === 'quadratic'
  const bend = curved
    ? {
        x:
          origin.x +
          0.25 * (startCommand?.x ?? 0) +
          0.5 * endCommand.controlX +
          0.25 * endCommand.x,
        y:
          origin.y +
          0.25 * (startCommand?.y ?? 0) +
          0.5 * endCommand.controlY +
          0.25 * endCommand.y,
      }
    : midpoint({ start, end })
  return { start, end, bend, curved }
}

function midpoint({ start, end }: { start: Point; end: Point }) {
  return { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
}

function distanceToLine({ point, start, end }: { point: Point; start: Point; end: Point }) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const lengthSquared = dx * dx + dy * dy
  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y)
  }
  const ratio = Math.min(
    1,
    Math.max(0, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared),
  )
  return Math.hypot(point.x - (start.x + ratio * dx), point.y - (start.y + ratio * dy))
}

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
  const linePoints = shape?.type === 'line' ? lineMetricPoints({ shape }) : undefined

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
              {linePoints ? (
                <>
                  <MetricInput
                    label="Start X"
                    value={linePoints.start.x}
                    unit="in"
                    onValueChange={({ value }) =>
                      updateLinePoint({ point: 'start', axis: 'x', value })
                    }
                  />
                  <MetricInput
                    label="Start Y"
                    value={linePoints.start.y}
                    unit="in"
                    onValueChange={({ value }) =>
                      updateLinePoint({ point: 'start', axis: 'y', value })
                    }
                  />
                  <MetricInput
                    label="End X"
                    value={linePoints.end.x}
                    unit="in"
                    onValueChange={({ value }) =>
                      updateLinePoint({ point: 'end', axis: 'x', value })
                    }
                  />
                  <MetricInput
                    label="End Y"
                    value={linePoints.end.y}
                    unit="in"
                    onValueChange={({ value }) =>
                      updateLinePoint({ point: 'end', axis: 'y', value })
                    }
                  />
                  <MetricInput
                    label="Bend X"
                    value={linePoints.bend.x}
                    unit="in"
                    onValueChange={({ value }) =>
                      updateLinePoint({ point: 'bend', axis: 'x', value })
                    }
                  />
                  <MetricInput
                    label="Bend Y"
                    value={linePoints.bend.y}
                    unit="in"
                    onValueChange={({ value }) =>
                      updateLinePoint({ point: 'bend', axis: 'y', value })
                    }
                  />
                </>
              ) : (
                <>
                  <MetricInput
                    label="X"
                    value={position.x}
                    unit="in"
                    onValueChange={({ value }) => onChange({ changes: { x: value } })}
                  />
                  <MetricInput
                    label="Y"
                    value={position.y}
                    unit="in"
                    onValueChange={({ value }) => onChange({ changes: { y: value } })}
                  />
                </>
              )}
              {shape && (
                <>
                  {shape.type !== 'line' && (
                    <>
                      <MetricInput
                        label="Width"
                        value={shape.width ?? 0}
                        unit="in"
                        min={0.05}
                        onValueChange={({ value }) => onChange({ changes: { width: value } })}
                      />
                      <MetricInput
                        label="Height"
                        value={shape.height ?? 0}
                        unit="in"
                        min={0.05}
                        onValueChange={({ value }) => onChange({ changes: { height: value } })}
                      />
                      <MetricInput
                        label="Rotation"
                        value={rotation}
                        unit="°"
                        step={1}
                        decimals={0}
                        onValueChange={({ value }) =>
                          onChange({
                            changes: { rotation: ((Math.round(value) % 360) + 360) % 360 },
                          })
                        }
                      />
                    </>
                  )}
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
                        onValueChange={({ value }) =>
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
                                onValueChange={({ value }) => {
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
                                  onValueChange={({ value }) =>
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
                                  onValueChange={({ value }) =>
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
                                  onValueChange={({ value }) =>
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
                                  onValueChange={({ value }) =>
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

  function updateLinePoint({
    point,
    axis,
    value,
  }: {
    point: LinePoint
    axis: Axis
    value: number
  }) {
    if (!shape || !linePoints) {
      return
    }
    const start = { ...linePoints.start }
    const end = { ...linePoints.end }
    let bend = { ...linePoints.bend }
    const target = point === 'start' ? start : point === 'end' ? end : bend
    target[axis] = value

    if (!linePoints.curved && point !== 'bend') {
      bend = midpoint({ start, end })
    }
    const curved =
      point === 'bend' ? distanceToLine({ point: bend, start, end }) > 0.05 : linePoints.curved
    const relativeEnd = { x: end.x - start.x, y: end.y - start.y }
    const relativeBend = { x: bend.x - start.x, y: bend.y - start.y }
    onChange({
      changes: {
        x: start.x,
        y: start.y,
        width: relativeEnd.x,
        height: relativeEnd.y,
        rotation: 0,
        pathGeometry: {
          version: 1,
          commands: [
            { type: 'move', x: 0, y: 0 },
            curved
              ? {
                  type: 'quadratic',
                  controlX: 2 * relativeBend.x - 0.5 * relativeEnd.x,
                  controlY: 2 * relativeBend.y - 0.5 * relativeEnd.y,
                  x: relativeEnd.x,
                  y: relativeEnd.y,
                }
              : { type: 'line', x: relativeEnd.x, y: relativeEnd.y },
          ],
        },
      },
    })
  }
}
