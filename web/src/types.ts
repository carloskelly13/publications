import type { components } from './generated/api'

export type User = components['schemas']['UserResponse']
export type ElementInput = components['schemas']['ElementInput']
export type ElementResponse = components['schemas']['ElementResponse']
export type CanvasElement = ElementInput | ElementResponse
export type ShapeElement = Extract<ElementResponse, { kind: 'shape' }>
export type PathElement = Extract<ElementResponse, { kind: 'path' }>
export type TextElement = Extract<ElementResponse, { kind: 'text' }>
export type Paint = components['schemas']['Paint']
export type Border = components['schemas']['Border']
export type ShapeGeometry = components['schemas']['ShapeGeometry']
export type PathCommand = components['schemas']['PathCommand']
export type PageInput = components['schemas']['PageInput']
export type PageResponse = components['schemas']['PageResponse']
export type CanvasPage = PageInput | PageResponse
export type PublicationDocument = components['schemas']['DocumentResponse']
export type DocumentDraft = components['schemas']['DocumentRequest']
export type DocumentPage = components['schemas']['DocumentPageResponse']
