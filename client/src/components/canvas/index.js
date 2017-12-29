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

export default class extends React.Component {
  static defaultProps = {
    dpi: 96,
    allowsEditing: false,
    isSelected: false,
  };

  state = {
    activeDraftJSEditor: null,
  };

  setActiveDraftJSEditor = id => this.setState({ activeDraftJSEditor: id });

  render() {
    const {
      dpi,
      allowsEditing,
      thumbnail,
      selected,
      documentMetrics,
      updateSelectedShape,
      backgroundGridLineRanges,
    } = this.props;
    let { zoom } = this.props;

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
        <g>
          {renderShapes({
            ...this.props,
            zoom,
            setActiveDraftJSEditor: this.setActiveDraftJSEditor,
            activeDraftJSEditor: this.state.activeDraftJSEditor,
          })}
        </g>
      </CanvasSVG>
    );
  }
}
