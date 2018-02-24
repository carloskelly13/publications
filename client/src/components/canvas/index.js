import React from "react";
import PropTypes from "prop-types";
import { CanvasBackground } from "./background";
import { CanvasSVG } from "./canvas-svg";
import Shapes from "./render-shapes";

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
  static contextTypes = {
    actions: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    setActiveDraftJSEditor: PropTypes.func,
  };

  static defaultProps = {
    dpi: 96,
    allowsEditing: false,
    isSelected: false,
  };

  state = {
    activeDraftJSEditor: null,
  };

  getChildContext = () => ({
    setActiveDraftJSEditor: this.setActiveDraftJSEditor,
  });

  setActiveDraftJSEditor = id => this.setState({ activeDraftJSEditor: id });

  render() {
    const {
      dpi,
      width,
      height,
      allowsEditing,
      thumbnail,
      selected,
      backgroundGridLineRanges,
    } = this.props;
    const { updateSelectedObject } = this.context.actions;
    let { zoom } = this.props;

    if (thumbnail) {
      zoom = zoomForDocumentSize({ width, height });
    }

    return (
      <CanvasSVG
        thumbnail={thumbnail}
        selected={selected}
        allowsEditing={allowsEditing}
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
            {...this.props}
            zoom={zoom}
            setActiveDraftJSEditor={this.setActiveDraftJSEditor}
            activeDraftJSEditor={this.state.activeDraftJSEditor}
          />
        </g>
      </CanvasSVG>
    );
  }
}
