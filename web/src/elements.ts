import type {
  Border,
  CanvasElement,
  ElementInput,
  ElementResponse,
  Paint,
  PathCommand,
  ShapeGeometry,
} from './types'

export type ElementPatch = {
  x?: number
  y?: number
  rotation?: number
  z?: number
  opacity?: number
  locked?: boolean
  hidden?: boolean
  size?: { width?: number; height?: number }
  geometry?: ShapeGeometry
  fill?: Paint | null
  border?: Border | null
  commands?: PathCommand[]
  content?: Record<string, unknown>
}

export type ElementBounds = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export function elementInput({ element }: { element: ElementResponse }): ElementInput {
  return structuredClone(element)
}

export function elementSize({ element }: { element: CanvasElement }) {
  if (element.kind === 'shape' || element.kind === 'text') {
    return element.data.size
  }
  const bounds = localPathBounds({ commands: element.data.commands })
  return { width: bounds.width, height: bounds.height }
}

export function elementBounds({ element }: { element: CanvasElement }): ElementBounds {
  if (element.kind === 'path') {
    const bounds = localPathBounds({ commands: element.data.commands })
    return {
      left: element.x + bounds.left,
      top: element.y + bounds.top,
      right: element.x + bounds.right,
      bottom: element.y + bounds.bottom,
      width: bounds.width,
      height: bounds.height,
    }
  }
  const { width, height } = element.data.size
  const left = Math.min(element.x, element.x + width)
  const top = Math.min(element.y, element.y + height)
  const right = Math.max(element.x, element.x + width)
  const bottom = Math.max(element.y, element.y + height)
  return { left, top, right, bottom, width: right - left, height: bottom - top }
}

export function applyElementPatch({
  element,
  patch,
}: {
  element: ElementResponse
  patch: ElementPatch
}): ElementResponse {
  const common = {
    ...element,
    ...(patch.x === undefined ? {} : { x: patch.x }),
    ...(patch.y === undefined ? {} : { y: patch.y }),
    ...(patch.rotation === undefined ? {} : { rotation: patch.rotation }),
    ...(patch.z === undefined ? {} : { z: patch.z }),
    ...(patch.opacity === undefined ? {} : { opacity: patch.opacity }),
    ...(patch.locked === undefined ? {} : { locked: patch.locked }),
    ...(patch.hidden === undefined ? {} : { hidden: patch.hidden }),
  }

  if (element.kind === 'shape') {
    return {
      ...common,
      kind: 'shape',
      data: {
        ...element.data,
        size: { ...element.data.size, ...patch.size },
        ...(patch.geometry === undefined ? {} : { geometry: patch.geometry }),
        ...(patch.fill === undefined ? {} : { fill: patch.fill }),
        ...(patch.border === undefined ? {} : { border: patch.border }),
      },
    }
  }
  if (element.kind === 'path') {
    return {
      ...common,
      kind: 'path',
      data: {
        ...element.data,
        ...(patch.commands === undefined ? {} : { commands: patch.commands }),
        ...(patch.fill === undefined ? {} : { fill: patch.fill }),
        ...(patch.border === undefined || patch.border === null ? {} : { border: patch.border }),
      },
    }
  }
  return {
    ...common,
    kind: 'text',
    data: {
      ...element.data,
      size: { ...element.data.size, ...patch.size },
      ...(patch.content === undefined ? {} : { content: patch.content }),
    },
  }
}

export function elementLabel({ element }: { element: CanvasElement }) {
  if (element.kind === 'text') {
    return 'Text'
  }
  if (element.kind === 'path') {
    return 'Path'
  }
  const geometry = element.data.geometry
  if (geometry.type === 'rectangle') {
    return 'Rectangle'
  }
  if (geometry.type === 'ellipse') {
    return 'Ellipse'
  }
  if (geometry.type === 'arrow') {
    return 'Arrow'
  }
  if (geometry.type === 'polygon') {
    return 'Polygon'
  }
  return 'Star'
}

function localPathBounds({ commands }: { commands: PathCommand[] }): ElementBounds {
  const points = commands.flatMap((command) =>
    command.type === 'quadratic'
      ? [
          { x: command.controlX, y: command.controlY },
          { x: command.x, y: command.y },
        ]
      : [{ x: command.x, y: command.y }],
  )
  const left = Math.min(...points.map(({ x }) => x))
  const top = Math.min(...points.map(({ y }) => y))
  const right = Math.max(...points.map(({ x }) => x))
  const bottom = Math.max(...points.map(({ y }) => y))
  return { left, top, right, bottom, width: right - left, height: bottom - top }
}
