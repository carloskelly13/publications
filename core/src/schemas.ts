import { Type, type Static } from '@sinclair/typebox'

const OptionalNumber = Type.Optional(Type.Number())
const OptionalString = Type.Optional(Type.String())

export const RichTextContent = Type.Record(Type.String(), Type.Unknown(), {
  $id: 'RichTextContent',
})

export const PathCommand = Type.Union(
  [
    Type.Object({ type: Type.Literal('move'), x: Type.Number(), y: Type.Number() }),
    Type.Object({ type: Type.Literal('line'), x: Type.Number(), y: Type.Number() }),
    Type.Object({
      type: Type.Literal('quadratic'),
      controlX: Type.Number(),
      controlY: Type.Number(),
      x: Type.Number(),
      y: Type.Number(),
    }),
  ],
  { $id: 'PathCommand' },
)

export const PathGeometry = Type.Object(
  {
    version: Type.Literal(1),
    commands: Type.Array(PathCommand, { minItems: 2 }),
  },
  { $id: 'PathGeometry' },
)

export const ShapeInput = Type.Object(
  {
    type: OptionalString,
    width: OptionalNumber,
    height: OptionalNumber,
    x: OptionalNumber,
    y: OptionalNumber,
    pathGeometry: Type.Optional(PathGeometry),
    z: Type.Optional(Type.Integer()),
    radiusTopLeft: OptionalNumber,
    radiusTopRight: OptionalNumber,
    radiusBottomRight: OptionalNumber,
    radiusBottomLeft: OptionalNumber,
    rotation: OptionalNumber,
    fill: OptionalString,
    fillOpacity: OptionalNumber,
    stroke: OptionalString,
    strokeWidth: OptionalNumber,
    strokeOpacity: OptionalNumber,
    text: OptionalString,
    richTextContent: Type.Optional(RichTextContent),
    contentVersion: Type.Optional(Type.Integer()),
  },
  { $id: 'ShapeInput' },
)

export const ShapeResponse = Type.Intersect([Type.Object({ id: Type.String() }), ShapeInput], {
  $id: 'ShapeResponse',
})

export const PageInput = Type.Object(
  {
    id: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.String()])),
    pageNumber: Type.Integer(),
    width: Type.Number(),
    height: Type.Number(),
    shapes: Type.Optional(Type.Array(ShapeInput)),
  },
  { $id: 'PageInput' },
)

export const PageResponse = Type.Object(
  {
    id: Type.String(),
    pageNumber: Type.Integer(),
    width: Type.Number(),
    height: Type.Number(),
    shapes: Type.Array(ShapeResponse),
  },
  { $id: 'PageResponse' },
)

export const DocumentRequest = Type.Object(
  {
    name: Type.String({ minLength: 1 }),
    pages: Type.Array(PageInput, { minItems: 1 }),
  },
  { $id: 'DocumentRequest' },
)

export const DocumentResponse = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    pages: Type.Array(PageResponse),
  },
  { $id: 'DocumentResponse' },
)

export const DocumentPageResponse = Type.Object(
  {
    items: Type.Array(DocumentResponse),
    page: Type.Integer(),
    size: Type.Integer(),
    totalItems: Type.Integer(),
    totalPages: Type.Integer(),
    hasNext: Type.Boolean(),
  },
  { $id: 'DocumentPageResponse' },
)

export const RenameDocumentRequest = Type.Object(
  {
    name: Type.String({ minLength: 2, maxLength: 255 }),
  },
  { $id: 'RenameDocumentRequest' },
)

export const PdfRequest = Type.Object(
  {
    svg: Type.String({ minLength: 1, maxLength: 5_000_000 }),
    width: Type.Number({ minimum: 0.1, maximum: 100 }),
    height: Type.Number({ minimum: 0.1, maximum: 100 }),
  },
  { $id: 'PdfRequest' },
)

export const UserResponse = Type.Object(
  {
    id: Type.String(),
    name: Type.String(),
    email: Type.String(),
  },
  { $id: 'UserResponse' },
)

export const CsrfResponse = Type.Object(
  {
    headerName: Type.Literal('X-XSRF-TOKEN'),
    token: Type.String(),
  },
  { $id: 'CsrfResponse' },
)

export type DocumentInput = Static<typeof DocumentRequest>
export type PageInputType = Static<typeof PageInput>
export type ShapeInputType = Static<typeof ShapeInput>
export type PdfInput = Static<typeof PdfRequest>
