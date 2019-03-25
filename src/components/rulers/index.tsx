import * as React from "react";
import range from "lodash/range";
import { Colors } from "../../util/constants";
import { GridLine } from "../canvas/grid-line";
import styled from "styled-components";
import { PubDocument } from "../../types/pub-objects";

const RulerContent = styled.div`
  background: transparent;
  position: fixed;
  left: 25px;
  height: 25px;
  overflow: hidden;

  path {
    fill: none;
    stroke: hsla(0, 0%, 100%, 0.25);
    stroke-width: 1;
    shape-rendering: crispEdges;
  }

  @media print {
    display: none;
  }
`;

const HorizontalRulerContent = styled(RulerContent)<{ width: number }>`
  width: ${({ width }) => width}px;
  left: 0;
  top: 25px;
`;

const VerticalRulerContent = styled(RulerContent)<{ height: number }>`
  padding-top: 25px;
  height: ${({ height }) => height}px;
  left: 0;
`;

const isMajor = (index: number) => index % 4 === 0 && index > 0;
const majorPadding = (major: boolean) => (major ? 0 : 15);

interface Props {
  doc: PubDocument;
  dpi: number;
  zoom: number;
  showDetail: boolean;
  viewportRect: { width: number; height: number };
  scrollOffset: { scrollLeft: number; scrollTop: number };
}

interface MajorLabelProps {
  index: number;
  mark: number;
  direction: string;
}
export function MajorLabel({ index, mark, direction }: MajorLabelProps) {
  return (
    <text
      fill={Colors.Rulers.Text}
      fontSize="12"
      x={direction === "V" ? mark + 27 : 4}
      y={direction === "V" ? 12 : mark - 2}
    >
      {index / 4}
    </text>
  );
}

interface RulerMarksProps {
  rulerRange: Array<number>;
  direction: string;
}
export function RulerMarks({ rulerRange, direction }: RulerMarksProps) {
  return (
    <>
      {rulerRange.map((mark, index) => {
        const major = isMajor(index);
        return (
          <g key={`${direction}${index}`}>
            {major && (
              <MajorLabel index={index} mark={mark} direction={direction} />
            )}
            <GridLine
              mX={direction === "V" ? mark + 24.5 : 15}
              mY={direction === "V" ? 15 : mark + 0.5}
              dX={direction === "V" ? 25 : majorPadding(major)}
              dY={direction === "V" ? majorPadding(major) : 25}
              direction={direction}
              major={false}
            />
          </g>
        );
      })}
    </>
  );
}

export function Ruler(props: Props) {
  const horizontalRulerRef = React.useRef<HTMLDivElement>(null);
  const verticalRulerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    horizontalRulerRef.current.scrollLeft = props.scrollOffset.scrollLeft;
  }, [props.scrollOffset.scrollLeft]);

  React.useEffect(() => {
    verticalRulerRef.current.scrollTop = props.scrollOffset.scrollTop;
  }, [props.scrollOffset.scrollTop]);

  const { doc, dpi, zoom, showDetail } = props;
  const xRange = range(0, doc.pages[0].width * dpi * zoom, 0.25 * dpi * zoom);
  const yRange = range(0, doc.pages[0].height * dpi * zoom, 0.25 * dpi * zoom);
  return (
    <>
      <HorizontalRulerContent
        innerRef={horizontalRulerRef}
        width={props.viewportRect.width}
      >
        <svg
          width={doc.pages[0].width * dpi * zoom + 52}
          height="25"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <rect
            height={25}
            width={doc.pages[0].width * dpi * zoom + 25}
            fill={Colors.Rulers.Background}
          />
          {showDetail && <RulerMarks rulerRange={xRange} direction="V" />}
        </svg>
      </HorizontalRulerContent>
      <VerticalRulerContent
        innerRef={verticalRulerRef}
        height={props.viewportRect.height}
      >
        <svg
          width="24"
          height={doc.pages[0].height * dpi * zoom + 77}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <rect
            width={25}
            height={doc.pages[0].height * dpi * zoom + 1}
            fill={Colors.Rulers.Background}
          />
          {showDetail && <RulerMarks rulerRange={yRange} direction="H" />}
        </svg>
      </VerticalRulerContent>
    </>
  );
}

export default React.memo(Ruler);
