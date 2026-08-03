import {
  bigint,
  bigserial,
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import type { ElementInputType } from './schemas.js'

type ElementKind = ElementInputType['kind']
type ElementData = ElementInputType['data']

export const users = pgTable(
  'users',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    googleSubject: varchar('google_subject', { length: 255 }).notNull(),
    email: varchar('email', { length: 320 }).notNull(),
    displayName: varchar('display_name', { length: 255 }).notNull(),
  },
  (table) => [uniqueIndex('users_google_subject_key').on(table.googleSubject)],
)

export const documents = pgTable(
  'documents',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    userId: bigint('user_id', { mode: 'bigint' })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    name: varchar('name', { length: 255 }),
  },
  (table) => [index('documents_user_id_idx').on(table.userId)],
)

export const pages = pgTable(
  'pages',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    documentId: bigint('document_id', { mode: 'bigint' })
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    pageNumber: integer('page_number'),
    width: doublePrecision('width'),
    height: doublePrecision('height'),
  },
  (table) => [index('pages_document_id_idx').on(table.documentId)],
)

export const documentAssets = pgTable(
  'document_assets',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    documentId: bigint('document_id', { mode: 'bigint' })
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    pathname: varchar('pathname', { length: 1024 }).notNull(),
    contentType: varchar('content_type', { length: 100 }).notNull(),
    byteSize: integer('byte_size').notNull(),
    width: integer('width'),
    height: integer('height'),
    uploaded: boolean('uploaded').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('document_assets_document_id_idx').on(table.documentId),
    uniqueIndex('document_assets_pathname_key').on(table.pathname),
  ],
)

export const elements = pgTable(
  'elements',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey(),
    pageId: bigint('page_id', { mode: 'bigint' })
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    kind: varchar('kind', { length: 32 }).$type<ElementKind>().notNull(),
    x: doublePrecision('x').notNull().default(0),
    y: doublePrecision('y').notNull().default(0),
    rotation: doublePrecision('rotation').notNull().default(0),
    z: integer('z').notNull().default(0),
    opacity: doublePrecision('opacity').notNull().default(1),
    locked: boolean('locked').notNull().default(false),
    hidden: boolean('hidden').notNull().default(false),
    schemaVersion: integer('schema_version').notNull().default(1),
    data: jsonb('data').$type<ElementData>().notNull(),
  },
  (table) => [index('elements_page_id_idx').on(table.pageId)],
)

export const appSessions = pgTable(
  'app_sessions',
  {
    tokenHash: varchar('token_hash', { length: 64 }).primaryKey(),
    userId: bigint('user_id', { mode: 'bigint' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    csrfToken: varchar('csrf_token', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => [index('app_sessions_expires_at_idx').on(table.expiresAt)],
)

export const schema = { users, documents, pages, documentAssets, elements, appSessions }
