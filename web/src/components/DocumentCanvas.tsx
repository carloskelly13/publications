import { forwardRef, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { ElementPatch } from '../elements'
import type { CanvasElement, CanvasPage, PathCommand } from '../types'
import { RichTextShape } from './RichTextShape'

type Props = {
  page: CanvasPage
  title: string
  pixelsPerInch?: number
  showGrid?: boolean
  className?: string
  selectedShapeId?: string | null
  selectedShapeIds?: string[]
  onSelectShape?: ({
    shapeId,
    additive,
    preserveGroup,
  }: {
    shapeId: string | null
    additive?: boolean
    preserveGroup?: boolean
  }) => void
  onSelectShapes?: ({ shapeIds }: { shapeIds: string[] }) => void
  onShapeChange?: (shapeId: string, changes: ElementPatch) => void
  onInteractionStart?: () => void
  onInteractionEnd?: () => void
  editingShapeId?: string | null
  onStartTextEditing?: (shapeId: string) => void
  snapToGrid?: boolean
}

type LegacyShapePatch = {
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  pathGeometry?: PathGeometry
}
type PathGeometry = { commands: PathCommand[] }
type CanvasShape = {
  element: CanvasElement
  id?: string
  type: 'rect' | 'ellipse' | 'text' | 'image' | 'line' | 'polygon' | 'star' | 'arrow'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  z: number
  fill: string
  fillOpacity: number
  stroke: string
  strokeOpacity: number
  strokeWidth: number
  radiusTopLeft: number
  radiusTopRight: number
  radiusBottomRight: number
  radiusBottomLeft: number
  pathGeometry?: PathGeometry
}

const number = (value: number | undefined, fallback = 0) => value ?? fallback
const shapeKey = (shape: CanvasShape, index: number) =>
  typeof shape.id === 'string' ? shape.id : `${shape.type}-${index}`

const canvasShape = ({ element }: { element: CanvasElement }): CanvasShape => {
  if (element.kind === 'path') {
    const points = element.data.commands.flatMap((command) =>
      command.type === 'quadratic'
        ? [
            { x: command.controlX, y: command.controlY },
            { x: command.x, y: command.y },
          ]
        : [{ x: command.x, y: command.y }],
    )
    return {
      element,
      id: 'id' in element ? element.id : undefined,
      type: 'line',
      x: element.x,
      y: element.y,
      width: Math.max(...points.map(({ x }) => x)) - Math.min(...points.map(({ x }) => x)),
      height: Math.max(...points.map(({ y }) => y)) - Math.min(...points.map(({ y }) => y)),
      rotation: element.rotation,
      z: element.z,
      fill: 'none',
      fillOpacity: 0,
      stroke: element.data.border.color,
      strokeOpacity: element.data.border.opacity,
      strokeWidth: element.data.border.width,
      radiusTopLeft: 0,
      radiusTopRight: 0,
      radiusBottomRight: 0,
      radiusBottomLeft: 0,
      pathGeometry: { commands: element.data.commands },
    }
  }
  const isText = element.kind === 'text'
  const isImage = element.kind === 'image'
  const geometry = element.kind === 'shape' ? element.data.geometry : undefined
  const radius = geometry?.type === 'rectangle' ? geometry.radius : undefined
  const fill = element.kind === 'shape' ? element.data.fill : null
  const border = element.kind === 'shape' ? element.data.border : null
  return {
    element,
    id: 'id' in element ? element.id : undefined,
    type: isText
      ? 'text'
      : isImage
        ? 'image'
        : geometry?.type === 'rectangle'
          ? 'rect'
          : (geometry?.type ?? 'rect'),
    x: element.x,
    y: element.y,
    width: element.data.size.width,
    height: element.data.size.height,
    rotation: element.rotation,
    z: element.z,
    fill: fill?.color ?? 'none',
    fillOpacity: fill?.opacity ?? 0,
    stroke: border?.color ?? 'none',
    strokeOpacity: border?.opacity ?? 0,
    strokeWidth: border?.width ?? 0,
    radiusTopLeft: radius?.topLeft ?? 0,
    radiusTopRight: radius?.topRight ?? 0,
    radiusBottomRight: radius?.bottomRight ?? 0,
    radiusBottomLeft: radius?.bottomLeft ?? 0,
  }
}

type Point = { x: number; y: number }

const pathData = ({ shape }: { shape: CanvasShape }) => {
  const origin = { x: number(shape.x), y: number(shape.y) }
  return (shape.pathGeometry?.commands ?? [])
    .map((command) => {
      if (command.type === 'quadratic') {
        return `Q ${origin.x + command.controlX} ${origin.y + command.controlY} ${origin.x + command.x} ${origin.y + command.y}`
      }
      return `${command.type === 'move' ? 'M' : 'L'} ${origin.x + command.x} ${origin.y + command.y}`
    })
    .join(' ')
}

const editableLine = ({ shape }: { shape: CanvasShape }) => {
  const commands = shape.pathGeometry?.commands
  const startCommand = commands?.[0]
  const endCommand = commands?.[1]
  const start =
    startCommand?.type === 'move' ? { x: startCommand.x, y: startCommand.y } : { x: 0, y: 0 }
  const end = endCommand
    ? { x: endCommand.x, y: endCommand.y }
    : { x: number(shape.width), y: number(shape.height) }
  const curved = endCommand?.type === 'quadratic'
  const bend = curved
    ? {
        x: 0.25 * start.x + 0.5 * endCommand.controlX + 0.25 * end.x,
        y: 0.25 * start.y + 0.5 * endCommand.controlY + 0.25 * end.y,
      }
    : { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
  return { start, end, bend, curved }
}

const linePathGeometry = ({
  start,
  end,
  bend,
  curved,
}: {
  start: Point
  end: Point
  bend: Point
  curved: boolean
}): PathGeometry => {
  const commands: PathCommand[] = [{ type: 'move', x: rounded(start.x), y: rounded(start.y) }]
  if (curved) {
    commands.push({
      type: 'quadratic',
      controlX: rounded(2 * bend.x - 0.5 * start.x - 0.5 * end.x),
      controlY: rounded(2 * bend.y - 0.5 * start.y - 0.5 * end.y),
      x: rounded(end.x),
      y: rounded(end.y),
    })
  } else {
    commands.push({ type: 'line', x: rounded(end.x), y: rounded(end.y) })
  }
  return { commands }
}

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
  if (shape.type === 'line') {
    node = <path d={pathData({ shape })} {...common} fill="none" strokeLinecap="round" />
  } else if (shape.type === 'ellipse') {
    node = (
      <ellipse cx={x + width / 2} cy={y + height / 2} rx={width / 2} ry={height / 2} {...common} />
    )
  } else if (shape.type === 'text' && shape.element.kind === 'text') {
    node = hideText ? null : <RichTextShape element={shape.element} />
  } else if (shape.type === 'image' && shape.element.kind === 'image') {
    node = (
      <image
        x={x}
        y={y}
        width={width}
        height={height}
        href={`/api/assets/${encodeURIComponent(shape.element.data.assetId)}`}
        preserveAspectRatio={`xMidYMid ${shape.element.data.fit === 'cover' ? 'slice' : 'meet'}`}
        data-asset-id={shape.element.data.assetId}
      />
    )
  } else if (shape.element.kind === 'shape' && shape.element.data.geometry.type === 'arrow') {
    node = (
      <path
        d={arrowShapePath({
          x,
          y,
          width,
          height,
          geometry: shape.element.data.geometry,
        })}
        {...common}
        strokeLinejoin="round"
      />
    )
  } else if (
    shape.element.kind === 'shape' &&
    (shape.element.data.geometry.type === 'star' || shape.element.data.geometry.type === 'polygon')
  ) {
    node = (
      <path
        d={radialShapePath({
          x,
          y,
          width,
          height,
          geometry: shape.element.data.geometry,
        })}
        {...common}
        strokeLinejoin="round"
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
    node = <path d={path} {...common} />
  }

  const rotation = number(shape.rotation)
  return (
    <g
      opacity={shape.element.opacity}
      transform={rotation ? `rotate(${rotation} ${x + width / 2} ${y + height / 2})` : undefined}
    >
      {node}
    </g>
  )
}

function arrowShapePath({
  x,
  y,
  width,
  height,
  geometry,
}: {
  x: number
  y: number
  width: number
  height: number
  geometry: Extract<
    Extract<CanvasElement, { kind: 'shape' }>['data']['geometry'],
    { type: 'arrow' }
  >
}) {
  const headWidth = width * geometry.headInset
  const shaftTop = y + (height * (1 - geometry.shaftThickness)) / 2
  const shaftBottom = y + height - (height * (1 - geometry.shaftThickness)) / 2
  const leftHead = x + headWidth
  const rightHead = x + width - headWidth
  const shoulderHeight = (height * (1 - geometry.shaftThickness)) / 2
  const maximumAngleInset =
    geometry.ends === 'both' ? Math.max(0, (rightHead - leftHead) / 2) : headWidth * 0.9
  const angleInset = Math.max(
    -headWidth * 0.9,
    Math.min(
      maximumAngleInset,
      Math.tan(((geometry.headAngle ?? 0) * Math.PI) / 180) * shoulderHeight,
    ),
  )
  const leftNeck = leftHead + angleInset
  const rightNeck = rightHead - angleInset
  const points =
    geometry.ends === 'both'
      ? [
          { x, y: y + height / 2 },
          { x: leftHead, y },
          { x: leftNeck, y: shaftTop },
          { x: rightNeck, y: shaftTop },
          { x: rightHead, y },
          { x: x + width, y: y + height / 2 },
          { x: rightHead, y: y + height },
          { x: rightNeck, y: shaftBottom },
          { x: leftNeck, y: shaftBottom },
          { x: leftHead, y: y + height },
        ]
      : geometry.ends === 'start'
        ? [
            { x, y: y + height / 2 },
            { x: leftHead, y },
            { x: leftNeck, y: shaftTop },
            { x: x + width, y: shaftTop },
            { x: x + width, y: shaftBottom },
            { x: leftNeck, y: shaftBottom },
            { x: leftHead, y: y + height },
          ]
        : [
            { x, y: shaftTop },
            { x: rightNeck, y: shaftTop },
            { x: rightHead, y },
            { x: x + width, y: y + height / 2 },
            { x: rightHead, y: y + height },
            { x: rightNeck, y: shaftBottom },
            { x, y: shaftBottom },
          ]
  return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} Z`
}

function radialShapePath({
  x,
  y,
  width,
  height,
  geometry,
}: {
  x: number
  y: number
  width: number
  height: number
  geometry: Extract<
    Extract<CanvasElement, { kind: 'shape' }>['data']['geometry'],
    { type: 'polygon' | 'star' }
  >
}) {
  const pointCount = geometry.type === 'star' ? geometry.points * 2 : geometry.sides
  const phase = (geometry.phase * Math.PI) / 180
  const radialPoints = Array.from({ length: pointCount }, (_, index) => {
    const radius = geometry.type === 'star' && index % 2 === 1 ? geometry.innerRadius : 1
    const angle = phase + (index * Math.PI * 2) / pointCount
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  })
  const bounds = {
    left: Math.min(...radialPoints.map((point) => point.x)),
    top: Math.min(...radialPoints.map((point) => point.y)),
    right: Math.max(...radialPoints.map((point) => point.x)),
    bottom: Math.max(...radialPoints.map((point) => point.y)),
  }
  const points = radialPoints.map((point) => ({
    x: x + ((point.x - bounds.left) / (bounds.right - bounds.left)) * width,
    y: y + ((point.y - bounds.top) / (bounds.bottom - bounds.top)) * height,
  }))
  const roundness = geometry.type === 'star' ? geometry.roundness : 0
  if (roundness <= 0) {
    return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} Z`
  }
  const inset = Math.min(0.45, roundness * 0.35)
  const corners = points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length]
    const next = points[(index + 1) % points.length]
    return {
      point,
      entry: interpolatePoint({ from: point, to: previous, ratio: inset }),
      exit: interpolatePoint({ from: point, to: next, ratio: inset }),
    }
  })
  return `${corners
    .map(
      ({ point, entry, exit }, index) =>
        `${index === 0 ? `M ${entry.x} ${entry.y}` : `L ${entry.x} ${entry.y}`} Q ${point.x} ${point.y} ${exit.x} ${exit.y}`,
    )
    .join(' ')} Z`
}

function interpolatePoint({ from, to, ratio }: { from: Point; to: Point; ratio: number }) {
  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio,
  }
}

type Handle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se'
type ShapeBounds = { x: number; y: number; width: number; height: number; rotation: number }
type Interaction = {
  pointerId: number
  shapeId: string
  mode: 'move' | 'resize' | 'rotate' | 'line-start' | 'line-end' | 'line-bend'
  handle?: Handle
  start: Point
  initial: ShapeBounds
  initialPathGeometry?: PathGeometry
  moveShapes?: Array<{ shapeId: string; x: number; y: number }>
  startAngle?: number
}

type Marquee = {
  pointerId: number
  start: Point
  current: Point
  additive: boolean
  initialShapeIds: string[]
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
const angleAt = (point: Point, center: Point) =>
  (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI

function svgPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const matrix = svg.getScreenCTM()
  if (!matrix) {
    return { x: 0, y: 0 }
  }
  const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse())
  return { x: point.x, y: point.y }
}

const distanceToSegment = ({ point, start, end }: { point: Point; start: Point; end: Point }) => {
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

type FrameProps = {
  shape: CanvasShape
  pixelsPerInch: number
  onStart: (
    event: ReactPointerEvent<SVGElement>,
    mode: Interaction['mode'],
    handle?: Handle,
  ) => void
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
        stroke="#3b82f6"
        strokeWidth={strokeWidth}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        stroke="#3b82f6"
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
          if (!onDoubleClick) {
            return
          }
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
        stroke="#3b82f6"
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
          fill="white"
          stroke="#111827"
          strokeWidth={strokeWidth}
          style={{ cursor: `${handle}-resize` }}
          onPointerDown={(event) => onStart(event, 'resize', handle)}
        />
      ))}
    </g>
  )
}

type LineSelectionFrameProps = {
  shape: CanvasShape
  pixelsPerInch: number
  onStart: ({
    event,
    mode,
  }: {
    event: ReactPointerEvent<SVGElement>
    mode: Interaction['mode']
  }) => void
}

function LineSelectionFrame({ shape, pixelsPerInch, onStart }: LineSelectionFrameProps) {
  const origin = { x: number(shape.x), y: number(shape.y) }
  const { start, end, bend } = editableLine({ shape })
  const handleSize = 9 / pixelsPerInch
  const halfHandle = handleSize / 2
  const strokeWidth = 1.5 / pixelsPerInch

  return (
    <g>
      <path
        d={pathData({ shape })}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="cursor-move"
        onPointerDown={(event) => onStart({ event, mode: 'move' })}
      />
      <rect
        x={origin.x + start.x - halfHandle}
        y={origin.y + start.y - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="white"
        stroke="#111827"
        strokeWidth={strokeWidth}
        className="cursor-crosshair"
        onPointerDown={(event) => onStart({ event, mode: 'line-start' })}
      />
      <rect
        x={origin.x + end.x - halfHandle}
        y={origin.y + end.y - halfHandle}
        width={handleSize}
        height={handleSize}
        fill="white"
        stroke="#111827"
        strokeWidth={strokeWidth}
        className="cursor-crosshair"
        onPointerDown={(event) => onStart({ event, mode: 'line-end' })}
      />
      <circle
        cx={origin.x + bend.x}
        cy={origin.y + bend.y}
        r={halfHandle}
        fill="#84cc16"
        stroke="#111827"
        strokeWidth={strokeWidth}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={(event) => onStart({ event, mode: 'line-bend' })}
      />
    </g>
  )
}

const visualBounds = ({ shape }: { shape: CanvasShape }) => {
  const x = number(shape.x)
  const y = number(shape.y)
  if (shape.type === 'line' && shape.pathGeometry) {
    const points = shape.pathGeometry.commands.flatMap((command) =>
      command.type === 'quadratic'
        ? [
            { x: x + command.controlX, y: y + command.controlY },
            { x: x + command.x, y: y + command.y },
          ]
        : [{ x: x + command.x, y: y + command.y }],
    )
    return {
      left: Math.min(...points.map((point) => point.x)),
      top: Math.min(...points.map((point) => point.y)),
      right: Math.max(...points.map((point) => point.x)),
      bottom: Math.max(...points.map((point) => point.y)),
    }
  }
  const oppositeX = x + number(shape.width)
  const oppositeY = y + number(shape.height)
  return {
    left: Math.min(x, oppositeX),
    top: Math.min(y, oppositeY),
    right: Math.max(x, oppositeX),
    bottom: Math.max(y, oppositeY),
  }
}

const selectionCenter = ({ shape }: { shape: CanvasShape }) => {
  if (shape.type === 'line') {
    const origin = { x: number(shape.x), y: number(shape.y) }
    const { start, end } = editableLine({ shape })
    return {
      x: origin.x + (start.x + end.x) / 2,
      y: origin.y + (start.y + end.y) / 2,
    }
  }
  const bounds = visualBounds({ shape })
  return { x: (bounds.left + bounds.right) / 2, y: (bounds.top + bounds.bottom) / 2 }
}

function SelectionOutline({ shape, pixelsPerInch }: { shape: CanvasShape; pixelsPerInch: number }) {
  const strokeWidth = 1.25 / pixelsPerInch
  if (shape.type === 'line') {
    return (
      <g pointerEvents="none">
        <path d={pathData({ shape })} fill="none" stroke="white" strokeWidth={5 / pixelsPerInch} />
        <path d={pathData({ shape })} fill="none" stroke="#3b82f6" strokeWidth={strokeWidth} />
      </g>
    )
  }

  const x = number(shape.x)
  const y = number(shape.y)
  const width = number(shape.width)
  const height = number(shape.height)
  const transform = number(shape.rotation)
    ? `rotate(${number(shape.rotation)} ${x + width / 2} ${y + height / 2})`
    : undefined
  if (shape.type === 'ellipse') {
    return (
      <ellipse
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={strokeWidth}
        transform={transform}
        pointerEvents="none"
      />
    )
  }
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="none"
      stroke="#3b82f6"
      strokeWidth={strokeWidth}
      transform={transform}
      pointerEvents="none"
    />
  )
}

export const DocumentCanvas = forwardRef<SVGSVGElement, Props>(function DocumentCanvas(
  {
    page,
    title,
    pixelsPerInch = 72,
    showGrid = false,
    className = 'block max-h-full max-w-full bg-white shadow-sm',
    selectedShapeId,
    selectedShapeIds = selectedShapeId ? [selectedShapeId] : [],
    onSelectShape,
    onSelectShapes,
    onShapeChange: onElementChange,
    onInteractionStart,
    onInteractionEnd,
    editingShapeId,
    onStartTextEditing,
    snapToGrid = false,
  }: Props,
  forwardedRef,
) {
  const width = number(page.width, 8.5)
  const height = number(page.height, 11)
  const shapes = (page.elements ?? [])
    .filter((element) => !element.hidden)
    .map((element) => canvasShape({ element }))
  const gridId = useId().replace(/:/g, '')
  const svgRef = useRef<SVGSVGElement>(null)
  const interactionRef = useRef<Interaction | null>(null)
  const marqueeRef = useRef<Marquee | null>(null)
  const [marquee, setMarquee] = useState<Marquee | null>(null)
  const keyedShapes = shapes.map((shape, index) => ({ shape, key: shapeKey(shape, index) }))
  const selectedShapes = keyedShapes.filter(({ key }) => selectedShapeIds.includes(key))
  const selectedShape =
    selectedShapeIds.length === 1
      ? keyedShapes.find(({ key }) => key === selectedShapeId)?.shape
      : undefined
  const onShapeChange = onElementChange
    ? (shapeId: string, changes: LegacyShapePatch) => {
        const patch: ElementPatch = {
          ...(changes.x === undefined ? {} : { x: changes.x }),
          ...(changes.y === undefined ? {} : { y: changes.y }),
          ...(changes.rotation === undefined ? {} : { rotation: changes.rotation }),
          ...(changes.width === undefined && changes.height === undefined
            ? {}
            : { size: { width: changes.width, height: changes.height } }),
          ...(changes.pathGeometry === undefined
            ? {}
            : { commands: changes.pathGeometry.commands }),
        }
        onElementChange(shapeId, patch)
      }
    : undefined
  const snapCoordinate = ({ value }: { value: number }) =>
    snapToGrid ? Math.round(value / 0.25) * 0.25 : value

  const startMarquee = ({ event }: { event: ReactPointerEvent<SVGRectElement> }) => {
    if (!svgRef.current || !onSelectShapes) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const point = svgPoint(svgRef.current, event.clientX, event.clientY)
    const next: Marquee = {
      pointerId: event.pointerId,
      start: point,
      current: point,
      additive: event.shiftKey || event.metaKey || event.ctrlKey,
      initialShapeIds: selectedShapeIds,
    }
    marqueeRef.current = next
    setMarquee(next)
    svgRef.current.setPointerCapture(event.pointerId)
    if (!next.additive) {
      onSelectShapes({ shapeIds: [] })
    }
  }

  const startInteraction = (
    event: ReactPointerEvent<SVGElement>,
    shape: CanvasShape,
    shapeId: string,
    mode: Interaction['mode'],
    handle?: Handle,
  ) => {
    if (!onShapeChange || !svgRef.current) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const additive = event.shiftKey || event.metaKey || event.ctrlKey
    if (additive && mode === 'move') {
      onSelectShape?.({ shapeId, additive: true })
      return
    }
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
      initialPathGeometry: shape.pathGeometry,
      moveShapes:
        mode === 'move' && selectedShapeIds.length > 1 && selectedShapeIds.includes(shapeId)
          ? keyedShapes
              .filter(({ key }) => selectedShapeIds.includes(key))
              .map(({ shape: selected, key }) => ({
                shapeId: key,
                x: number(selected.x),
                y: number(selected.y),
              }))
          : undefined,
      startAngle: mode === 'rotate' ? angleAt(start, center) : undefined,
    }
    svg.setPointerCapture(event.pointerId)
    onSelectShape?.({ shapeId, preserveGroup: true })
    onInteractionStart?.()
  }

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    const activeMarquee = marqueeRef.current
    if (activeMarquee?.pointerId === event.pointerId && onSelectShapes) {
      const current = svgPoint(event.currentTarget, event.clientX, event.clientY)
      const left = Math.min(activeMarquee.start.x, current.x)
      const right = Math.max(activeMarquee.start.x, current.x)
      const top = Math.min(activeMarquee.start.y, current.y)
      const bottom = Math.max(activeMarquee.start.y, current.y)
      const enclosedIds = keyedShapes
        .filter(({ shape }) => {
          const center = selectionCenter({ shape })
          return center.x >= left && center.x <= right && center.y >= top && center.y <= bottom
        })
        .map(({ key }) => key)
      const shapeIds = activeMarquee.additive
        ? [...new Set([...activeMarquee.initialShapeIds, ...enclosedIds])]
        : enclosedIds
      const next = { ...activeMarquee, current }
      marqueeRef.current = next
      setMarquee(next)
      onSelectShapes({ shapeIds })
      return
    }
    const interaction = interactionRef.current
    if (!interaction || interaction.pointerId !== event.pointerId || !onShapeChange) {
      return
    }
    const point = svgPoint(event.currentTarget, event.clientX, event.clientY)
    const { initial } = interaction
    const dxWorld = point.x - interaction.start.x
    const dyWorld = point.y - interaction.start.y

    if (
      interaction.mode === 'line-start' ||
      interaction.mode === 'line-end' ||
      interaction.mode === 'line-bend'
    ) {
      const initialLine = editableLine({
        shape: {
          ...(selectedShape ?? keyedShapes.find(({ key }) => key === interaction.shapeId)?.shape)!,
          type: 'line',
          x: initial.x,
          y: initial.y,
          width: initial.width,
          height: initial.height,
          pathGeometry: interaction.initialPathGeometry,
        },
      })
      const absoluteStart = {
        x: initial.x + initialLine.start.x,
        y: initial.y + initialLine.start.y,
      }
      const absoluteEnd = { x: initial.x + initialLine.end.x, y: initial.y + initialLine.end.y }
      const absoluteBend = { x: initial.x + initialLine.bend.x, y: initial.y + initialLine.bend.y }

      if (interaction.mode === 'line-start') {
        const nextStart = {
          x: snapCoordinate({ value: absoluteStart.x + dxWorld }),
          y: snapCoordinate({ value: absoluteStart.y + dyWorld }),
        }
        const end = { x: absoluteEnd.x - nextStart.x, y: absoluteEnd.y - nextStart.y }
        const bend = { x: absoluteBend.x - nextStart.x, y: absoluteBend.y - nextStart.y }
        onShapeChange(interaction.shapeId, {
          x: rounded(nextStart.x),
          y: rounded(nextStart.y),
          width: rounded(end.x),
          height: rounded(end.y),
          pathGeometry: linePathGeometry({
            start: { x: 0, y: 0 },
            end,
            bend,
            curved: initialLine.curved,
          }),
        })
        return
      }

      const start = initialLine.start
      const end =
        interaction.mode === 'line-end'
          ? {
              x: snapCoordinate({ value: initial.x + initialLine.end.x + dxWorld }) - initial.x,
              y: snapCoordinate({ value: initial.y + initialLine.end.y + dyWorld }) - initial.y,
            }
          : initialLine.end
      const bend =
        interaction.mode === 'line-bend'
          ? {
              x: snapCoordinate({ value: initial.x + initialLine.bend.x + dxWorld }) - initial.x,
              y: snapCoordinate({ value: initial.y + initialLine.bend.y + dyWorld }) - initial.y,
            }
          : initialLine.bend
      const curved =
        interaction.mode === 'line-bend'
          ? distanceToSegment({ point: bend, start, end }) > 8 / pixelsPerInch
          : initialLine.curved
      onShapeChange(interaction.shapeId, {
        width: rounded(end.x),
        height: rounded(end.y),
        pathGeometry: linePathGeometry({ start, end, bend, curved }),
      })
      return
    }

    if (interaction.mode === 'move') {
      if (interaction.moveShapes && interaction.moveShapes.length > 1) {
        const snappedDx = snapCoordinate({ value: initial.x + dxWorld }) - initial.x
        const snappedDy = snapCoordinate({ value: initial.y + dyWorld }) - initial.y
        interaction.moveShapes.forEach(({ shapeId, x, y }) => {
          onShapeChange(shapeId, { x: rounded(x + snappedDx), y: rounded(y + snappedDy) })
        })
        return
      }
      onShapeChange(interaction.shapeId, {
        x: rounded(snapCoordinate({ value: initial.x + dxWorld })),
        y: rounded(snapCoordinate({ value: initial.y + dyWorld })),
      })
      return
    }

    const center = { x: initial.x + initial.width / 2, y: initial.y + initial.height / 2 }
    if (interaction.mode === 'rotate') {
      let rotation = initial.rotation + angleAt(point, center) - (interaction.startAngle ?? 0)
      if (event.shiftKey) {
        rotation = Math.round(rotation / 15) * 15
      }
      rotation = ((Math.round(rotation) % 360) + 360) % 360
      onShapeChange(interaction.shapeId, { rotation })
      return
    }

    const radians = (initial.rotation * Math.PI) / 180
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

    if (handle.includes('w')) {
      left = Math.min(left + dx, right - minimumSize)
    }
    if (handle.includes('e')) {
      right = Math.max(right + dx, left + minimumSize)
    }
    if (handle.includes('n')) {
      top = Math.min(top + dy, bottom - minimumSize)
    }
    if (handle.includes('s')) {
      bottom = Math.max(bottom + dy, top + minimumSize)
    }

    const width = right - left
    const height = bottom - top
    const localCenter = { x: (left + right) / 2, y: (top + bottom) / 2 }
    const nextCenter = {
      x: center.x + cos * localCenter.x - sin * localCenter.y,
      y: center.y + sin * localCenter.x + cos * localCenter.y,
    }
    const nextX = snapCoordinate({ value: nextCenter.x - width / 2 })
    const nextY = snapCoordinate({ value: nextCenter.y - height / 2 })
    const nextWidth = snapToGrid ? Math.max(0.25, snapCoordinate({ value: width })) : width
    const nextHeight = snapToGrid ? Math.max(0.25, snapCoordinate({ value: height })) : height
    onShapeChange(interaction.shapeId, {
      x: rounded(nextX),
      y: rounded(nextY),
      width: rounded(nextWidth),
      height: rounded(nextHeight),
    })
  }

  const endInteraction = (event: ReactPointerEvent<SVGSVGElement>) => {
    const activeMarquee = marqueeRef.current
    if (activeMarquee?.pointerId === event.pointerId) {
      const distance = Math.hypot(
        activeMarquee.current.x - activeMarquee.start.x,
        activeMarquee.current.y - activeMarquee.start.y,
      )
      if (distance < 3 / pixelsPerInch && onSelectShapes) {
        onSelectShapes({ shapeIds: activeMarquee.additive ? activeMarquee.initialShapeIds : [] })
      }
      marqueeRef.current = null
      setMarquee(null)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      return
    }
    if (interactionRef.current?.pointerId !== event.pointerId) {
      return
    }
    interactionRef.current = null
    onInteractionEnd?.()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <svg
      ref={(element) => {
        svgRef.current = element
        if (typeof forwardedRef === 'function') {
          forwardedRef(element)
        } else if (forwardedRef) {
          forwardedRef.current = element
        }
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
      {onSelectShape && (
        <rect
          width={width}
          height={height}
          fill="transparent"
          onPointerDown={(event) => startMarquee({ event })}
        />
      )}
      {[...keyedShapes]
        .sort((left, right) => number(left.shape.z) - number(right.shape.z))
        .map(({ shape, key }) => (
          <g
            key={key}
            className={
              onShapeChange && !shape.element.locked && editingShapeId !== key
                ? 'cursor-move'
                : undefined
            }
            onPointerDown={
              onShapeChange && !shape.element.locked && editingShapeId !== key
                ? (event) => {
                    if (shape.type === 'text' && onStartTextEditing && event.detail === 2) {
                      event.preventDefault()
                      event.stopPropagation()
                      onSelectShape?.({ shapeId: key })
                      onStartTextEditing(key)
                      return
                    }
                    startInteraction(event, shape, key, 'move')
                  }
                : undefined
            }
            onDoubleClick={
              onStartTextEditing && shape.type === 'text'
                ? (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onSelectShape?.({ shapeId: key })
                    onStartTextEditing(key)
                  }
                : undefined
            }
          >
            <ShapeNode shape={shape} hideText={editingShapeId === key} />
            {shape.type === 'line' ? (
              <path
                d={pathData({ shape })}
                fill="none"
                stroke="transparent"
                strokeWidth={12 / pixelsPerInch}
                pointerEvents="stroke"
              />
            ) : (
              <rect
                x={number(shape.x)}
                y={number(shape.y)}
                width={number(shape.width)}
                height={number(shape.height)}
                fill="transparent"
                pointerEvents="all"
                transform={
                  number(shape.rotation)
                    ? `rotate(${number(shape.rotation)} ${number(shape.x) + number(shape.width) / 2} ${number(shape.y) + number(shape.height) / 2})`
                    : undefined
                }
              />
            )}
          </g>
        ))}
      {marquee &&
        selectedShapes.map(({ shape, key }) => (
          <SelectionOutline key={`outline-${key}`} shape={shape} pixelsPerInch={pixelsPerInch} />
        ))}
      {selectedShape &&
        selectedShapeId &&
        onShapeChange &&
        !selectedShape.element.locked &&
        editingShapeId !== selectedShapeId &&
        !marquee &&
        (selectedShape.type === 'line' ? (
          <LineSelectionFrame
            shape={selectedShape}
            pixelsPerInch={pixelsPerInch}
            onStart={({ event, mode }) =>
              startInteraction(event, selectedShape, selectedShapeId, mode)
            }
          />
        ) : (
          <SelectionFrame
            shape={selectedShape}
            pixelsPerInch={pixelsPerInch}
            onStart={(event, mode, handle) =>
              startInteraction(event, selectedShape, selectedShapeId, mode, handle)
            }
            onDoubleClick={
              selectedShape.type === 'text' && onStartTextEditing
                ? () => onStartTextEditing(selectedShapeId)
                : undefined
            }
          />
        ))}
      {selectedShapes.length > 1 &&
        onShapeChange &&
        !marquee &&
        selectedShapes
          .filter(({ shape }) => !shape.element.locked)
          .map(({ shape, key }) =>
            shape.type === 'line' ? (
              <LineSelectionFrame
                key={`frame-${key}`}
                shape={shape}
                pixelsPerInch={pixelsPerInch}
                onStart={({ event, mode }) => startInteraction(event, shape, key, mode)}
              />
            ) : (
              <SelectionFrame
                key={`frame-${key}`}
                shape={shape}
                pixelsPerInch={pixelsPerInch}
                onStart={(event, mode, handle) => startInteraction(event, shape, key, mode, handle)}
                onDoubleClick={
                  shape.type === 'text' && onStartTextEditing
                    ? () => {
                        onSelectShape?.({ shapeId: key })
                        onStartTextEditing(key)
                      }
                    : undefined
                }
              />
            ),
          )}
      {marquee && (
        <rect
          x={Math.min(marquee.start.x, marquee.current.x)}
          y={Math.min(marquee.start.y, marquee.current.y)}
          width={Math.abs(marquee.current.x - marquee.start.x)}
          height={Math.abs(marquee.current.y - marquee.start.y)}
          fill="#6b7280"
          fillOpacity="0.4"
          stroke="#4b5563"
          strokeWidth={1.5 / pixelsPerInch}
          pointerEvents="none"
        />
      )}
    </svg>
  )
})
