import * as React from "react";
import range from "lodash/range";
import { Colors } from "../../util/constants";
import { GridLine } from "../canvas/grid-line";
import styled from "styled-components";
import { PubDocument } from "../../types/pub-objects";

const RulerContent = styled.div`
  background: ${Colors.Rulers.Background};
  position: absolute;
  left: 25px;
  height: 25px;
  z-index: 1;

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

const isMajor = (index: number) => index % 4 === 0 && index > 0;
const majorPadding = (major: boolean) => (major ? 0 : 15);

interface Props {
  doc: PubDocument;
  dpi: number;
  zoom: number;
  showDetail: boolean;
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
  const { doc, dpi, zoom, showDetail } = props;
  const xRange = range(0, doc.pages[0].width * dpi * zoom, 0.25 * dpi * zoom);
  const yRange = range(0, doc.pages[0].height * dpi * zoom, 0.25 * dpi * zoom);
  return (
    <>
      <RulerContent
        style={{
          width: `${doc.pages[0].width * zoom * dpi + 25}px`,
          left: `${-props.scrollOffset.scrollLeft}px`,
        }}
      >
        <svg
          width={doc.pages[0].width * dpi * zoom + 26}
          height="25"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          {showDetail && <RulerMarks rulerRange={xRange} direction="V" />}
        </svg>
      </RulerContent>
      <RulerContent
        style={{
          top: `${26 - props.scrollOffset.scrollTop}px`,
          height: `${doc.pages[0].height * zoom * dpi + 1}px`,
          zIndex: 0,
          left: 0,
        }}
      >
        <svg
          width="24"
          height={doc.pages[0].height * dpi * zoom}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          {showDetail && <RulerMarks rulerRange={yRange} direction="H" />}
        </svg>
      </RulerContent>
    </>
  );
}

Ruler.defaultProps = { dpi: 96 };
export default React.memo(Ruler);
