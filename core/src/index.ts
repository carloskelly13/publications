import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import { Type } from '@sinclair/typebox'
import { del, get, head } from '@vercel/blob'
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client'
import Fastify from 'fastify'
import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { registerAuthRoutes, authenticate, verifyCsrf } from './auth.js'
import { config } from './config.js'
import {
  createDocument,
  createDocumentAsset,
  completeDocumentAsset,
  deleteDocumentAssets,
  deleteDocument,
  getDocumentAsset,
  getDocument,
  initializeDatabase,
  listDocuments,
  listDocumentAssetPathnames,
  listUnreferencedDocumentAssets,
  renameDocument,
  updateDocument,
} from './database.js'
import { HttpError } from './errors.js'
import { renderPdf } from './pdf.js'
import {
  AssetCompleteRequest,
  AssetResponse,
  AssetUploadRequest,
  AssetUploadResponse,
  Border,
  CornerRadii,
  CsrfResponse,
  DocumentPageResponse,
  DocumentRequest,
  DocumentResponse,
  ElementInput,
  ElementResponse,
  PageInput,
  PageResponse,
  Paint,
  PathCommand,
  PdfRequest,
  RenameDocumentRequest,
  RichTextContent,
  ShapeGeometry,
  Size,
  UserResponse,
  type DocumentInput,
  type AssetCompleteInput,
  type AssetUploadInput,
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
  Paint,
  Border,
  Size,
  CornerRadii,
  PathCommand,
  ShapeGeometry,
  ElementInput,
  ElementResponse,
  PageInput,
  PageResponse,
  DocumentRequest,
  DocumentResponse,
  DocumentPageResponse,
  RenameDocumentRequest,
  AssetUploadRequest,
  AssetUploadResponse,
  AssetCompleteRequest,
  AssetResponse,
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
  const exposeMessage = statusCode < 500 || process.env.NODE_ENV !== 'production'
  if (statusCode >= 500) {
    request.log.error({ err: error }, 'Request failed')
  }
  return reply.code(statusCode).send({
    statusCode,
    error: statusCode >= 500 ? 'Internal Server Error' : errorName,
    message: exposeMessage ? errorMessage : 'The request could not be completed.',
  })
})

app.get('/v3/api-docs', { schema: { hide: true } }, async () => app.swagger())

app.get('/actuator/health', async () => {
  await initializeDatabase()
  return { status: 'UP' }
})

await registerAuthRoutes({ app })

const IdParams = Type.Object({ id: Type.String({ pattern: '^[0-9]+$' }) })
const AssetParams = Type.Object({
  id: Type.String({ pattern: '^[0-9]+$' }),
  assetId: Type.String({ minLength: 36, maxLength: 36 }),
})
const AssetIdParams = Type.Object({ assetId: Type.String({ minLength: 36, maxLength: 36 }) })
const ListQuery = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 0, default: 0 })),
  size: Type.Optional(Type.Integer({ minimum: 1, maximum: 20, default: 4 })),
  search: Type.Optional(Type.String({ maxLength: 100 })),
  sort: Type.Optional(Type.Union([Type.Literal('updatedAt'), Type.Literal('name')])),
  direction: Type.Optional(Type.Union([Type.Literal('asc'), Type.Literal('desc')])),
})

app.get<{
  Querystring: {
    page?: number
    size?: number
    search?: string
    sort?: 'updatedAt' | 'name'
    direction?: 'asc' | 'desc'
  }
}>(
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
      search: request.query.search,
      sort: request.query.sort ?? 'updatedAt',
      direction: request.query.direction ?? 'desc',
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

app.post<{ Params: { id: string }; Body: AssetUploadInput }>(
  '/api/documents/:id/assets/upload-token',
  {
    preHandler: verifyCsrf,
    schema: {
      params: IdParams,
      body: Type.Ref(AssetUploadRequest),
      response: { 201: Type.Ref(AssetUploadResponse) },
    },
  },
  async (request, reply) => {
    const assetId = randomUUID()
    const filename = safeAssetFilename({ filename: request.body.filename })
    const pathname = `documents/${request.currentSession!.user.id}/${request.params.id}/${assetId}-${filename}`
    const clientToken = await generateClientTokenFromReadWriteToken({
      token: config.blobReadWriteToken,
      pathname,
      allowedContentTypes: [request.body.contentType],
      maximumSizeInBytes: request.body.byteSize,
      validUntil: Date.now() + 10 * 60 * 1000,
      addRandomSuffix: false,
      allowOverwrite: false,
    })
    const asset = await createDocumentAsset({
      id: assetId,
      documentId: request.params.id,
      userId: request.currentSession!.user.id,
      pathname,
      contentType: request.body.contentType,
      byteSize: request.body.byteSize,
    })
    if (!asset) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    return reply.code(201).send({ id: assetId, pathname, clientToken })
  },
)

app.post<{ Params: { id: string; assetId: string }; Body: AssetCompleteInput }>(
  '/api/documents/:id/assets/:assetId/complete',
  {
    preHandler: verifyCsrf,
    schema: {
      params: AssetParams,
      body: Type.Ref(AssetCompleteRequest),
      response: { 200: Type.Ref(AssetResponse) },
    },
  },
  async (request) => {
    let blob
    try {
      blob = await head(request.body.pathname, { token: config.blobReadWriteToken })
    } catch {
      throw new HttpError({ statusCode: 400, message: 'The uploaded image is unavailable.' })
    }
    const asset = await completeDocumentAsset({
      id: request.params.assetId,
      documentId: request.params.id,
      userId: request.currentSession!.user.id,
      pathname: blob.pathname,
      contentType: blob.contentType,
      byteSize: blob.size,
      width: request.body.width,
      height: request.body.height,
    })
    if (!asset) {
      throw new HttpError({ statusCode: 400, message: 'The uploaded image does not match.' })
    }
    return documentAssetResponse({ asset })
  },
)

app.get<{ Params: { assetId: string } }>(
  '/api/assets/:assetId',
  {
    preHandler: authenticate,
    schema: { params: AssetIdParams },
  },
  async (request, reply) => {
    const asset = await getDocumentAsset({
      id: request.params.assetId,
      userId: request.currentSession!.user.id,
    })
    if (!asset) {
      throw new HttpError({ statusCode: 404, message: 'Image not found.' })
    }
    const result = await get(asset.pathname, {
      access: 'private',
      token: config.blobReadWriteToken,
      ifNoneMatch: request.headers['if-none-match'],
    })
    if (!result) {
      throw new HttpError({ statusCode: 404, message: 'Image not found.' })
    }
    reply.header('Cache-Control', 'private, no-cache').header('ETag', result.blob.etag)
    if (result.statusCode === 304 || !result.stream) {
      return reply.code(304).send()
    }
    return reply
      .type(result.blob.contentType ?? asset.contentType)
      .header('X-Content-Type-Options', 'nosniff')
      .send(Readable.fromWeb(result.stream as Parameters<typeof Readable.fromWeb>[0]))
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
    const retainedAssetIds = [
      ...new Set(
        request.body.pages.flatMap((page) =>
          (page.elements ?? []).flatMap((element) =>
            element.kind === 'image' ? [element.data.assetId] : [],
          ),
        ),
      ),
    ]
    const document = await updateDocument({
      id: request.params.id,
      userId: request.currentSession!.user.id,
      input: request.body,
    })
    if (!document) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    const unreferencedAssets = await listUnreferencedDocumentAssets({
      documentId: request.params.id,
      userId: request.currentSession!.user.id,
      retainedAssetIds,
    })
    if (unreferencedAssets && unreferencedAssets.length > 0) {
      await del(
        unreferencedAssets.map(({ pathname }) => pathname),
        { token: config.blobReadWriteToken },
      )
      await deleteDocumentAssets({
        documentId: request.params.id,
        assetIds: unreferencedAssets.map(({ id }) => id),
      })
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
    const assetPathnames = await listDocumentAssetPathnames({
      documentId: request.params.id,
      userId: request.currentSession!.user.id,
    })
    if (!assetPathnames) {
      throw new HttpError({ statusCode: 404, message: 'Document not found.' })
    }
    if (assetPathnames.length > 0) {
      await del(assetPathnames, { token: config.blobReadWriteToken })
    }
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
    const pdf = await renderPdf({
      input: {
        ...request.body,
        svg: await hydratePdfAssets({
          svg: request.body.svg,
          userId: request.currentSession!.user.id,
        }),
      },
    })
    const filename = `${document.name.replace(/[\r\n\\/]/g, '_')}.pdf`
    return reply
      .type('application/pdf')
      .header('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
      .send(pdf)
  },
)

void app.listen({ port: config.port, host: '0.0.0.0' })

function safeAssetFilename({ filename }: { filename: string }) {
  const normalized = filename
    .normalize('NFKC')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .slice(-120)
  return normalized || 'image'
}

function documentAssetResponse({
  asset,
}: {
  asset: Awaited<ReturnType<typeof completeDocumentAsset>>
}) {
  if (!asset || asset.width === null || asset.height === null) {
    throw new Error('The image asset is incomplete.')
  }
  return {
    id: asset.id,
    documentId: asset.documentId.toString(),
    pathname: asset.pathname,
    contentType: asset.contentType,
    byteSize: asset.byteSize,
    width: asset.width,
    height: asset.height,
  }
}

async function hydratePdfAssets({ svg, userId }: { svg: string; userId: string }) {
  const assetIds = [
    ...new Set(
      Array.from(svg.matchAll(/\/api\/assets\/([0-9a-f-]{36})/gi)).flatMap((match) =>
        match[1] ? [match[1]] : [],
      ),
    ),
  ]
  const replacements = await Promise.all(
    assetIds.map(async (assetId) => {
      const asset = await getDocumentAsset({ id: assetId, userId })
      if (!asset) {
        throw new HttpError({ statusCode: 400, message: 'A PDF image is unavailable.' })
      }
      const result = await get(asset.pathname, {
        access: 'private',
        token: config.blobReadWriteToken,
      })
      if (!result?.stream) {
        throw new HttpError({ statusCode: 400, message: 'A PDF image is unavailable.' })
      }
      const bytes = Buffer.from(await new Response(result.stream).arrayBuffer())
      const dataUrl = `data:${asset.contentType};base64,${bytes.toString('base64')}`
      return { assetId, dataUrl }
    }),
  )
  let hydrated = svg
  replacements.forEach(({ assetId, dataUrl }) => {
    hydrated = hydrated.replaceAll(`/api/assets/${assetId}`, dataUrl)
  })
  return hydrated
}
