import { fetchClient } from '../api'
import type { ElementResponse, PublicationDocument } from '../types'

type DocumentPage = NonNullable<PublicationDocument['pages']>[number]

export async function uploadDocumentImage({
  file,
  documentId,
  page,
}: {
  file: File
  documentId: string
  page: DocumentPage
}): Promise<ElementResponse> {
  const dimensions = await imageDimensions({ file })
  const { data: uploadTarget } = await fetchClient.POST('/api/documents/{id}/assets/upload-token', {
    params: { path: { id: documentId } },
    body: {
      filename: file.name,
      contentType: supportedImageContentType({ contentType: file.type }),
      byteSize: file.size,
    },
  })
  if (!uploadTarget) {
    throw new Error('Unable to prepare the image upload')
  }
  const { put } = await import('@vercel/blob/client')
  const blob = await put(uploadTarget.pathname, file, {
    access: 'private',
    token: uploadTarget.clientToken,
    contentType: file.type,
  })
  const { data: asset } = await fetchClient.POST('/api/documents/{id}/assets/{assetId}/complete', {
    params: { path: { id: documentId, assetId: uploadTarget.id } },
    body: {
      pathname: blob.pathname,
      width: dimensions.width,
      height: dimensions.height,
    },
  })
  if (!asset) {
    throw new Error('Unable to finish the image upload')
  }
  const size = displaySize({ dimensions, page })
  const elements = page.elements ?? []
  return {
    id: `draft-${crypto.randomUUID()}`,
    kind: 'image',
    x: Math.max(0, (page.width - size.width) / 2),
    y: Math.max(0, (page.height - size.height) / 2),
    z: Math.max(0, ...elements.map((element) => element.z)) + 1,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    data: {
      size,
      assetId: asset.id,
      fit: 'contain',
      positionX: 0.5,
      positionY: 0.5,
    },
  }
}

async function imageDimensions({ file }: { file: File }) {
  const bitmap = await createImageBitmap(file)
  try {
    return { width: bitmap.width, height: bitmap.height }
  } finally {
    bitmap.close()
  }
}

function supportedImageContentType({ contentType }: { contentType: string }) {
  if (contentType === 'image/png' || contentType === 'image/jpeg' || contentType === 'image/webp') {
    return contentType
  }
  throw new Error('Choose a PNG, JPEG, or WebP image')
}

function displaySize({
  dimensions,
  page,
}: {
  dimensions: { width: number; height: number }
  page: DocumentPage
}) {
  const intrinsicSize = {
    width: dimensions.width / 96,
    height: dimensions.height / 96,
  }
  const scale = Math.min(
    1,
    4 / intrinsicSize.width,
    4 / intrinsicSize.height,
    Math.max(0.5, page.width - 1) / intrinsicSize.width,
    Math.max(0.5, page.height - 1) / intrinsicSize.height,
  )
  return {
    width: Math.max(0.05, intrinsicSize.width * scale),
    height: Math.max(0.05, intrinsicSize.height * scale),
  }
}
