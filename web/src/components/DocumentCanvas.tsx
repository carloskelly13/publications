import { forwardRef, useId, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import type { CanvasPage, ShapeInput, ShapeResponse } from '../types'
import { RichTextShape } from './RichTextShape'

type Props = {
  page: CanvasPage
  title: string
  pixelsPerInch?: number
  showGrid?: boolean
  className?: string
  selectedShapeId?: string | null
  onSelectShape?: (shapeId: string | null) => void
  onShapeChange?: (shapeId: string, changes: Partial<ShapeInput>) => void
  editingShapeId?: string | null
  onStartTextEditing?: (shapeId: string) => void
}

type CanvasShape = ShapeInput | ShapeResponse

const number = (value: number | undefined, fallback = 0) => value ?? fallback
const shapeKey = (shape: CanvasShape, index: number) =>
  'id' in shape && typeof shape.id === 'string' ? shape.id : `${shape.type}-${index}`

function ShapeNode({ shape, hideText = false }: { shape: CanvasShape; hideText?: boolean }) {
  const x = number(shape.x)
  const y = number(shape.y)
  const width = number(shape.width)
  const height = number(shape.height)
  const common = {
    fill: shape.fill || 'none',
    fillOpacity: shape.fillOpacity ?? 1,
    stroke: shape.stroke || 'none',
    strokeOpacity: shape.strokeOpacity ?? 1,
    strokeWidth: (shape.strokeWidth ?? 0) / 72,
  }

  let node
  if (shape.type === 'ellipse') {
    node = (
      <ellipse
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
        {...common}
      />
    )
  } else if (shape.type === 'text') {
    node = hideText ? null : (
      <RichTextShape
        shape={shape}
      />
    )
  } else {
    const maximumRadius = Math.max(0, Math.min(width, height) / 2)
    const topLeft = Math.min(number(shape.radiusTopLeft) / 72, maximumRadius)
    const topRight = Math.min(number(shape.radiusTopRight) / 72, maximumRadius)
    const bottomRight = Math.min(number(shape.radiusBottomRight) / 72, maximumRadius)
    const bottomLeft = Math.min(number(shape.radiusBottomLeft) / 72, maximumRadius)
    const path = [
      `M ${x + topLeft} ${y}`,
      `H ${x + width - topRight}`,
      `Q ${x + width} ${y} ${x + width} ${y + topRight}`,
      `V ${y + height - bottomRight}`,
      `Q ${x + width} ${y + height} ${x + width - bottomRight} ${y + height}`,
      `H ${x + bottomLeft}`,
      `Q ${x} ${y + height} ${x} ${y + height - bottomLeft}`,
      `V ${y + topLeft}`,
      `Q ${x} ${y} ${x + topLeft} ${y}`,
      'Z',
    ].join(' ')
    node = (
      <path d={path} {...common} />
    )
  }

  const rotation = number(shape.rotation)
  return (
    <g transform={rotation ? `rotate(${rotation} ${x + width / 2} ${y + height / 2})` : undefined}>
      {node}
    </g>
  )
}

type Handle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se'
type Point = { x: number; y: number }
type ShapeBounds = { x: number; y: number; width: number; height: number; rotation: number }
type Interaction = {
  pointerId: number
  shapeId: string
  mode: 'move' | 'resize' | 'rotate'
  handle?: Handle
  start: Point
  initial: ShapeBounds
  startAngle?: number
}

const handles: Array<{ handle: Handle; x: number; y: number }> = [
  { handle: 'nw', x: 0, y: 0 },
  { handle: 'n', x: 0.5, y: 0 },
  { handle: 'ne', x: 1, y: 0 },
  { handle: 'w', x: 0, y: 0.5 },
  { handle: 'e', x: 1, y: 0.5 },
  { handle: 'sw', x: 0, y: 1 },
  { handle: 's', x: 0.5, y: 1 },
  { handle: 'se', x: 1, y: 1 },
]

const rounded = (value: number) => Number(value.toFixed(4))
const angleAt = (point: Point, center: Point) => Math.atan2(point.y - center.y, point.x - center.x) * 180 / Math.PI

function svgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const matrix = svg.getScreenCTM()
  if (!matrix) return { x: 0, y: 0 }
  const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
  return { x: point.x, y: point.y }
}

type FrameProps = {
  shape: CanvasShape
  pixelsPerInch: number
  onStart: (event: ReactPointerEvent<SVGElement>, mode: Interaction['mode'], handle?: Handle) => void
  onDoubleClick?: () => void
}

function SelectionFrame({ shape, pixelsPerInch, onStart, onDoubleClick }: FrameProps) {
  const x = number(shape.x)
  const y = number(shape.y)
  const width = number(shape.width)
  const height = number(shape.height)
  const rotation = number(shape.rotation)
  const handleSize = 9 / pixelsPerInch
  const halfHandle = handleSize / 2
  const rotateOffset = 25 / pixelsPerInch
  const strokeWidth = 1.5 / pixelsPerInch

  return (
    <g transform={rotation ? `rotate(${rotation} ${x + width / 2} ${y + height / 2})` : undefined}>
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y - rotateOffset}
        stroke="#8b5cf6"
        strokeWidth={strokeWidth}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke="#8b5cf6"
        strokeWidth={strokeWidth}
        className="cursor-move"
        onPointerDown={(event) => {
          if (onDoubleClick && event.detail === 2) {
            event.preventDefault()
            event.stopPropagation()
            onDoubleClick()
            return
          }
          onStart(event, 'move')
        }}
        onDoubleClick={(event) => {
          if (!onDoubleClick) return
          event.preventDefault()
          event.stopPropagation()
          onDoubleClick()
        }}
      />
      <circle
        cx={x + width / 2}
        cy={y - rotateOffset}
        r={halfHandle}
        fill="white"
        stroke="#8b5cf6"
        strokeWidth={strokeWidth}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={(event) => onStart(event, 'rotate')}
      />
      {handles.map(({ handle, x: xRatio, y: yRatio }) => (
        <rect
          key={handle}
          x={x + width * xRatio - halfHandle}
          y={y + height * yRatio - halfHandle}
          width={handleSize}
          height={handleSize}
          rx={1.5 / pixelsPerInch}
          fill="#8b5cf6"
          stroke="white"
          strokeWidth={strokeWidth}
          style={{ cursor: `${handle}-resize` }}
          onPointerDown={(event) => onStart(event, 'resize', handle)}
        />
      ))}
    </g>
  )
}

export const DocumentCanvas = forwardRef<SVGSVGElement, Props>(function DocumentCanvas({
  page,
  title,
  pixelsPerInch = 72,
  showGrid = false,
  className = 'block max-h-full max-w-full bg-white shadow-sm',
  selectedShapeId,
  onSelectShape,
  onShapeChange,
  editingShapeId,
  onStartTextEditing,
}: Props, forwardedRef) {
  const width = number(page.width, 8.5)
  const height = number(page.height, 11)
  const shapes = page.shapes ?? []
  const gridId = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const interactionRef = useRef<Interaction | null>(null)
  const keyedShapes = shapes.map((shape, index) => ({ shape, key: shapeKey(shape, index) }))
  const selectedShape = keyedShapes.find(({ key }) => key === selectedShapeId)?.shape

  const startInteraction = (
    event: ReactPointerEvent<SVGElement>,
    shape: CanvasShape,
    shapeId: string,
    mode: Interaction['mode'],
    handle?: Handle,
  ) => {
    if (!onShapeChange || !svgRef.current) return
    event.preventDefault()
    event.stopPropagation()
    const svg = svgRef.current
    const start = svgPoint(svg, event.clientX, event.clientY)
    const initial = {
      x: number(shape.x),
      y: number(shape.y),
      width: number(shape.width),
      height: number(shape.height),
      rotation: number(shape.rotation),
    }
    const center = { x: initial.x + initial.width / 2, y: initial.y + initial.height / 2 }
    interactionRef.current = {
      pointerId: event.pointerId,
      shapeId,
      mode,
      handle,
      start,
      initial,
      startAngle: mode === 'rotate' ? angleAt(start, center) : undefined,
    }
    svg.setPointerCapture(event.pointerId)
    onSelectShape?.(shapeId)
  }

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const interaction = interactionRef.current
    if (!interaction || interaction.pointerId !== event.pointerId || !onShapeChange) return
    const point = svgPoint(event.currentTarget, event.clientX, event.clientY)
    const { initial } = interaction
    const dxWorld = point.x - interaction.start.x
    const dyWorld = point.y - interaction.start.y

    if (interaction.mode === 'move') {
      onShapeChange(interaction.shapeId, { x: rounded(initial.x + dxWorld), y: rounded(initial.y + dyWorld) })
      return
    }

    const center = { x: initial.x + initial.width / 2, y: initial.y + initial.height / 2 }
    if (interaction.mode === 'rotate') {
      let rotation = initial.rotation + angleAt(point, center) - (interaction.startAngle ?? 0)
      if (event.shiftKey) rotation = Math.round(rotation / 15) * 15
      rotation = ((Math.round(rotation) % 360) + 360) % 360
      onShapeChange(interaction.shapeId, { rotation })
      return
    }

    const radians = initial.rotation * Math.PI / 180
    const cos = Math.cos(radians)
    const sin = Math.sin(radians)
    const dx = cos * dxWorld + sin * dyWorld
    const dy = -sin * dxWorld + cos * dyWorld
    const minimumSize = 0.05
    let left = -initial.width / 2
    let right = initial.width / 2
    let top = -initial.height / 2
    let bottom = initial.height / 2
    const handle = interaction.handle ?? 'se'

    if (handle.includes('w')) left = Math.min(left + dx, right - minimumSize)
    if (handle.includes('e')) right = Math.max(right + dx, left + minimumSize)
    if (handle.includes('n')) top = Math.min(top + dy, bottom - minimumSize)
    if (handle.includes('s')) bottom = Math.max(bottom + dy, top + minimumSize)

    const width = right - left
    const height = bottom - top
    const localCenter = { x: (left + right) / 2, y: (top + bottom) / 2 }
    const nextCenter = {
      x: center.x + cos * localCenter.x - sin * localCenter.y,
      y: center.y + sin * localCenter.x + cos * localCenter.y,
    }
    onShapeChange(interaction.shapeId, {
      x: rounded(nextCenter.x - width / 2),
      y: rounded(nextCenter.y - height / 2),
      width: rounded(width),
      height: rounded(height),
    })
  }

  const endInteraction = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (interactionRef.current?.pointerId !== event.pointerId) return
    interactionRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <svg
      ref={(element) => {
        svgRef.current = element
        if (typeof forwardedRef === 'function') forwardedRef(element)
        else if (forwardedRef) forwardedRef.current = element
      }}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width * pixelsPerInch}
      height={height * pixelsPerInch}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${title} preview`}
      onPointerMove={handlePointerMove}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
    >
      {showGrid && (
        <defs>
          <pattern id={`${gridId}-minor`} width="0.25" height="0.25" patternUnits="userSpaceOnUse">
            <path d="M 0.25 0 L 0 0 0 0.25" fill="none" stroke="#e5e7eb" strokeWidth="0.008" />
          </pattern>
          <pattern id={`${gridId}-major`} width="1" height="1" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill={`url(#${gridId}-minor)`} />
            <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#bfdbfe" strokeWidth="0.012" />
          </pattern>
        </defs>
      )}
      <rect width={width} height={height} fill="white" />
      {showGrid && <rect width={width} height={height} fill={`url(#${gridId}-major)`} />}
      {onSelectShape && <rect width={width} height={height} fill="transparent" onPointerDown={() => onSelectShape(null)} />}
      {[...keyedShapes]
        .sort((left, right) => number(left.shape.z) - number(right.shape.z))
        .map(({ shape, key }) => (
          <g
            key={key}
            className={onShapeChange && editingShapeId !== key ? 'cursor-move' : undefined}
            onPointerDown={onShapeChange && editingShapeId !== key ? (event) => {
              if (shape.type === 'text' && onStartTextEditing && event.detail === 2) {
                event.preventDefault()
                event.stopPropagation()
                onSelectShape?.(key)
                onStartTextEditing(key)
                return
              }
              startInteraction(event, shape, key, 'move')
            } : undefined}
            onDoubleClick={onStartTextEditing && shape.type === 'text' ? (event) => {
              event.preventDefault()
              event.stopPropagation()
              onSelectShape?.(key)
              onStartTextEditing(key)
            } : undefined}
          >
            <ShapeNode shape={shape} hideText={editingShapeId === key} />
            <rect
              x={number(shape.x)}
              y={number(shape.y)}
              width={number(shape.width)}
              height={number(shape.height)}
              fill="transparent"
              pointerEvents="all"
              transform={number(shape.rotation) ? `rotate(${number(shape.rotation)} ${number(shape.x) + number(shape.width) / 2} ${number(shape.y) + number(shape.height) / 2})` : undefined}
            />
          </g>
        ))}
      {selectedShape && selectedShapeId && onShapeChange && editingShapeId !== selectedShapeId && (
        <SelectionFrame
          shape={selectedShape}
          pixelsPerInch={pixelsPerInch}
          onStart={(event, mode, handle) => startInteraction(event, selectedShape, selectedShapeId, mode, handle)}
          onDoubleClick={selectedShape.type === 'text' && onStartTextEditing
            ? () => onStartTextEditing(selectedShapeId)
            : undefined}
        />
      )}
    </svg>
  )
})
