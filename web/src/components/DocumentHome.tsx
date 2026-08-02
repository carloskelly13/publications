import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api } from '../api'
import type { DocumentDraft, PageInput, PublicationDocument } from '../types'
import { DocumentCanvas } from './DocumentCanvas'

const letterPage: PageInput = {
  pageNumber: 1,
  width: 8.5,
  height: 11,
  elements: [],
}

const landscapeLetterPage: PageInput = {
  pageNumber: 1,
  width: 11,
  height: 8.5,
  elements: [],
}

const postcardPage: PageInput = {
  pageNumber: 1,
  width: 6,
  height: 4,
  elements: [],
}

const envelopePage: PageInput = {
  pageNumber: 1,
  width: 9.5,
  height: 4.125,
  elements: [],
}

const templates: Array<{ id: string; label: string; document: DocumentDraft }> = [
  {
    id: 'blank-letter',
    label: 'Portrait',
    document: { name: 'Untitled', pages: [letterPage] },
  },
  {
    id: 'blank-landscape-letter',
    label: 'Landscape',
    document: { name: 'Untitled Landscape', pages: [landscapeLetterPage] },
  },
  {
    id: 'blank-postcard',
    label: 'Postcard',
    document: { name: 'Untitled Postcard', pages: [postcardPage] },
  },
  {
    id: 'blank-number-10-envelope',
    label: 'Envelope',
    document: { name: 'Untitled Envelope', pages: [envelopePage] },
  },
]

type DocumentCardProps = {
  document: PublicationDocument
  deleting: boolean
  onDelete: (document: PublicationDocument) => void
  onRename: ({ document, name }: { document: PublicationDocument; name: string }) => Promise<void>
}

function DocumentCard({ document, deleting, onDelete, onRename }: DocumentCardProps) {
  const page = document.pages?.[0]
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(document.name ?? 'Untitled')
  const [renaming, setRenaming] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  return (
    <article className="group min-w-0" style={pageCardStyle({ page })}>
      <div className="flex h-52 w-full items-end justify-start">
        <div
          className="relative overflow-hidden rounded-lg shadow-sm"
          style={pagePreviewStyle({ page })}
        >
          {document.id ? (
            <Link
              className="flex size-full items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
              to={`/documents/${document.id}/edit`}
              aria-label={`Open ${document.name ?? 'Untitled'}`}
            >
              {page ? (
                <DocumentCanvas
                  page={page}
                  title={document.name ?? 'Untitled'}
                  className="block size-full bg-white"
                />
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500">No pages</span>
              )}
            </Link>
          ) : (
            <div className="flex size-full items-center justify-center">
              {page ? (
                <DocumentCanvas
                  page={page}
                  title={document.name ?? 'Untitled'}
                  className="block size-full bg-white"
                />
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500">No pages</span>
              )}
            </div>
          )}
          <button
            className="absolute right-2 top-2 grid size-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 opacity-0 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 group-hover:opacity-100 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
            type="button"
            aria-label={`Delete ${document.name ?? 'Untitled'}`}
            onClick={() => onDelete(document)}
            disabled={deleting}
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
      {editing ? (
        <div className="mt-3">
          <input
            className="h-8 w-full rounded-md border border-violet-500 bg-white px-2 text-sm font-medium text-gray-900 outline-none ring-2 ring-violet-100 dark:bg-gray-900 dark:text-gray-100 dark:ring-violet-950"
            value={name}
            aria-label="Document name"
            autoFocus
            disabled={renaming}
            onChange={(event) => {
              setName(event.target.value)
              setValidationError(null)
            }}
            onBlur={() => {
              if (!renaming) {
                setName(document.name ?? 'Untitled')
                setValidationError(null)
                setEditing(false)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void submitRename()
              }
              if (event.key === 'Escape') {
                setName(document.name ?? 'Untitled')
                setValidationError(null)
                setEditing(false)
              }
            }}
          />
          {validationError && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationError}</p>
          )}
        </div>
      ) : (
        <button
          className="mt-3 block w-full truncate text-center text-sm font-medium text-gray-900 hover:text-violet-600 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:text-gray-100 dark:hover:text-violet-400"
          type="button"
          title="Rename document"
          onClick={() => setEditing(true)}
        >
          {document.name ?? 'Untitled'}
        </button>
      )}
      <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
        {document.updatedAt
          ? `Updated ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(document.updatedAt))}`
          : 'Recently created'}
      </p>
    </article>
  )

  async function submitRename() {
    const nextName = name.trim()
    if (nextName.length < 2) {
      setValidationError('Use at least 2 characters.')
      return
    }
    if (nextName === document.name) {
      setEditing(false)
      return
    }

    setRenaming(true)
    setValidationError(null)
    try {
      await onRename({ document, name: nextName })
      setEditing(false)
    } catch (reason) {
      setValidationError(reason instanceof Error ? reason.message : 'Unable to rename.')
    } finally {
      setRenaming(false)
    }
  }
}

export function DocumentHome() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PublicationDocument | null>(null)
  const documentsQuery = api.useInfiniteQuery(
    'get',
    '/api/documents',
    { params: { query: { size: 4 } } },
    {
      pageParamName: 'page',
      initialPageParam: 0,
      getNextPageParam: (lastPage) => (lastPage.hasNext ? (lastPage.page ?? 0) + 1 : undefined),
    },
  )
  const createMutation = api.useMutation('post', '/api/documents', {
    onSuccess: refreshDocuments,
  })
  const renameMutation = api.useMutation('patch', '/api/documents/{id}', {
    onSuccess: refreshDocuments,
  })
  const deleteMutation = api.useMutation('delete', '/api/documents/{id}', {
    onSuccess: refreshDocuments,
  })
  const documents = (documentsQuery.data?.pages ?? []).flatMap((page) => page.items ?? [])
  const error: unknown =
    documentsQuery.error ?? createMutation.error ?? renameMutation.error ?? deleteMutation.error

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-gray-100 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section aria-labelledby="saved-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 id="saved-heading" className="text-xl font-semibold tracking-tight">
                Saved documents
              </h1>
            </div>
          </div>

          {documentsQuery.isPending ? (
            <div className="mt-6 flex flex-wrap gap-6">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex h-52 items-end justify-start"
                  style={pageCardStyle({ page: letterPage })}
                >
                  <div className="h-full aspect-[8.5/11] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-8">
              {documents.map((document, index) => (
                <DocumentCard
                  key={document.id ?? index}
                  document={document}
                  deleting={deleteMutation.isPending}
                  onDelete={setPendingDelete}
                  onRename={renameDocument}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-medium">No saved documents yet</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose a template below to create your first one.
              </p>
            </div>
          )}

          {documentsQuery.hasNextPage && (
            <button
              className="mt-8 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              type="button"
              onClick={() => void documentsQuery.fetchNextPage()}
              disabled={documentsQuery.isFetchingNextPage}
            >
              {documentsQuery.isFetchingNextPage ? 'Loading…' : 'Load more'}
            </button>
          )}
        </section>

        <section
          className="mt-12 border-t border-gray-200 pt-10 dark:border-gray-800"
          aria-labelledby="templates-heading"
        >
          <h2 id="templates-heading" className="text-lg font-semibold tracking-tight">
            New from templates
          </h2>
          <div className="mt-6 flex flex-wrap gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                className="group min-w-0 text-center disabled:cursor-wait disabled:opacity-60"
                style={pageCardStyle({ page: template.document.pages[0] })}
                type="button"
                onClick={() => createFromTemplate(template)}
                disabled={createMutation.isPending}
              >
                <div className="flex h-52 w-full items-end justify-start">
                  <div
                    className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm transition group-hover:border-violet-500 group-hover:ring-2 group-hover:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:border-violet-400 dark:group-hover:ring-violet-950"
                    style={pagePreviewStyle({ page: template.document.pages[0] })}
                  >
                    <DocumentCanvas
                      page={template.document.pages[0]!}
                      title={template.label}
                      className="block size-full bg-white"
                    />
                  </div>
                </div>
                <span className="mt-3 block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {creatingTemplateId === template.id ? 'Creating…' : template.label}
                </span>
                <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                  {pageSizeLabel({ page: template.document.pages[0] })}
                </span>
              </button>
            ))}
          </div>
        </section>

        {error && (
          <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error instanceof Error ? error.message : 'Unable to complete this action'}
          </p>
        )}
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-gray-950/40 px-4"
          role="presentation"
        >
          <section
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
          >
            <div className="grid size-10 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Trash2 size={19} aria-hidden="true" />
            </div>
            <h2 id="delete-title" className="mt-4 text-lg font-semibold">
              Delete document?
            </h2>
            <p
              id="delete-description"
              className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
            >
              “{pendingDelete.name ?? 'Untitled'}” will be permanently deleted. This action cannot
              be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleteMutation.isPending}
                autoFocus
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                type="button"
                onClick={deleteDocument}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )

  function refreshDocuments() {
    return queryClient.invalidateQueries({ queryKey: ['get', '/api/documents'] })
  }

  async function createFromTemplate(template: (typeof templates)[number]) {
    setCreatingTemplateId(template.id)
    try {
      const document = await createMutation.mutateAsync({ body: template.document })
      if (document.id) {
        navigate(`/documents/${document.id}/edit`)
      }
    } catch {
      // The mutation exposes the failure through its error state
    } finally {
      setCreatingTemplateId(null)
    }
  }

  async function renameDocument({
    document,
    name,
  }: {
    document: PublicationDocument
    name: string
  }) {
    if (!document.id) {
      throw new Error('This document has no identifier.')
    }
    await renameMutation.mutateAsync({
      params: { path: { id: document.id } },
      body: { name },
    })
  }

  async function deleteDocument() {
    if (!pendingDelete?.id) {
      return
    }
    await deleteMutation.mutateAsync({ params: { path: { id: pendingDelete.id } } })
    setPendingDelete(null)
  }
}

function pagePreviewStyle({ page }: { page: PageInput | undefined }) {
  const width = page?.width ?? 8.5
  const height = page?.height ?? 11
  return {
    aspectRatio: `${width} / ${height}`,
    ...(width > height ? { width: '100%' } : { height: '100%' }),
  }
}

function pageCardStyle({ page }: { page: PageInput | undefined }) {
  const width = page?.width ?? 8.5
  const height = page?.height ?? 11
  return { width: `${13 * Math.min(1, width / height)}rem` }
}

function pageSizeLabel({ page }: { page: PageInput | undefined }) {
  return `${page?.width ?? 8.5} × ${page?.height ?? 11} in`
}
