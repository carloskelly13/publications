import React from "react";
import { CanvasBackground } from "./background";
import { CanvasSVG } from "./canvas-svg";
import { renderShapes } from "./render-shapes";

const zoomForDocumentSize = ({ width, height }) => {
  if (width >= 32 || height >= 32) {
    return 0.075;
  }
  if (width >= 15 || height >= 15) {
    return 0.1;
  } else if (width >= 10 || height >= 10) {
    return 0.15;
  }
  return 0.2;
};

export const Canvas = props => {
  const {
    dpi,
    allowsEditing,
    thumbnail,
    selected,
    documentMetrics,
    updateSelectedShape,
    backgroundGridLineRanges,
  } = props;
  let { zoom } = props;

  if (thumbnail) {
    zoom = zoomForDocumentSize(documentMetrics);
  }

  return (
    <CanvasSVG
      thumbnail={thumbnail}
      selected={selected}
      allowsEditing={allowsEditing}
      width={documentMetrics.width * dpi * zoom}
      height={documentMetrics.height * dpi * zoom}
    >
      <g>
        <CanvasBackground
          selectable={allowsEditing}
          width={documentMetrics.width}
          height={documentMetrics.height}
          dpi={dpi}
          zoom={zoom}
          gridLineRanges={backgroundGridLineRanges}
          handleBackgroundClicked={() => updateSelectedShape(null)}
        />
      </g>
      <g>{renderShapes({ ...props, zoom })}</g>
    </CanvasSVG>
  );
};

Canvas.defaultProps = {
  dpi: 96,
  allowsEditing: false,
  isSelected: false,
};

export default Canvas;
