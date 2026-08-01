import type { Editor, JSONContent } from '@tiptap/core'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Fragment, useEffect, useMemo, type CSSProperties, type ReactNode } from 'react'
import type { ShapeInput, ShapeResponse } from '../types'

type CanvasShape = ShapeInput | ShapeResponse

const richTextExtensions = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    link: false,
  }),
  TextStyleKit,
  TextAlign.configure({ types: ['paragraph'] }),
]

function legacyText(text?: string) {
  if (!text) {
    return ''
  }
  return new DOMParser().parseFromString(text, 'text/html').body.textContent ?? ''
}

function richTextDocument(content: unknown, text?: string): JSONContent {
  if (content && typeof content === 'object' && (content as { type?: unknown }).type === 'doc') {
    return content as JSONContent
  }
  const value = legacyText(text)
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: value ? [{ type: 'text', text: value }] : undefined,
      },
    ],
  }
}

type Props = {
  shape: CanvasShape
  onChange?: (changes: Partial<ShapeInput>) => void
  onEditorChange?: (editor: Editor | null) => void
  onFinishEditing?: () => void
  scale?: number
}

function safeTextStyle(attributes: Record<string, unknown> | undefined): CSSProperties {
  const style: CSSProperties = {}
  const color = attributes?.color
  const fontSize = attributes?.fontSize
  const lineHeight = attributes?.lineHeight
  if (typeof color === 'string' && /^#[\da-f]{3,8}$/i.test(color)) {
    style.color = color
  }
  if (typeof fontSize === 'string' && /^\d+(?:\.\d+)?px$/.test(fontSize)) {
    style.fontSize = fontSize
  }
  if (typeof lineHeight === 'string' && /^\d+(?:\.\d+)?$/.test(lineHeight)) {
    style.lineHeight = lineHeight
  }
  return style
}

function renderRichTextNode(node: JSONContent, key: string): ReactNode {
  if (node.type === 'text') {
    let content: ReactNode = node.text ?? ''
    for (const [index, mark] of (node.marks ?? []).entries()) {
      const markKey = `${key}-mark-${index}`
      if (mark.type === 'bold') {
        content = <strong key={markKey}>{content}</strong>
      } else if (mark.type === 'italic') {
        content = <em key={markKey}>{content}</em>
      } else if (mark.type === 'underline') {
        content = <u key={markKey}>{content}</u>
      } else if (mark.type === 'strike') {
        content = <s key={markKey}>{content}</s>
      } else if (mark.type === 'textStyle') {
        content = (
          <span key={markKey} style={safeTextStyle(mark.attrs)}>
            {content}
          </span>
        )
      }
    }
    return <Fragment key={key}>{content}</Fragment>
  }

  if (node.type === 'hardBreak') {
    return <br key={key} />
  }
  const children = (node.content ?? []).map((child, index) =>
    renderRichTextNode(child, `${key}-${index}`),
  )
  if (node.type === 'paragraph') {
    const alignment =
      typeof node.attrs?.textAlign === 'string' &&
      ['left', 'center', 'right', 'justify'].includes(node.attrs.textAlign)
        ? (node.attrs.textAlign as CSSProperties['textAlign'])
        : undefined
    return (
      <p key={key} style={{ textAlign: alignment }}>
        {children}
      </p>
    )
  }
  if (node.type === 'bulletList') {
    return <ul key={key}>{children}</ul>
  }
  if (node.type === 'orderedList') {
    return <ol key={key}>{children}</ol>
  }
  if (node.type === 'listItem') {
    return <li key={key}>{children}</li>
  }
  return <Fragment key={key}>{children}</Fragment>
}

function StaticRichText({ shape }: { shape: CanvasShape }) {
  const document = richTextDocument(shape.richTextContent, shape.text)
  return <div className="rich-text-content h-full">{renderRichTextNode(document, 'document')}</div>
}

export function RichTextEditor({
  shape,
  onChange,
  onEditorChange,
  onFinishEditing,
  scale = 1,
}: Props) {
  const initialContent = useMemo(
    () => richTextDocument(shape.richTextContent, shape.text),
    // A shape editor is remounted for a new frame; updates flow from Tiptap to the document.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const editor = useEditor({
    extensions: richTextExtensions,
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.({ richTextContent: currentEditor.getJSON(), contentVersion: 1 })
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }
    const frame = window.requestAnimationFrame(() => editor.view.dom.focus({ preventScroll: true }))
    return () => window.cancelAnimationFrame(frame)
  }, [editor])

  useEffect(() => {
    if (!editor) {
      return
    }
    onEditorChange?.(editor)
    return () => onEditorChange?.(null)
  }, [editor, onEditorChange])

  return (
    <div
      className="origin-top-left"
      style={{
        width: `${(shape.width ?? 0) * 96}px`,
        height: `${(shape.height ?? 0) * 96}px`,
        transform: `scale(${scale})`,
      }}
      onKeyDownCapture={(event) => {
        if (event.key !== 'Escape') {
          return
        }
        event.preventDefault()
        editor?.commands.blur()
        onFinishEditing?.()
      }}
    >
      <EditorContent editor={editor} className="rich-text-content h-full" />
    </div>
  )
}

export function RichTextShape({ shape }: { shape: CanvasShape }) {
  const width = shape.width ?? 0
  const height = shape.height ?? 0
  const scale = 1 / 96

  return (
    <g transform={`matrix(${scale} 0 0 ${scale} ${shape.x ?? 0} ${shape.y ?? 0})`}>
      <foreignObject width={width * 96} height={height * 96} overflow="hidden" pointerEvents="none">
        <div style={{ width: `${width * 96}px`, height: `${height * 96}px` }}>
          <StaticRichText shape={shape} />
        </div>
      </foreignObject>
    </g>
  )
}
