import type { components } from './generated/api'

export type User = components['schemas']['UserResponse']
export type ShapeInput = components['schemas']['ShapeInput']
export type ShapeResponse = components['schemas']['ShapeResponse']
export type PageInput = components['schemas']['PageInput']
export type PageResponse = components['schemas']['PageResponse']
export type CanvasPage = PageInput | PageResponse
export type PublicationDocument = components['schemas']['DocumentResponse']
export type DocumentDraft = components['schemas']['DocumentRequest']
export type DocumentPage = components['schemas']['DocumentPageResponse']
