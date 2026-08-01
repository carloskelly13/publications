import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import { Type } from '@sinclair/typebox'
import Fastify from 'fastify'
import { registerAuthRoutes, authenticate, verifyCsrf } from './auth.js'
import { config } from './config.js'
import {
  createDocument,
  deleteDocument,
  getDocument,
  initializeDatabase,
  listDocuments,
  renameDocument,
  updateDocument,
} from './database.js'
import { HttpError } from './errors.js'
import { renderPdf } from './pdf.js'
import {
  CsrfResponse,
  DocumentPageResponse,
  DocumentRequest,
  DocumentResponse,
  PageInput,
  PageResponse,
  PdfRequest,
  RenameDocumentRequest,
  RichTextContent,
  ShapeInput,
  ShapeResponse,
  UserResponse,
  type DocumentInput,
  type PdfInput,
} from './schemas.js'

const app = Fastify({
  logger: true,
  bodyLimit: 5_250_000,
  trustProxy: true,
})

await app.register(cookie, { secret: config.sessionSecret })
await app.register(cors, {
  origin: config.corsAllowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-XSRF-TOKEN'],
})
await app.register(swagger, {
  openapi: {
    info: { title: 'Publications Core API', version: '8.0.0' },
  },
  refResolver: {
    buildLocalReference: (json, _baseUri, _fragment, index) =>
      typeof json.$id === 'string' ? json.$id : `def-${index}`,
  },
})

for (const schema of [
  RichTextContent,
  ShapeInput,
  ShapeResponse,
  PageInput,
  PageResponse,
  DocumentRequest,
  DocumentResponse,
  DocumentPageResponse,
  RenameDocumentRequest,
  PdfRequest,
  UserResponse,
  CsrfResponse,
]) {
  app.addSchema(schema)
}

app.setErrorHandler((error: unknown, request, reply) => {
  const validationError = typeof error === 'object' && error !== null && 'validation' in error
  const errorName = error instanceof Error ? error.name : 'Error'
  const errorMessage =
    error instanceof Error ? error.message : 'The request could not be completed.'
  const statusCode = error instanceof HttpError ? error.statusCode : validationError ? 400 : 500
  if (statusCode >= 500) {
    request.log.error({ err: error }, 'Request failed')
  }
  return reply.code(statusCode).send({
    statusCode,
    error: statusCode >= 500 ? 'Internal Server Error' : errorName,
    message: statusCode >= 500 ? 'The request could not be completed.' : errorMessage,
  })
})

app.get('/v3/api-docs', { schema: { hide: true } }, async () => app.swagger())

app.get('/actuator/health', async () => {
  await initializeDatabase()
  return { status: 'UP' }
})

await registerAuthRoutes({ app })

const IdParams = Type.Object({ id: Type.String({ pattern: '^[0-9]+$' }) })
const ListQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
  size: Type.Optional(Type.Integer({ minimum: 1, maximum: 20, default: 4 })),
})

app.get<{ Querystring: { page?: number; size?: number } }>(
  '/api/documents',
  {
    preHandler: authenticate,
    schema: {
      querystring: ListQuery,
      response: { 200: Type.Ref(DocumentPageResponse) },
    },
  },
  async (request) =>
    listDocuments({
      userId: request.currentSession!.user.id,
      page: request.query.page ?? 0,
      size: request.query.size ?? 4,
    }),
)

app.get<{ Params: { id: string } }>(
  '/api/documents/:id',
  {
    preHandler: authenticate,
    schema: { params: IdParams, response: { 200: Type.Ref(DocumentResponse) } },
  },
  async (request) => {
    const document = await getDocument({
      id: request.params.id,
      userId: request.currentSession!.user.id,
    })
    if (!document) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    return document
  },
)

app.post<{ Body: DocumentInput }>(
  '/api/documents',
  {
    preHandler: verifyCsrf,
    schema: { body: Type.Ref(DocumentRequest), response: { 201: Type.Ref(DocumentResponse) } },
  },
  async (request, reply) => {
    const document = await createDocument({
      userId: request.currentSession!.user.id,
      input: request.body,
    })
    return reply.code(201).send(document)
  },
)

app.put<{ Params: { id: string }; Body: DocumentInput }>(
  '/api/documents/:id',
  {
    preHandler: verifyCsrf,
    schema: {
      params: IdParams,
      body: Type.Ref(DocumentRequest),
      response: { 200: Type.Ref(DocumentResponse) },
    },
  },
  async (request) => {
    const document = await updateDocument({
      id: request.params.id,
      userId: request.currentSession!.user.id,
      input: request.body,
    })
    if (!document) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    return document
  },
)

app.patch<{ Params: { id: string }; Body: { name: string } }>(
  '/api/documents/:id',
  {
    preHandler: verifyCsrf,
    schema: {
      params: IdParams,
      body: Type.Ref(RenameDocumentRequest),
      response: { 200: Type.Ref(DocumentResponse) },
    },
  },
  async (request) => {
    const document = await renameDocument({
      id: request.params.id,
      userId: request.currentSession!.user.id,
      name: request.body.name,
    })
    if (!document) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    return document
  },
)

app.delete<{ Params: { id: string } }>(
  '/api/documents/:id',
  {
    preHandler: verifyCsrf,
    schema: { params: IdParams },
  },
  async (request, reply) => {
    const deleted = await deleteDocument({
      id: request.params.id,
      userId: request.currentSession!.user.id,
    })
    if (!deleted) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    return reply.code(204).send()
  },
)

app.post<{ Params: { id: string }; Body: PdfInput }>(
  '/api/documents/:id/pdf',
  {
    preHandler: verifyCsrf,
    schema: { params: IdParams, body: Type.Ref(PdfRequest) },
  },
  async (request, reply) => {
    const document = await getDocument({
      id: request.params.id,
      userId: request.currentSession!.user.id,
    })
    if (!document) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    const pdf = await renderPdf({ input: request.body })
    const filename = `${document.name.replace(/[\r\n\\/]/g, '_')}.pdf`
    return reply
      .type('application/pdf')
      .header('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
      .send(pdf)
  },
)

void app.listen({ port: config.port, host: '0.0.0.0' })
