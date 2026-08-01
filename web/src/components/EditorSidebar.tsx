import { useRef, type ReactNode } from 'react'

type Props = {
  open: boolean
  width: number
  onResize: ({ width }: { width: number }) => void
  layersHeight: number
  onSplitResize: ({ height }: { height: number }) => void
  layers: ReactNode
  properties: ReactNode
}

const MIN_PANEL_WIDTH = 272
const MAX_PANEL_WIDTH = 480
const MIN_SECTION_HEIGHT = 120

export function EditorSidebar({
  open,
  width,
  onResize,
  layersHeight,
  onSplitResize,
  layers,
  properties,
}: Props) {
  const sidebarRef = useRef<HTMLElement>(null)
  const widthResizeStart = useRef<{ pointerX: number; width: number } | null>(null)
  const splitting = useRef(false)

  const resizeWidth = ({ nextWidth }: { nextWidth: number }) => {
    onResize({ width: Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, nextWidth)) })
  }

  const resizeSplit = ({ pointerY }: { pointerY: number }) => {
    const bounds = sidebarRef.current?.getBoundingClientRect()
    if (!bounds || bounds.height <= MIN_SECTION_HEIGHT * 2) {
      return
    }
    const topHeight = Math.min(
      bounds.height - MIN_SECTION_HEIGHT,
      Math.max(MIN_SECTION_HEIGHT, pointerY - bounds.top),
    )
    onSplitResize({ height: topHeight })
  }

  return (
    <aside
      ref={sidebarRef}
      className="relative grid min-h-0 shrink-0 overflow-hidden border-l border-gray-200 bg-white transition-[width,transform,opacity] duration-200 ease-out motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900"
      style={{
        width: open ? width : 0,
        gridTemplateRows: `${layersHeight}px minmax(${MIN_SECTION_HEIGHT}px, 1fr)`,
        opacity: open ? 1 : 0,
        transform: open ? 'translateX(0)' : 'translateX(1rem)',
      }}
      aria-label="Document panels"
      aria-hidden={!open}
      inert={!open}
    >
      <div
        className="absolute inset-y-0 left-0 z-30 w-[6px] cursor-col-resize touch-none outline-none after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:bg-gray-300 hover:after:bg-violet-500 focus-visible:after:bg-violet-500 dark:after:bg-gray-600"
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        aria-valuemin={MIN_PANEL_WIDTH}
        aria-valuemax={MAX_PANEL_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault()
          widthResizeStart.current = { pointerX: event.clientX, width }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!widthResizeStart.current) {
            return
          }
          resizeWidth({
            nextWidth:
              widthResizeStart.current.width + widthResizeStart.current.pointerX - event.clientX,
          })
        }}
        onPointerUp={(event) => {
          widthResizeStart.current = null
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          widthResizeStart.current = null
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            resizeWidth({ nextWidth: width + 16 })
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            resizeWidth({ nextWidth: width - 16 })
          }
        }}
      />

      <div className="col-start-1 row-start-1 flex min-h-0">{layers}</div>
      <div
        className="absolute left-0 right-0 z-20 h-[6px] cursor-row-resize touch-none outline-none after:absolute after:left-0 after:right-0 after:top-1/2 after:h-0.5 after:-translate-y-1/2 after:bg-gray-300 hover:after:bg-violet-500 focus-visible:after:bg-violet-500 dark:after:bg-gray-600"
        style={{ top: layersHeight - 3 }}
        role="separator"
        aria-label="Resize Layers and Properties panels"
        aria-orientation="horizontal"
        aria-valuemin={MIN_SECTION_HEIGHT}
        aria-valuemax={1000}
        aria-valuenow={Math.round(layersHeight)}
        tabIndex={0}
        onPointerDown={(event) => {
          event.preventDefault()
          splitting.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (splitting.current) {
            resizeSplit({ pointerY: event.clientY })
          }
        }}
        onPointerUp={(event) => {
          splitting.current = false
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onPointerCancel={() => {
          splitting.current = false
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            onSplitResize({ height: Math.max(MIN_SECTION_HEIGHT, layersHeight - 20) })
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            onSplitResize({ height: layersHeight + 20 })
          }
        }}
      />
      <div className="col-start-1 row-start-2 flex min-h-0">{properties}</div>
    </aside>
  )
}
