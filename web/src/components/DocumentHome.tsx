import { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { csrfHeaders } from '../api'
import type { DocumentDraft, DocumentPage, PageInput, PublicationDocument } from '../types'
import { DocumentCanvas } from './DocumentCanvas'

const letterPage: PageInput = {
  pageNumber: 1,
  width: 8.5,
  height: 11,
  shapes: [],
}

const templates: Array<{ id: string; label: string; document: DocumentDraft }> = [
  {
    id: 'blank-letter',
    label: 'Blank',
    document: { name: 'Untitled', pages: [letterPage] },
  },
  {
    id: 'blue-rectangle',
    label: 'Blue rectangle',
    document: {
      name: 'Blue Rectangle',
      pages: [{
        ...letterPage,
        shapes: [{
          type: 'rect', x: 1, y: 1, width: 4, height: 2, z: 1,
          radiusTopLeft: 0, radiusTopRight: 0, radiusBottomRight: 0, radiusBottomLeft: 0, rotation: 0,
          fill: '#60a5fa', fillOpacity: 1, stroke: '#1d4ed8', strokeWidth: 2, strokeOpacity: 1,
        }],
      }],
    },
  },
]

type DocumentCardProps = {
  document: PublicationDocument
  deleting: boolean
  onDelete: (document: PublicationDocument) => void
  onRename: (document: PublicationDocument, name: string) => Promise<void>
}

function DocumentCard({ document, deleting, onDelete, onRename }: DocumentCardProps) {
  const page = document.pages?.[0]
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(document.name ?? 'Untitled')
  const [renaming, setRenaming] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const submitRename = async () => {
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
      await onRename(document, nextName)
      setEditing(false)
    } catch (reason) {
      setValidationError(reason instanceof Error ? reason.message : 'Unable to rename.')
    } finally {
      setRenaming(false)
    }
  }

  return (
    <article className="group min-w-0">
      <div className="relative h-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {document.id ? (
          <Link
            className="flex size-full items-center justify-center p-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600"
            to={`/documents/${document.id}/edit`}
            aria-label={`Open ${document.name ?? 'Untitled'}`}
          >
            {page ? <DocumentCanvas page={page} title={document.name ?? 'Untitled'} /> : <span className="text-sm text-gray-400 dark:text-gray-500">No pages</span>}
          </Link>
        ) : (
          <div className="flex size-full items-center justify-center p-3">
            {page ? <DocumentCanvas page={page} title={document.name ?? 'Untitled'} /> : <span className="text-sm text-gray-400 dark:text-gray-500">No pages</span>}
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
          {validationError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationError}</p>}
        </div>
      ) : (
        <button
          className="mt-3 block max-w-full truncate text-left text-sm font-medium text-gray-900 hover:text-violet-600 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:text-gray-100 dark:hover:text-violet-400"
          type="button"
          title="Rename document"
          onClick={() => setEditing(true)}
        >
          {document.name ?? 'Untitled'}
        </button>
      )}
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {document.updatedAt
          ? `Updated ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(document.updatedAt))}`
          : 'Recently created'}
      </p>
    </article>
  )
}

export function DocumentHome() {
  const [documents, setDocuments] = useState<PublicationDocument[]>([])
  const [pageNumber, setPageNumber] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [creating, setCreating] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PublicationDocument | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDocuments = useCallback(async (page: number, append: boolean, signal?: AbortSignal) => {
    const response = await fetch(`/api/documents?page=${page}&size=4`, { credentials: 'include', signal })
    if (!response.ok) throw new Error('Unable to load your saved documents.')
    const result = (await response.json()) as DocumentPage
    const items = Array.isArray(result.items) ? result.items : []
    setDocuments((current) => append ? [...current, ...items] : items)
    setPageNumber(result.page ?? page)
    setHasNext(result.hasNext ?? false)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    loadDocuments(0, false, controller.signal)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        setError(reason instanceof Error ? reason.message : 'Unable to load documents.')
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [loadDocuments])

  const loadMore = async () => {
    setLoadingMore(true)
    setError(null)
    try {
      await loadDocuments(pageNumber + 1, true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load more documents.')
    } finally {
      setLoadingMore(false)
    }
  }

  const createFromTemplate = async (template: (typeof templates)[number]) => {
    setCreating(template.id)
    setError(null)
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(await csrfHeaders()) },
        body: JSON.stringify(template.document),
      })
      if (!response.ok) throw new Error('Unable to create the document.')
      await loadDocuments(0, false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to create the document.')
    } finally {
      setCreating(null)
    }
  }

  const renameDocument = async (document: PublicationDocument, name: string) => {
    if (!document.id) throw new Error('This document has no identifier.')
    const response = await fetch(`/api/documents/${document.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(await csrfHeaders()) },
      body: JSON.stringify({ name }),
    })
    if (!response.ok) throw new Error('Unable to rename the document.')
    const updated = (await response.json()) as PublicationDocument
    setDocuments((current) => current.map((item) => item.id === updated.id ? updated : item))
  }

  const deleteDocument = async () => {
    if (!pendingDelete?.id) return
    setDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/documents/${pendingDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: await csrfHeaders(),
      })
      if (!response.ok) throw new Error('Unable to delete the document.')
      setPendingDelete(null)
      await loadDocuments(0, false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete the document.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section aria-labelledby="saved-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Your workspace</p>
              <h1 id="saved-heading" className="mt-1 text-3xl font-semibold tracking-tight">Saved documents</h1>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
              {[0, 1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />)}
            </div>
          ) : documents.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
              {documents.map((document, index) => (
                <DocumentCard
                  key={document.id ?? index}
                  document={document}
                  deleting={deleting}
                  onDelete={setPendingDelete}
                  onRename={renameDocument}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-medium">No saved documents yet</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a template below to create your first one.</p>
            </div>
          )}

          {hasNext && (
            <button
              className="mt-8 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </section>

        <section className="mt-12 border-t border-gray-200 pt-10 dark:border-gray-800" aria-labelledby="templates-heading">
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400">Start something new</p>
          <h2 id="templates-heading" className="mt-1 text-2xl font-semibold tracking-tight">New from templates</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {templates.map((template) => (
              <button
                key={template.id}
                className="group min-w-0 text-left disabled:cursor-wait disabled:opacity-60"
                type="button"
                onClick={() => createFromTemplate(template)}
                disabled={creating !== null}
              >
                <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100 p-3 shadow-sm transition group-hover:border-violet-500 group-hover:ring-2 group-hover:ring-violet-100 dark:border-gray-700 dark:bg-gray-900 dark:group-hover:border-violet-400 dark:group-hover:ring-violet-950">
                  <DocumentCanvas page={template.document.pages[0]!} title={template.label} />
                </div>
                <span className="mt-3 block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {creating === template.id ? 'Creating…' : template.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {error && <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-gray-950/40 px-4" role="presentation">
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
            <h2 id="delete-title" className="mt-4 text-lg font-semibold">Delete document?</h2>
            <p id="delete-description" className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              “{pendingDelete.name ?? 'Untitled'}” will be permanently deleted. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                autoFocus
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                type="button"
                onClick={deleteDocument}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
