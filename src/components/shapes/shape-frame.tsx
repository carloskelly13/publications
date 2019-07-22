import * as React from "react";
import { PubShape } from "../../types/pub-objects";
import styled from "styled-components";
import Draggable, {
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from "react-draggable";

const FrameRect = styled.rect`
  @media print {
    display: none;
  }
  touch-action: manipulation;

  &:hover {
    fill: #9b82f3;
  }
`;

const frameAnchors = {
  size: 10,
  points: [
    { coordinate: "nw", x: 0, y: 0 },
    { coordinate: "n", x: 0.5, y: 0 },
    { coordinate: "ne", x: 1, y: 0 },
    { coordinate: "w", x: 0, y: 0.5 },
    { coordinate: "e", x: 1, y: 0.5 },
    { coordinate: "sw", x: 0, y: 1 },
    { coordinate: "s", x: 0.5, y: 1 },
    { coordinate: "se", x: 1, y: 1 },
  ],
};

interface Props {
  shape: PubShape;
  selectedShapeId?: string;
  zoom: number;
  dpi: number;
  updateSelectedObject: (sender: Record<string, any> | null) => void;
  children?: React.ReactNode;
}
const ShapeFrame: React.FC<Props> = props => {
  const { shape, dpi, zoom, updateSelectedObject } = props;

  const anchorElements = React.useMemo(
    () =>
      frameAnchors.points.map((anchor, index) => {
        const lineWidth = shape.strokeWidth > 0 ? shape.strokeWidth : 1;
        const style = { cursor: `${anchor.coordinate}-resize` };
        const xAnchor =
          (shape.x * dpi - shape.strokeWidth / 2.0) * zoom -
          frameAnchors.size / 2.0 +
          (shape.width * dpi + lineWidth) * zoom * anchor.x;
        const yAnchor =
          (shape.y * dpi - shape.strokeWidth / 2.0) * zoom -
          frameAnchors.size / 2.0 +
          (shape.height * dpi + lineWidth) * zoom * anchor.y;
        return (
          <g key={`shape-anchor-${index}`}>
            <FrameRect
              x={xAnchor}
              y={yAnchor}
              rx={frameAnchors.size / 2}
              ry={frameAnchors.size / 2}
              width={frameAnchors.size}
              height={frameAnchors.size}
              stroke="hsla(0, 0%, 0%, 0.5)"
              strokeWidth="1"
              fill="#785ef0"
              fillOpacity="1"
              strokeOpacity="1"
            />
            <FrameRect
              x={xAnchor + 1}
              y={yAnchor + 1}
              rx={frameAnchors.size - 2 / 2}
              ry={frameAnchors.size - 2 / 2}
              width={frameAnchors.size - 2}
              height={frameAnchors.size - 2}
              strokeWidth="1"
              fill="transparent"
              stroke="#71cddd"
              data-coordinate={anchor.coordinate}
              style={style}
            />
          </g>
        );
      }),
    [dpi, shape.height, shape.strokeWidth, shape.width, shape.x, shape.y, zoom]
  );

  const handleOnDragShape = React.useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      const x = shape.x + data.deltaX;
      const y = shape.y + data.deltaY;
      updateSelectedObject({
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
      });
    },
    [shape.x, shape.y, dpi, updateSelectedObject, zoom]
  );

  const x = shape.x * dpi * zoom;
  const y = shape.y * dpi * zoom;
  const width = shape.width * dpi * zoom + shape.strokeWidth;
  const height = shape.height * dpi * zoom + shape.strokeWidth;

  return (
    <g>
      <Draggable onDrag={handleOnDragShape} scale={zoom * dpi}>
        <FrameRect
          x={x - 0.5}
          y={y - 0.5}
          height={height}
          width={width}
          fill="hsla(0, 0%, 0%, 0.0)"
          fillOpacity="0"
          stroke="hsla(0, 0%, 0%, 0.5)"
          strokeWidth={1}
        />
      </Draggable>
      {anchorElements}
    </g>
  );
};

export default ShapeFrame;
