import React, { Component } from "react"
import styled from "styled-components"

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
`

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
    { coordinate: "se", x: 1, y: 1 }
  ]
}

export default class ResizeMoveFrame extends Component {
  static get defaultState() {
    return {
      eX: 0,
      eY: 0,
      oX: 0,
      oY: 0,
      oW: 0,
      oH: 0,
      isEditingText: false,
      dragging: false,
      resizing: false,
      resizeAnchor: null
    }
  }

  constructor() {
    super(...arguments)
    this.state = { ...ResizeMoveFrame.defaultState }
    this.handleFrameSelected = this.handleFrameSelected.bind(this)
    this.handleFrameDoubleClicked = this.handleFrameDoubleClicked.bind(this)
    this.handleFrameDeselected = this.handleFrameDeselected.bind(this)
    this.handleFrameDragged = this.handleFrameDragged.bind(this)
    this.handleFrameResized = this.handleFrameResized.bind(this)
    this.handleAnchorSelected = this.handleAnchorSelected.bind(this)
    this.handleAnchorDeselected = this.handleAnchorDeselected.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  updateStateForDragging({ pageX, pageY }) {
    this.setState({
      eX: pageX,
      eY: pageY,
      oX: this.props.shape.x,
      oY: this.props.shape.y
    })
  }

  updateStateForResizing({ pageX, pageY }) {
    this.setState({
      eX: pageX,
      eY: pageY,
      oX: this.props.shape.x,
      oY: this.props.shape.y,
      oW: this.props.shape.width,
      oH: this.props.shape.height
    })
  }

  handleFrameSelected(event) {
    this.setState({ dragging: true })
    this.updateStateForDragging(event)
    document.addEventListener("mousemove", this.handleFrameDragged)
    document.addEventListener("mouseup", this.handleFrameDeselected)
  }

  handleFrameDoubleClicked() {
    if (this.props.shape.type === "text") {
      this.setState({ isEditingText: true })
    }
  }

  handleFrameDeselected() {
    this.setState({ ...ResizeMoveFrame.defaultState })
    document.removeEventListener("mousemove", this.handleFrameDragged)
    document.removeEventListener("mouseup", this.handleFrameDeselected)
  }

  handleAnchorSelected(event) {
    const coordinate = event
      .nativeEvent.target.attributes
      .getNamedItem("data-coordinate").value
    this.setState({ resizing: true, resizeAnchor: coordinate })
    this.updateStateForResizing(event);
    document.addEventListener("mousemove", this.handleFrameResized)
    document.addEventListener("mouseup", this.handleAnchorDeselected)
  }

  handleAnchorDeselected() {
    this.setState({ ...ResizeMoveFrame.defaultState })
    document.removeEventListener("mousemove", this.handleFrameResized)
    document.removeEventListener("mouseup", this.handleAnchorDeselected)
  }

  handleFrameDragged(event) {
    if (!this.state.dragging) {
      return
    }

    const x = (this.state.oX + (event.pageX - this.state.eX) /
      this.props.dpi / this.props.zoom)
    const y = (this.state.oY + (event.pageY - this.state.eY) /
      this.props.dpi / this.props.zoom)

    this.props.updateSelectedShape({
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2))
    })
  }

  // eslint-disable-next-line max-statements
  handleFrameResized(event) {
    if (!this.state.resizing) {
      return
    }

    const updatedMetrics = {}

    if (this.state.resizeAnchor.includes("n")) {
      updatedMetrics.height = Math.max(this.state.oH +
        ((this.state.eY - event.pageY) / this.props.dpi / this.props.zoom), 0)
      if (this.props.shape.height > 0) {
        updatedMetrics.y = this.state.oY + (event.pageY - this.state.eY) /
          this.props.dpi / this.props.zoom
      }
    } else if (this.state.resizeAnchor.includes("s")) {
      updatedMetrics.height = Math.max(this.state.oH +
        ((event.pageY - this.state.eY) / this.props.dpi / this.props.zoom), 0)
    }

    if (this.state.resizeAnchor.includes("w")) {
      updatedMetrics.width = Math.max(this.state.oW +
        ((this.state.eX - event.pageX) / this.props.dpi / this.props.zoom), 0)
      if (this.props.shape.width > 0) {
        updatedMetrics.x = this.state.oX + (event.pageX - this.state.eX) /
          this.props.dpi / this.props.zoom
      }
    } else if (this.state.resizeAnchor.includes("e")) {
      updatedMetrics.width = Math.max(this.state.oW +
        ((event.pageX - this.state.eX) / this.props.dpi / this.props.zoom), 0)
    }

    const updatedProperties = Object.getOwnPropertyNames(updatedMetrics)

    for (let idx = updatedProperties.length - 1; idx >= 0; idx--) {
      const value = updatedMetrics[updatedProperties[idx]]
      updatedMetrics[updatedProperties[idx]] = parseFloat(value.toFixed(2))
    }

    this.props.updateSelectedShape(updatedMetrics)
  }

  handleTextChange({ target }) {
    this.props.updateSelectedShape({ text: target.value })
  }

  render() {
    const { dpi, shape, zoom } = this.props
    const x = (shape.x * dpi * zoom) - (shape.strokeWidth / 2.0)
    const y = (shape.y * dpi * zoom) - (shape.strokeWidth / 2.0)
    const width = (shape.width * dpi * zoom) + shape.strokeWidth
    const height = (shape.height * dpi * zoom) + shape.strokeWidth

    const textEditingFrame = this.state.isEditingText ? (
      <g>
        <foreignObject
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <TextArea
            value={shape.text}
            onChange={this.handleTextChange}
            style={{
              color: shape.color,
              fontFamily: shape.fontFamily,
              fontStyle: shape.fontStyle,
              fontSize: `${shape.fontSize * zoom}px`,
              fontWeight: shape.fontWeight,
              textAlign: shape.textAlign
            }}
          />
        </foreignObject>
      </g>
    ) : null

    const anchorElements = frameAnchors.points.map((anchor, index) => {
      const lineWidth = shape.strokeWidth > 0 ? shape.strokeWidth : 1
      const style = { cursor: `${anchor.coordinate}-resize` }
      const xAnchor = ((shape.x * dpi - (shape.strokeWidth / 2.0)) * zoom) -
        (frameAnchors.size / 2.0) + (((shape.width * dpi) + lineWidth) *
        zoom * anchor.x)
      const yAnchor = ((shape.y * dpi - (shape.strokeWidth / 2.0)) * zoom) -
        (frameAnchors.size / 2.0) + (((shape.height * dpi) + lineWidth) *
        zoom * anchor.y)
      return (
        <g key={`shape-anchor-${index}`}>
          <rect
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
            onMouseDown={this.handleAnchorSelected}
          />
        </g>
      )
    })

    return (
      <g>
        <rect
          x={x - 0.5}
          y={y - 0.5}
          height={height}
          width={width}
          fill="hsla(0, 0%, 0%, 0.0)"
          fillOpacity="0"
          stroke="hsla(0, 0%, 0%, 0.5)"
          strokeWidth={1}
          onMouseDown={this.handleFrameSelected}
          onDoubleClick={this.handleFrameDoubleClicked}
        />
        { textEditingFrame }
        { anchorElements }
      </g>
    )
  }
}
