import React, { Component } from "react";
import range from "lodash/range";
import { Colors } from "../../util/constants";
import { GridLine } from "../canvas/grid-line";
import styled from "styled-components";
import { PubDocument } from "../../types/pub-objects";

const RulerContainer = styled.div`
  background: ${Colors.Rulers.Background};
  position: fixed;
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

const isMajor = index => index % 4 === 0 && index > 0;

interface Props {
  doc: PubDocument;
  dpi: number;
  zoom: number;
  showDetail: boolean;
  scrollOffset: { scrollLeft: number; scrollTop: number };
}

export default class Ruler extends Component<Props> {
  static defaultProps = {
    dpi: 96,
  };

  renderRulerMarks(
    rulerRange: Array<number>,
    direction: string
  ): React.ReactNode {
    const majorPadding = major => (major ? 0 : 15);
    return rulerRange.map((mark, index) => {
      const major = isMajor(index);
      return (
        <g key={`${direction}${index}`}>
          {major && this.renderMajorLabel(index, mark, direction)}
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
    });
  }

  renderMajorLabel(
    index: number,
    mark: number,
    direction: string
  ): React.ReactNode {
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

  render() {
    const { doc, dpi, zoom, showDetail } = this.props;
    const xRange = range(0, doc.width * dpi * zoom, 0.25 * dpi * zoom);
    const yRange = range(0, doc.height * dpi * zoom, 0.25 * dpi * zoom);
    return (
      <div>
        <RulerContainer
          style={{
            width: `${doc.width * zoom * dpi + 25}px`,
            left: `${-this.props.scrollOffset.scrollLeft}px`,
          }}
        >
          <svg
            width={doc.width * dpi * zoom + 26}
            height="25"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            {showDetail && this.renderRulerMarks(xRange, "V")}
          </svg>
        </RulerContainer>
        <RulerContainer
          style={{
            top: `${80 - this.props.scrollOffset.scrollTop}px`,
            height: `${doc.height * zoom * dpi + 1}px`,
            zIndex: 0,
            left: 0,
          }}
        >
          <svg
            width="24"
            height={doc.height * dpi * zoom}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            {showDetail && this.renderRulerMarks(yRange, "H")}
          </svg>
        </RulerContainer>
      </div>
    );
  }
}
