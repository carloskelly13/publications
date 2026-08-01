import type { CanvasPage } from '../types'

export const RULER_SIZE = 28

type Props = {
  page: CanvasPage
  pixelsPerInch: number
}

type MarksProps = {
  axis: 'horizontal' | 'vertical'
  inches: number
  pixelsPerInch: number
}

function RulerMarks({ axis, inches, pixelsPerInch }: MarksProps) {
  const quarterCount = Math.round(inches * 4)
  return Array.from({ length: quarterCount + 1 }, (_, index) => {
    const position = index * pixelsPerInch / 4
    const wholeInch = index % 4 === 0
    const halfInch = index % 2 === 0
    const tickLength = wholeInch ? 14 : halfInch ? 10 : 7

    if (axis === 'horizontal') {
      return (
        <g key={index}>
          <line x1={position} x2={position} y1={RULER_SIZE - tickLength} y2={RULER_SIZE} />
          {wholeInch && index < quarterCount && <text x={position + 4} y="11">{index / 4}</text>}
        </g>
      )
    }

    return (
      <g key={index}>
        <line x1={RULER_SIZE - tickLength} x2={RULER_SIZE} y1={position} y2={position} />
        {wholeInch && index < quarterCount && <text x="3" y={position + 11}>{index / 4}</text>}
      </g>
    )
  })
}

export function EditorRulers({ page, pixelsPerInch }: Props) {
  const width = page.width ?? 8.5
  const height = page.height ?? 11
  const rulerWidth = width * pixelsPerInch
  const rulerHeight = height * pixelsPerInch

  return (
    <>
      <div className="sticky left-0 top-0 z-30 col-start-1 row-start-1 size-7 border-b border-r border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" aria-hidden="true" />
      <div className="sticky top-0 z-20 col-start-2 row-start-1 h-7 overflow-hidden border-b border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" aria-hidden="true">
        <svg
          className="overflow-visible stroke-gray-400 text-[9px] fill-gray-500 dark:stroke-gray-500 dark:fill-gray-400"
          width={rulerWidth}
          height={RULER_SIZE}
        >
          <RulerMarks axis="horizontal" inches={width} pixelsPerInch={pixelsPerInch} />
        </svg>
      </div>
      <div className="sticky left-0 z-20 col-start-1 row-start-2 w-7 overflow-hidden border-r border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" aria-hidden="true">
        <svg
          className="overflow-visible stroke-gray-400 text-[9px] fill-gray-500 dark:stroke-gray-500 dark:fill-gray-400"
          width={RULER_SIZE}
          height={rulerHeight}
        >
          <RulerMarks axis="vertical" inches={height} pixelsPerInch={pixelsPerInch} />
        </svg>
      </div>
    </>
  )
}
