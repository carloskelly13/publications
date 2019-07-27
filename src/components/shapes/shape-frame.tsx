import * as React from "react";
import { PubShape, PubShapeType } from "../../types/pub-objects";
import styled from "styled-components";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

const StyledFrameRect = styled.rect`
  @media print {
    display: none;
  }
  touch-action: manipulation;

  &:hover {
    fill: #9b82f3;
  }
`;

function FrameRect(props: React.SVGProps<SVGRectElement>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { transform: _, ...rest } = props;
  return React.createElement(StyledFrameRect, rest);
}

function AnchorSink(props: React.SVGProps<SVGGElement>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { transform: _, ...rest } = props;
  return React.createElement("g", rest);
}

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
  activeDraftJSEditor: string | null;
  updateSelectedObject: (sender: Record<string, any> | null) => void;
  setActiveDraftJSEditor(id: string | null): void;
}
const ShapeFrame: React.FC<Props> = props => {
  const {
    shape,
    dpi,
    zoom,
    updateSelectedObject,
    setActiveDraftJSEditor,
    activeDraftJSEditor,
  } = props;

  const handleOnDragShape = React.useCallback(
    (e: DraggableEvent, data: DraggableData) => {
      const x = shape.x + data.deltaX;
      const y = shape.y + data.deltaY;
      updateSelectedObject({
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
      });
    },
    [shape.x, shape.y, updateSelectedObject]
  );

  const handleAnchorElementDrag = React.useCallback(
    (data: DraggableData, coordinate: string) => {
      const updatedMetrics: { [key: string]: number } = {};

      if (coordinate.includes("n")) {
        updatedMetrics.height = Math.max(shape.height - data.deltaY, 0);
        if (shape.height > 0) {
          updatedMetrics.y = shape.y + data.deltaY;
        }
      } else if (coordinate.includes("s")) {
        updatedMetrics.height = Math.max(shape.height + data.deltaY, 0);
      }

      if (coordinate.includes("w")) {
        updatedMetrics.width = Math.max(shape.width - data.deltaX, 0);
        if (shape.width > 0) {
          updatedMetrics.x = shape.x + data.deltaX;
        }
      } else if (coordinate.includes("e")) {
        updatedMetrics.width = Math.max(shape.width + data.deltaX, 0);
      }

      for (const property in updatedMetrics) {
        const value = updatedMetrics[property];
        updatedMetrics[property] = parseFloat(value.toFixed(2));
      }
      updateSelectedObject(updatedMetrics);
    },
    [shape.height, shape.width, shape.x, shape.y, updateSelectedObject]
  );

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
          <Draggable
            key={`shape-anchor-${index}`}
            scale={zoom * dpi}
            onDrag={(_, data) =>
              handleAnchorElementDrag(data, anchor.coordinate)
            }
          >
            <AnchorSink>
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
            </AnchorSink>
          </Draggable>
        );
      }),
    [
      dpi,
      handleAnchorElementDrag,
      shape.height,
      shape.strokeWidth,
      shape.width,
      shape.x,
      shape.y,
      zoom,
    ]
  );

  const handleOnDoubleClick = React.useCallback(() => {
    if (shape.type !== PubShapeType.Text) {
      return;
    }
    setActiveDraftJSEditor(shape.id);
  }, [setActiveDraftJSEditor, shape.id, shape.type]);

  React.useEffect(() => {
    return () => {
      setActiveDraftJSEditor(null);
    };
  }, [setActiveDraftJSEditor]);

  const x = shape.x * dpi * zoom - shape.strokeWidth / 2.0;
  const y = shape.y * dpi * zoom - shape.strokeWidth / 2.0;
  const width = shape.width * dpi * zoom + shape.strokeWidth;
  const height = shape.height * dpi * zoom + shape.strokeWidth;
  const isEditingText = shape && activeDraftJSEditor === shape.id;

  if (isEditingText) {
    return null;
  }

  return (
    <g onDoubleClick={handleOnDoubleClick}>
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
