import { keepPreviousData, useQueryClient } from '@tanstack/react-query'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  FileDown,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type Ref } from 'react'
import { useNavigate } from 'react-router'
import { api, fetchClient } from '../api'
import { cn } from '../lib/cn'
import type { DocumentDraft, PageInput, PublicationDocument } from '../types'
import { DocumentCanvas } from './DocumentCanvas'

const documentPageSize = 6

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

type DocumentRowProps = {
  document: PublicationDocument
  deleting: boolean
  selected: boolean
  onDelete: (document: PublicationDocument) => void
  onOpen: (document: PublicationDocument) => void
  onToggleSelect: (document: PublicationDocument) => void
  onRename: ({ document, name }: { document: PublicationDocument; name: string }) => Promise<void>
  registerDownload: ({ id, download }: { id: string; download: () => Promise<void> }) => () => void
  selectionMode: boolean
}

function DocumentRow({
  document,
  deleting,
  selected,
  onDelete,
  onOpen,
  onToggleSelect,
  onRename,
  registerDownload,
  selectionMode,
}: DocumentRowProps) {
  const page = document.pages?.[0]
  const previewRef = useRef<SVGSVGElement>(null)
  const downloadPdfRef = useRef<() => Promise<void>>(() => Promise.resolve())
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(document.name ?? 'Untitled')
  const [renaming, setRenaming] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  downloadPdfRef.current = downloadPdf

  useEffect(() => {
    if (!document.id) {
      return
    }
    return registerDownload({ id: document.id, download: () => downloadPdfRef.current() })
  }, [document.id, registerDownload])

  return (
    <tr
      className={cn(
        'group h-[60px] border-b border-gray-200 last:border-b-0 hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-600 dark:border-gray-800 dark:hover:bg-gray-800/50',
        selectionMode ? 'cursor-default' : 'cursor-pointer',
      )}
      tabIndex={0}
      aria-label={
        selectionMode
          ? `Select ${document.name ?? 'Untitled'}`
          : `Open ${document.name ?? 'Untitled'}`
      }
      onClick={() => {
        if (!selectionMode) {
          onOpen(document)
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !selectionMode) {
          onOpen(document)
        }
      }}
    >
      <td className={cn(selectionMode ? 'w-24' : 'w-16', 'py-2 pl-3 pr-2 sm:pl-4')}>
        <div className={cn('flex items-center', selectionMode ? 'gap-3' : 'gap-0')}>
          {selectionMode && (
            <SelectCheckbox
              checked={selected}
              label={`Select ${document.name ?? 'Untitled'}`}
              onChange={() => onToggleSelect(document)}
            />
          )}
          <DocumentThumbnail document={document} canvasRef={previewRef} />
        </div>
      </td>
      <td className="min-w-0 px-2 py-2">
        {editing ? (
          <div
            className="max-w-xl"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-1.5">
              <input
                className="h-8 min-w-0 flex-1 rounded-md border border-violet-500 bg-white px-2 text-sm font-medium text-gray-900 outline-none ring-2 ring-violet-100 dark:bg-gray-900 dark:text-gray-100 dark:ring-violet-950"
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
                    cancelRename()
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void submitRename()
                  }
                  if (event.key === 'Escape') {
                    cancelRename()
                  }
                }}
              />
              <button
                className="grid size-8 shrink-0 place-items-center rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
                type="button"
                aria-label="Save name"
                title="Save name"
                disabled={renaming}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => void submitRename()}
              >
                {renaming ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="size-4" aria-hidden="true" />
                )}
              </button>
              <button
                className="grid size-8 shrink-0 place-items-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                type="button"
                aria-label="Cancel rename"
                title="Cancel rename"
                disabled={renaming}
                onPointerDown={(event) => event.preventDefault()}
                onClick={cancelRename}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            {validationError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationError}</p>
            )}
          </div>
        ) : (
          <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {document.name ?? 'Untitled'}
          </span>
        )}
        {downloadError && <p className="mt-1 text-xs text-red-600">{downloadError}</p>}
      </td>
      <td className="hidden whitespace-nowrap px-3 py-2 text-sm text-gray-500 sm:table-cell dark:text-gray-400">
        {pageSizeLabel({ page })}
      </td>
      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        {document.updatedAt
          ? new Intl.DateTimeFormat(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(document.updatedAt))
          : 'Recently created'}
      </td>
      <td
        className="w-12 py-2 pl-2 pr-3 text-right sm:pr-4"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="grid size-8 place-items-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              type="button"
              aria-label={`Actions for ${document.name ?? 'Untitled'}`}
            >
              {downloading ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <MoreHorizontal className="size-4" aria-hidden="true" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-gray-700 dark:bg-gray-900"
              sideOffset={4}
              align="end"
            >
              <DocumentAction icon={Pencil} label="Rename" onSelect={() => setEditing(true)} />
              <DocumentAction
                icon={FileDown}
                label={downloading ? 'Downloading…' : 'Download PDF'}
                disabled={downloading || !page}
                onSelect={() => void downloadPdf()}
              />
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <DocumentAction
                icon={Trash2}
                label="Delete"
                destructive
                disabled={deleting}
                onSelect={() => onDelete(document)}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </td>
    </tr>
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

  function cancelRename() {
    setName(document.name ?? 'Untitled')
    setValidationError(null)
    setEditing(false)
  }

  async function downloadPdf() {
    if (!document.id || !page || !previewRef.current) {
      return
    }
    setDownloading(true)
    setDownloadError(null)
    try {
      const svg = new XMLSerializer().serializeToString(previewRef.current)
      const { data: pdf } = await fetchClient.POST('/api/documents/{id}/pdf', {
        params: { path: { id: document.id } },
        body: { svg, width: page.width ?? 8.5, height: page.height ?? 11 },
        parseAs: 'blob',
      })
      if (!(pdf instanceof Blob)) {
        throw new Error('Unable to download PDF')
      }
      const url = URL.createObjectURL(pdf)
      const link = window.document.createElement('a')
      link.href = url
      link.download = `${(document.name ?? 'Untitled').replace(/[\\/:*?"<>|]/g, '_')}.pdf`
      window.document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (reason) {
      console.error('PDF download failed', reason)
      setDownloadError(reason instanceof Error ? reason.message : 'Unable to download PDF')
    } finally {
      setDownloading(false)
    }
  }
}

function DocumentThumbnail({
  document,
  canvasRef,
}: {
  document: PublicationDocument
  canvasRef?: Ref<SVGSVGElement>
}) {
  const page = document.pages?.[0]

  return (
    <div className="flex h-11 w-11 items-center justify-center">
      {page ? (
        <div
          className="flex max-h-full max-w-full items-center justify-center overflow-hidden rounded-sm bg-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
          style={thumbnailStyle({ page })}
        >
          <DocumentCanvas
            ref={canvasRef}
            page={page}
            title={document.name ?? 'Untitled'}
            pixelsPerInch={72}
            className="block size-full bg-white"
          />
        </div>
      ) : (
        <span className="text-[8px] text-gray-400">Empty</span>
      )}
    </div>
  )
}

function DocumentAction({
  icon: Icon,
  label,
  destructive = false,
  disabled = false,
  onSelect,
}: {
  icon: LucideIcon
  label: string
  destructive?: boolean
  disabled?: boolean
  onSelect: () => void
}) {
  return (
    <DropdownMenu.Item
      className={cn(
        'flex h-9 cursor-default select-none items-center gap-2 rounded-md px-2 text-sm text-gray-700 outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-violet-100 data-[highlighted]:text-violet-700 dark:text-gray-200 dark:data-[highlighted]:bg-violet-950 dark:data-[highlighted]:text-violet-300',
        destructive &&
          'text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700 dark:text-red-400 dark:data-[highlighted]:bg-red-950 dark:data-[highlighted]:text-red-300',
      )}
      disabled={disabled}
      onSelect={onSelect}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </DropdownMenu.Item>
  )
}

export function DocumentHome() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PublicationDocument | null>(null)
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDownloading, setBulkDownloading] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const downloadersRef = useRef(new Map<string, () => Promise<void>>())
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState<DocumentSort>('updatedAt-desc')
  const [page, setPage] = useState(0)
  const [sortField, direction] = sort.split('-') as ['updatedAt' | 'name', 'asc' | 'desc']
  const documentsQuery = api.useQuery(
    'get',
    '/api/documents',
    {
      params: {
        query: {
          page,
          size: documentPageSize,
          search: debouncedSearch || undefined,
          sort: sortField,
          direction,
        },
      },
    },
    { placeholderData: keepPreviousData },
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
  const documents = documentsQuery.data?.items ?? []
  const totalItems = documentsQuery.data?.totalItems ?? 0
  const totalPages = documentsQuery.data?.totalPages ?? 0
  const error: unknown =
    documentsQuery.error ?? createMutation.error ?? renameMutation.error ?? deleteMutation.error

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(0)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    setSelectedIds([])
  }, [page, debouncedSearch, sort])

  const currentDocumentIds = documents.flatMap((document) => (document.id ? [document.id] : []))
  const selectedDocuments = documents.filter(
    (document) => document.id && selectedIds.includes(document.id),
  )
  const allSelected =
    currentDocumentIds.length > 0 && currentDocumentIds.every((id) => selectedIds.includes(id))
  const someSelected = selectedIds.length > 0 && !allSelected

  return (
    <div className="min-h-0 flex-1 overflow-auto bg-gray-100 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section aria-labelledby="saved-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 id="saved-heading" className="text-xl font-semibold tracking-tight">
              Saved documents
            </h1>
            <label className="relative block">
              <span className="sr-only">Search documents</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:w-64 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-violet-400 dark:focus:ring-violet-950"
                type="search"
                value={search}
                placeholder="Search"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {documentsQuery.isPending ? (
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="h-12 animate-pulse border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800" />
              {Array.from({ length: documentPageSize }, (_, index) => (
                <div
                  key={index}
                  className="h-[60px] animate-pulse border-b border-gray-100 last:border-b-0 dark:border-gray-800"
                />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <div
              className={cn(
                'mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white transition-opacity duration-150 dark:border-gray-800 dark:bg-gray-900',
                documentsQuery.isPlaceholderData ? 'opacity-60' : 'opacity-100',
              )}
              aria-busy={documentsQuery.isPlaceholderData}
            >
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse text-left">
                  <colgroup>
                    <col className={selectionMode ? 'w-24' : 'w-16'} />
                    <col />
                    <col className="hidden w-36 sm:table-column sm:w-36" />
                    <col className="w-44" />
                    <col className="w-12" />
                  </colgroup>
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                    <tr className="h-11">
                      <th
                        className={cn(selectionMode ? 'w-24' : 'w-16', 'py-3 pl-3 pr-2 sm:pl-4')}
                        scope="col"
                      >
                        {selectionMode && (
                          <SelectCheckbox
                            checked={allSelected}
                            indeterminate={someSelected}
                            label={allSelected ? 'Deselect all documents' : 'Select all documents'}
                            onChange={toggleAll}
                          />
                        )}
                      </th>
                      <th className="px-2 py-3" scope="col">
                        <SortHeader label="Name" field="name" sort={sort} onChange={changeSort} />
                      </th>
                      <th className="hidden w-36 px-3 py-3 sm:table-cell" scope="col">
                        Size
                      </th>
                      <th className="w-40 px-3 py-3" scope="col">
                        <SortHeader
                          label="Last updated"
                          field="updatedAt"
                          sort={sort}
                          onChange={changeSort}
                        />
                      </th>
                      <th className="w-12 py-3 pl-2 pr-3 sm:pr-4" scope="col">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document, index) => (
                      <DocumentRow
                        key={document.id ?? index}
                        document={document}
                        deleting={deleteMutation.isPending}
                        selected={Boolean(document.id && selectedIds.includes(document.id))}
                        onDelete={setPendingDelete}
                        onOpen={openDocument}
                        onToggleSelect={toggleDocument}
                        onRename={renameDocument}
                        registerDownload={registerDownload}
                        selectionMode={selectionMode}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                totalItems={totalItems}
                totalPages={totalPages}
                itemCount={documents.length}
                pageSize={documentPageSize}
                selectedCount={selectedIds.length}
                allSelected={allSelected}
                someSelected={someSelected}
                bulkDownloading={bulkDownloading}
                selectionMode={selectionMode}
                disabled={documentsQuery.isPlaceholderData}
                onDelete={() => setPendingBulkDelete(true)}
                onDownload={() => void downloadSelected()}
                onEnterSelection={() => setSelectionMode(true)}
                onExitSelection={() => {
                  setSelectionMode(false)
                  setSelectedIds([])
                }}
                onClearSelection={() => setSelectedIds([])}
                onPageChange={setPage}
              />
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-medium">
                {debouncedSearch ? 'No matching documents' : 'No saved documents yet'}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {debouncedSearch
                  ? 'Try a different search'
                  : 'Choose a template below to create your first one'}
              </p>
            </div>
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

      {(pendingDelete || pendingBulkDelete) && (
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
              {pendingBulkDelete ? 'Delete selected documents?' : 'Delete document?'}
            </h2>
            <p
              id="delete-description"
              className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300"
            >
              {pendingBulkDelete
                ? `${selectedIds.length} documents will be permanently deleted. This action cannot be undone`
                : `“${pendingDelete?.name ?? 'Untitled'}” will be permanently deleted. This action cannot be undone`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                type="button"
                onClick={() => {
                  setPendingDelete(null)
                  setPendingBulkDelete(false)
                }}
                disabled={deleteMutation.isPending}
                autoFocus
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                type="button"
                onClick={() => void deleteDocument()}
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
    if (pendingBulkDelete) {
      for (const document of selectedDocuments) {
        if (document.id) {
          await deleteMutation.mutateAsync({ params: { path: { id: document.id } } })
        }
      }
      setSelectedIds([])
      setPendingBulkDelete(false)
    } else {
      if (!pendingDelete?.id) {
        return
      }
      await deleteMutation.mutateAsync({ params: { path: { id: pendingDelete.id } } })
      setPendingDelete(null)
    }
  }

  function toggleDocument(document: PublicationDocument) {
    if (!document.id) {
      return
    }
    setSelectedIds((current) =>
      current.includes(document.id!)
        ? current.filter((id) => id !== document.id)
        : [...current, document.id!],
    )
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds((current) => current.filter((id) => !currentDocumentIds.includes(id)))
    } else {
      setSelectedIds((current) => [...new Set([...current, ...currentDocumentIds])])
    }
  }

  function registerDownload({ id, download }: { id: string; download: () => Promise<void> }) {
    downloadersRef.current.set(id, download)
    return () => downloadersRef.current.delete(id)
  }

  async function downloadSelected() {
    setBulkDownloading(true)
    try {
      for (const document of selectedDocuments) {
        if (document.id) {
          await downloadersRef.current.get(document.id)?.()
        }
      }
    } finally {
      setBulkDownloading(false)
    }
  }

  function changeSort({ field }: { field: 'name' | 'updatedAt' }) {
    const [currentField, currentDirection] = sort.split('-')
    const nextDirection =
      currentField === field
        ? currentDirection === 'asc'
          ? 'desc'
          : 'asc'
        : field === 'name'
          ? 'asc'
          : 'desc'
    setSort(`${field}-${nextDirection}` as DocumentSort)
    setPage(0)
  }

  function openDocument(document: PublicationDocument) {
    if (document.id) {
      navigate(`/documents/${document.id}/edit`)
    }
  }
}

type DocumentSort = 'updatedAt-desc' | 'updatedAt-asc' | 'name-asc' | 'name-desc'

function SortHeader({
  label,
  field,
  sort,
  onChange,
}: {
  label: string
  field: 'name' | 'updatedAt'
  sort: DocumentSort
  onChange: ({ field }: { field: 'name' | 'updatedAt' }) => void
}) {
  const [sortField, direction] = sort.split('-')
  const active = sortField === field
  const Icon = active ? (direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <button
      className={cn(
        'flex items-center gap-1.5 hover:text-gray-900 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:hover:text-gray-100',
        active && 'text-gray-900 dark:text-gray-100',
      )}
      type="button"
      onClick={() => onChange({ field })}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  )
}

function SelectCheckbox({
  checked,
  indeterminate = false,
  label,
  onChange,
}: {
  checked: boolean
  indeterminate?: boolean
  label: string
  onChange: () => void
}) {
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={checkboxRef}
      className="size-4 cursor-pointer rounded border-gray-300 text-violet-600 accent-violet-600 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800"
      type="checkbox"
      checked={checked}
      aria-label={label}
      onClick={(event) => event.stopPropagation()}
      onChange={onChange}
    />
  )
}

function Pagination({
  page,
  totalItems,
  totalPages,
  itemCount,
  pageSize,
  selectedCount,
  allSelected,
  someSelected,
  bulkDownloading,
  selectionMode,
  disabled,
  onDelete,
  onDownload,
  onEnterSelection,
  onExitSelection,
  onClearSelection,
  onPageChange,
}: {
  page: number
  totalItems: number
  totalPages: number
  itemCount: number
  pageSize: number
  selectedCount: number
  allSelected: boolean
  someSelected: boolean
  bulkDownloading: boolean
  selectionMode: boolean
  disabled: boolean
  onDelete: () => void
  onDownload: () => void
  onEnterSelection: () => void
  onExitSelection: () => void
  onClearSelection: () => void
  onPageChange: (page: number) => void
}) {
  const firstItem = totalItems === 0 ? 0 : page * pageSize + 1
  const lastItem = page * pageSize + itemCount
  const actionScope = allSelected ? 'all' : 'selected'

  return (
    <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-3 py-2 pr-0 text-xs text-gray-500 sm:pl-4 sm:pr-0 dark:border-gray-800 dark:text-gray-400">
      <div className="flex shrink-0 items-center gap-2">
        {!selectionMode ? (
          <button
            className="rounded px-1.5 py-1 font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            type="button"
            onClick={onEnterSelection}
          >
            Select
          </button>
        ) : selectedCount > 0 ? (
          <>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {selectedCount} selected
            </span>
            <button
              className="rounded px-1.5 py-1 font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              type="button"
              onClick={onClearSelection}
            >
              Deselect {actionScope}
            </button>
            <button
              className="inline-flex items-center gap-1 rounded px-1.5 py-1 font-medium hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              type="button"
              disabled={bulkDownloading}
              onClick={onDownload}
            >
              {bulkDownloading ? (
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <FileDown className="size-3.5" aria-hidden="true" />
              )}
              Download {actionScope}
            </button>
            <button
              className="inline-flex items-center gap-1 rounded px-1.5 py-1 font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              type="button"
              onClick={onDelete}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              Delete {actionScope}
            </button>
            <button
              className="rounded px-1.5 py-1 font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              type="button"
              onClick={onExitSelection}
            >
              Done
            </button>
          </>
        ) : (
          <button
            className="rounded px-1.5 py-1 font-medium hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            type="button"
            onClick={onExitSelection}
          >
            Done
          </button>
        )}
        {someSelected && <span className="sr-only">Some documents selected</span>}
        {allSelected && <span className="sr-only">All documents selected</span>}
      </div>
      <div className="flex items-center gap-2">
        <span>
          {firstItem}–{lastItem} of {totalItems}
        </span>
        <div className="flex shrink-0 items-center gap-0">
          <button
            className="grid size-8 place-items-center rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            type="button"
            aria-label="Previous page"
            disabled={disabled || page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <span className="w-10 shrink-0 text-center">
            {page + 1} of {Math.max(totalPages, 1)}
          </span>
          <button
            className="grid size-8 place-items-center rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            type="button"
            aria-label="Next page"
            disabled={disabled || page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
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

function thumbnailStyle({ page }: { page: PageInput | undefined }) {
  const width = page?.width ?? 8.5
  const height = page?.height ?? 11
  const scale = 44 / Math.max(width, height)
  return { width: `${width * scale}px`, height: `${height * scale}px` }
}

function pageSizeLabel({ page }: { page: PageInput | undefined }) {
  return `${page?.width ?? 8.5} × ${page?.height ?? 11} in`
}
