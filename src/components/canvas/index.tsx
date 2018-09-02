import React from "react";
import { CanvasBackground } from "./background";
import { CanvasSVG } from "./canvas-svg";
import Shapes from "./shapes";
import { PubShape } from "../../types/pub-objects";

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

interface Props {
  sortedShapes: Array<PubShape>;
  dpi: number;
  zoom: number;
  width: number;
  height: number;
  thumbnail: boolean;
  allowsEditing: boolean;
  selectedShape: PubShape | null;
  backgroundGridLineRanges?: { x: Array<number>; y: Array<number> };
  updateSelectedObject(sender: Object | null): void;
}

interface State {
  activeDraftJSEditor: string | null;
}

class Canvas extends React.Component<Props, State> {
  state = {
    activeDraftJSEditor: null,
  };

  setActiveDraftJSEditor = (id: string | null) =>
    this.setState({ activeDraftJSEditor: id });

  render() {
    const {
      dpi,
      width,
      height,
      allowsEditing,
      thumbnail,
      selectedShape,
      sortedShapes,
      backgroundGridLineRanges,
      updateSelectedObject,
    } = this.props;
    let { zoom } = this.props;

    if (thumbnail) {
      zoom = zoomForDocumentSize({ width, height });
    }

    return (
      <CanvasSVG
        thumbnail={thumbnail}
        width={width * dpi * zoom}
        height={height * dpi * zoom}
      >
        <g>
          <CanvasBackground
            selectable={allowsEditing}
            width={width}
            height={height}
            dpi={dpi}
            zoom={zoom}
            gridLineRanges={backgroundGridLineRanges}
            handleBackgroundClicked={() => updateSelectedObject(null)}
          />
        </g>
        <g>
          <Shapes
            sortedShapes={sortedShapes}
            allowsEditing={allowsEditing}
            dpi={dpi}
            selectedShape={selectedShape}
            zoom={zoom}
            setActiveDraftJSEditor={this.setActiveDraftJSEditor}
            activeDraftJSEditor={this.state.activeDraftJSEditor}
            updateSelectedObject={updateSelectedObject}
          />
        </g>
      </CanvasSVG>
    );
  }
}

export default Canvas;
