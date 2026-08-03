import { elementInput } from '../elements'
import type { DocumentDraft, ElementResponse, PublicationDocument } from '../types'
import type { InsertElementType } from './EditorToolbar'

type DocumentPage = NonNullable<PublicationDocument['pages']>[number]

export function documentDraft({ document }: { document: PublicationDocument }): DocumentDraft {
  return {
    name: document.name ?? 'Untitled',
    pages: (document.pages ?? []).map((page, index) => ({
      pageNumber: page.pageNumber ?? index + 1,
      width: page.width ?? 8.5,
      height: page.height ?? 11,
      elements: (page.elements ?? []).map((element) => elementInput({ element })),
    })),
  }
}

export function createElement({
  type,
  page,
}: {
  type: InsertElementType
  page: DocumentPage
}): ElementResponse {
  const id = `draft-${crypto.randomUUID()}`
  const size =
    type === 'circle' || type === 'star'
      ? { width: 1.5, height: 1.5 }
      : type === 'text'
        ? { width: 4, height: 1.5 }
        : type === 'line'
          ? { width: 4, height: 0 }
          : { width: 2, height: 1.5 }
  const elements = page.elements ?? []
  const common = {
    id,
    x: Math.max(0, ((page.width ?? 8.5) - size.width) / 2),
    y: Math.max(0, ((page.height ?? 11) - size.height) / 2),
    z: Math.max(0, ...elements.map((element) => element.z ?? 0)) + 1,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
  }
  if (type === 'line') {
    return {
      ...common,
      kind: 'path',
      data: {
        commands: [
          { type: 'move', x: 0, y: 0 },
          { type: 'line', x: size.width, y: size.height },
        ],
        fill: null,
        border: { color: '#7c3aed', opacity: 1, width: 2 },
      },
    }
  }
  if (type === 'text') {
    return {
      ...common,
      kind: 'text',
      data: {
        size,
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        verticalAlignment: 'top',
      },
    }
  }
  return {
    ...common,
    kind: 'shape',
    data: {
      size,
      geometry: geometryForType({ type }),
      fill: { color: '#a78bfa', opacity: 1 },
      border: { color: '#7c3aed', opacity: 1, width: 1 },
    },
  }
}

function geometryForType({ type }: { type: InsertElementType }) {
  if (type === 'circle') {
    return { type: 'ellipse' } as const
  }
  if (type === 'star') {
    return {
      type: 'star',
      points: 5,
      innerRadius: 0.45,
      phase: -90,
      roundness: 0,
    } as const
  }
  if (type === 'arrow') {
    return {
      type: 'arrow',
      ends: 'end',
      shaftThickness: 0.35,
      headInset: 0.3,
      headAngle: 0,
    } as const
  }
  return {
    type: 'rectangle',
    radius: {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    },
  } as const
}
