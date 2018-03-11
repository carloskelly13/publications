import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import throttle from "lodash/fp/throttle";

/**
 * Webkit-based browsers have no perf-related issues with events.
 * Edge and Firefox have a 50ms throttle.
 */
const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
const isSafari =
  /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
const throttleWrapped = isChrome || isSafari ? e => e : throttle(50);

const FrameRect = styled.rect`
  @media print {
    display: none;
  }
  touch-action: manipulation;
`;

export const TextArea = styled.textarea`
  height: 100%;
  resize: none;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
  user-select: none;
  outline: none;
  background: transparent;
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

export default class ResizeMoveFrame extends React.Component {
  static contextTypes = {
    actions: PropTypes.object.isRequired,
    setActiveDraftJSEditor: PropTypes.func.isRequired,
  };

  static get defaultState() {
    return {
      eX: 0,
      eY: 0,
      oX: 0,
      oY: 0,
      oW: 0,
      oH: 0,
      shouldRender: true,
    };
  }

  state = ResizeMoveFrame.defaultState;

  componentWillUnmount() {
    this.context.setActiveDraftJSEditor(null);
    document.removeEventListener("mousemove", this.handleFrameResized);
    document.removeEventListener("mousemove", this.handleFrameDragged);
  }

  isDragging = false;
  isEditingText = false;
  resizeAnchor = "";

  updateStateForDragging = ({ pageX, pageY }) => {
    this.setState({
      eX: pageX,
      eY: pageY,
      oX: this.props.shape.x,
      oY: this.props.shape.y,
    });
  };

  updateStateForResizing = ({ pageX, pageY }) => {
    this.setState({
      eX: pageX,
      eY: pageY,
      oX: this.props.shape.x,
      oY: this.props.shape.y,
      oW: this.props.shape.width,
      oH: this.props.shape.height,
    });
  };

  handleMouseDown = event => {
    this.updateStateForDragging(event);
    if (!this.isEditingText) {
      document.addEventListener("mousemove", this.handleFrameDragged);
    }
  };

  handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleFrameDragged);
    if (this.isDragging) {
      this.isDragging = false;
      this.setState({ ...ResizeMoveFrame.defaultState });
      return;
    }
    if (this.props.shape.type !== "text") {
      return;
    }
    this.isEditingText = true;
    this.setState({ shouldRender: false });
    this.context.setActiveDraftJSEditor(this.props.shape.id);
    this.context.actions.updateSelectedObject({ isEditing: true });
  };

  handleAnchorMouseDown = event => {
    const coordinate = event.nativeEvent.target.attributes.getNamedItem(
      "data-coordinate"
    ).value;
    this.resizeAnchor = coordinate;
    this.updateStateForResizing(event);
    document.addEventListener("mousemove", this.handleFrameResized);
  };

  handleAnchorMouseUp = () => {
    this.setState({ ...ResizeMoveFrame.defaultState });
    this.resizeAnchor = "";
    document.removeEventListener("mousemove", this.handleFrameResized);
  };

  handleFrameDragged = throttleWrapped(event => {
    this.isDragging = true;

    const x =
      this.state.oX +
      (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom;
    const y =
      this.state.oY +
      (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom;

    this.context.actions.updateSelectedObject({
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
    });
  });

  // eslint-disable-next-line max-statements
  handleFrameResized = throttleWrapped(event => {
    const updatedMetrics = {};

    if (this.resizeAnchor.includes("n")) {
      updatedMetrics.height = Math.max(
        this.state.oH +
          (this.state.eY - event.pageY) / this.props.dpi / this.props.zoom,
        0
      );
      if (this.props.shape.height > 0) {
        updatedMetrics.y =
          this.state.oY +
          (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom;
      }
    } else if (this.resizeAnchor.includes("s")) {
      updatedMetrics.height = Math.max(
        this.state.oH +
          (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom,
        0
      );
    }

    if (this.resizeAnchor.includes("w")) {
      updatedMetrics.width = Math.max(
        this.state.oW +
          (this.state.eX - event.pageX) / this.props.dpi / this.props.zoom,
        0
      );
      if (this.props.shape.width > 0) {
        updatedMetrics.x =
          this.state.oX +
          (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom;
      }
    } else if (this.resizeAnchor.includes("e")) {
      updatedMetrics.width = Math.max(
        this.state.oW +
          (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom,
        0
      );
    }

    const updatedProperties = Object.getOwnPropertyNames(updatedMetrics);

    for (let idx = updatedProperties.length - 1; idx >= 0; idx--) {
      const value = updatedMetrics[updatedProperties[idx]];
      updatedMetrics[updatedProperties[idx]] = parseFloat(value.toFixed(2));
    }

    this.context.actions.updateSelectedObject(updatedMetrics);
  });

  handleTextChange = ({ target }) => {
    this.context.actions.updateSelectedObject({ text: target.value });
  };

  render() {
    const { dpi, shape, zoom } = this.props;
    const x = shape.x * dpi * zoom - shape.strokeWidth / 2.0;
    const y = shape.y * dpi * zoom - shape.strokeWidth / 2.0;
    const width = shape.width * dpi * zoom + shape.strokeWidth;
    const height = shape.height * dpi * zoom + shape.strokeWidth;

    const anchorElements = frameAnchors.points.map((anchor, index) => {
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
            rx={2}
            ry={2}
            width={frameAnchors.size}
            height={frameAnchors.size}
            stroke="hsla(0, 0%, 0%, 0.5)"
            strokeWidth="1"
            fill="#fff"
            fillOpacity="1"
            strokeOpacity="1"
            style={style}
            data-coordinate={anchor.coordinate}
            onMouseDown={this.handleAnchorMouseDown}
            onMouseUp={this.handleAnchorMouseUp}
          />
        </g>
      );
    });

    /**
     * When a textbox is editing we don‘t want the frame controls to
     * be visible.
     */
    if (!this.state.shouldRender) {
      return null;
    }

    return (
      <g>
        <FrameRect
          x={x - 0.5}
          y={y - 0.5}
          height={height}
          width={width}
          fill="hsla(0, 0%, 0%, 0.0)"
          fillOpacity="0"
          stroke="hsla(0, 0%, 0%, 0.5)"
          strokeWidth={1}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        />
        {anchorElements}
      </g>
    );
  }
}
