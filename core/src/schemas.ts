import { Type, type Static } from '@sinclair/typebox'

export const RichTextContent = Type.Record(Type.String(), Type.Unknown(), {
  $id: 'RichTextContent',
})

export const Paint = Type.Object(
  {
    color: Type.String(),
    opacity: Type.Number({ minimum: 0, maximum: 1 }),
  },
  { $id: 'Paint' },
)

export const Border = Type.Object(
  {
    color: Type.String(),
    opacity: Type.Number({ minimum: 0, maximum: 1 }),
    width: Type.Number({ minimum: 0 }),
  },
  { $id: 'Border' },
)

export const Size = Type.Object(
  {
    width: Type.Number({ minimum: 0.01 }),
    height: Type.Number({ minimum: 0.01 }),
  },
  { $id: 'Size' },
)

export const CornerRadii = Type.Object(
  {
    topLeft: Type.Number({ minimum: 0 }),
    topRight: Type.Number({ minimum: 0 }),
    bottomRight: Type.Number({ minimum: 0 }),
    bottomLeft: Type.Number({ minimum: 0 }),
  },
  { $id: 'CornerRadii' },
)

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

export const ShapeGeometry = Type.Union(
  [
    Type.Object({ type: Type.Literal('rectangle'), radius: Type.Ref(CornerRadii) }),
    Type.Object({ type: Type.Literal('ellipse') }),
    Type.Object({
      type: Type.Literal('polygon'),
      sides: Type.Integer({ minimum: 3, maximum: 100 }),
      phase: Type.Number(),
    }),
    Type.Object({
      type: Type.Literal('star'),
      points: Type.Integer({ minimum: 3, maximum: 100 }),
      innerRadius: Type.Number({ exclusiveMinimum: 0, exclusiveMaximum: 1 }),
      phase: Type.Number(),
      roundness: Type.Number({ minimum: 0, maximum: 1 }),
    }),
  ],
  { $id: 'ShapeGeometry' },
)

const ElementFields = {
  x: Type.Number(),
  y: Type.Number(),
  rotation: Type.Number(),
  z: Type.Integer(),
  opacity: Type.Number({ minimum: 0, maximum: 1 }),
  locked: Type.Boolean(),
  hidden: Type.Boolean(),
}

const InputId = Type.Optional(Type.String())
const ResponseId = Type.String()

const ShapeData = Type.Object({
  size: Type.Ref(Size),
  geometry: Type.Ref(ShapeGeometry),
  fill: Type.Union([Type.Ref(Paint), Type.Null()]),
  border: Type.Union([Type.Ref(Border), Type.Null()]),
})

const PathData = Type.Object({
  commands: Type.Array(Type.Ref(PathCommand), { minItems: 2 }),
  fill: Type.Union([Type.Ref(Paint), Type.Null()]),
  border: Type.Ref(Border),
})

const TextData = Type.Object({
  size: Type.Ref(Size),
  content: Type.Ref(RichTextContent),
  padding: Type.Object({
    top: Type.Number({ minimum: 0 }),
    right: Type.Number({ minimum: 0 }),
    bottom: Type.Number({ minimum: 0 }),
    left: Type.Number({ minimum: 0 }),
  }),
  verticalAlignment: Type.Union([
    Type.Literal('top'),
    Type.Literal('middle'),
    Type.Literal('bottom'),
  ]),
})

const ShapeElementInput = Type.Object({
  id: InputId,
  ...ElementFields,
  kind: Type.Literal('shape'),
  data: ShapeData,
})

const PathElementInput = Type.Object({
  id: InputId,
  ...ElementFields,
  kind: Type.Literal('path'),
  data: PathData,
})

const TextElementInput = Type.Object({
  id: InputId,
  ...ElementFields,
  kind: Type.Literal('text'),
  data: TextData,
})

const ShapeElementResponse = Type.Object({
  id: ResponseId,
  ...ElementFields,
  kind: Type.Literal('shape'),
  data: ShapeData,
})

const PathElementResponse = Type.Object({
  id: ResponseId,
  ...ElementFields,
  kind: Type.Literal('path'),
  data: PathData,
})

const TextElementResponse = Type.Object({
  id: ResponseId,
  ...ElementFields,
  kind: Type.Literal('text'),
  data: TextData,
})

export const ElementInput = Type.Union([ShapeElementInput, PathElementInput, TextElementInput], {
  $id: 'ElementInput',
})

export const ElementResponse = Type.Union(
  [ShapeElementResponse, PathElementResponse, TextElementResponse],
  { $id: 'ElementResponse' },
)

export const PageInput = Type.Object(
  {
    id: Type.Optional(Type.Union([Type.Integer({ minimum: 1 }), Type.String()])),
    pageNumber: Type.Integer(),
    width: Type.Number(),
    height: Type.Number(),
    elements: Type.Optional(Type.Array(ElementInput)),
  },
  { $id: 'PageInput' },
)

export const PageResponse = Type.Object(
  {
    id: Type.String(),
    pageNumber: Type.Integer(),
    width: Type.Number(),
    height: Type.Number(),
    elements: Type.Array(ElementResponse),
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
export type ElementInputType = Static<typeof ElementInput>
export type PdfInput = Static<typeof PdfRequest>
