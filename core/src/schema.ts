import {
  bigint,
  bigserial,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Static } from '@sinclair/typebox'
import { PathGeometry } from './schemas.js'

type PathGeometryType = Static<typeof PathGeometry>

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  googleSubject: varchar('google_subject', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
}, (table) => [uniqueIndex('users_google_subject_key').on(table.googleSubject)])

export const documents = pgTable('documents', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  userId: bigint('user_id', { mode: 'bigint' }).notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  name: varchar('name', { length: 255 }),
}, (table) => [index('documents_user_id_idx').on(table.userId)])

export const pages = pgTable('pages', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  documentId: bigint('document_id', { mode: 'bigint' }).notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  pageNumber: integer('page_number'),
  width: doublePrecision('width'),
  height: doublePrecision('height'),
}, (table) => [index('pages_document_id_idx').on(table.documentId)])

export const shapes = pgTable('shapes', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  pageId: bigint('page_id', { mode: 'bigint' }).notNull()
    .references(() => pages.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }),
  width: doublePrecision('width'),
  height: doublePrecision('height'),
  x: doublePrecision('x'),
  y: doublePrecision('y'),
  pathGeometry: jsonb('path_geometry').$type<PathGeometryType>(),
  z: integer('z'),
  legacyRadius: doublePrecision('r'),
  radiusTopLeft: doublePrecision('radius_top_left').notNull().default(0),
  radiusTopRight: doublePrecision('radius_top_right').notNull().default(0),
  radiusBottomRight: doublePrecision('radius_bottom_right').notNull().default(0),
  radiusBottomLeft: doublePrecision('radius_bottom_left').notNull().default(0),
  rotation: doublePrecision('rotation').notNull().default(0),
  fill: varchar('fill', { length: 255 }),
  fillOpacity: doublePrecision('fill_opacity'),
  stroke: varchar('stroke', { length: 255 }),
  strokeWidth: doublePrecision('stroke_width'),
  strokeOpacity: doublePrecision('stroke_opacity'),
  text: text('text'),
  richTextContent: jsonb('rich_text_content').$type<Record<string, unknown>>(),
  contentVersion: integer('content_version').notNull().default(1),
}, (table) => [index('shapes_page_id_idx').on(table.pageId)])

export const appSessions = pgTable('app_sessions', {
  tokenHash: varchar('token_hash', { length: 64 }).primaryKey(),
  userId: bigint('user_id', { mode: 'bigint' }).notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  csrfToken: varchar('csrf_token', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
}, (table) => [index('app_sessions_expires_at_idx').on(table.expiresAt)])

export const schema = { users, documents, pages, shapes, appSessions }
