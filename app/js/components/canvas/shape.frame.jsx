import React, {Component} from 'react';
import {autobind} from 'core-decorators'
import {contains} from 'lodash';

const frameAnchors = {
  size: 10,
  points: [
    {coordinate: 'nw', x: 0, y: 0},
    {coordinate: 'n', x: 0.5, y: 0},
    {coordinate: 'ne', x: 1, y: 0},
    {coordinate: 'w', x: 0, y: 0.5},
    {coordinate: 'e', x: 1, y: 0.5},
    {coordinate: 'sw', x: 0, y: 1},
    {coordinate: 's', x: 0.5, y: 1},
    {coordinate: 'se', x: 1, y: 1}
  ]
};

export default class ShapeFrame extends Component {
  constructor() {
    super(...arguments)
    this.state = {isEditingText: false}
  }

  componentDidMount() {
    this.resetState();
  }

  @autobind
  frameDoubleClicked() {
    if (this.props.shape.type === 'text') {
      this.setState({isEditingText: true});
    }
  }

  @autobind
  textDidChange(event) {
    this.props.updateShape({text: event.target.value});
  }

  render() {
    let {
      dpi,
      shape,
      zoom
    } = this.props,
      x = (shape.x * dpi * zoom) - (shape.strokeWidth / 2.0),
      y = (shape.y * dpi * zoom) - (shape.strokeWidth / 2.0),
      width = (shape.width * dpi * zoom) + shape.strokeWidth,
      height = (shape.height * dpi * zoom) + shape.strokeWidth;

    return (
      <g>
        <rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill-opacity="0" stroke="hsla(0, 0%, 0%, 0.5)"
          stroke-width={1 * zoom}
          onMouseDown={this.frameSelected}
          onDoubleClick={this.frameDoubleClicked}
        />
        {
          (() => {
            if (this.state.isEditingText) {
              return (
                <g>
                  <foreignObject
                    x={x}
                    y={y}
                    height={height}
                    width={width}>
                    <textarea
                      value={shape.text}
                      onChange={this.textDidChange}
                      className="shape-frame-textarea"
                      style={{
                        color: shape.color,
                        fontFamily: shape.fontFamily,
                        fontStyle: shape.fontStyle,
                        fontSize: `${shape.fontSize * zoom}px`,
                        fontWeight: shape.fontWeight,
                        textAlign: shape.textAlign
                      }} />
                  </foreignObject>
                </g>
              );
            }
          })()
        }
        {
          frameAnchors.points.map((anchor, index) => {
            let
              lineWidth = shape.strokeWidth > 0 ? shape.strokeWidth : 1,
              style = {
                cursor: `${anchor.coordinate}-resize`
              },
              xAnchor = ((shape.x * dpi - (shape.strokeWidth / 2.0)) * zoom) - (frameAnchors.size / 2.0) + (((shape.width * dpi) + lineWidth) * zoom * anchor.x),
              yAnchor = ((shape.y * dpi - (shape.strokeWidth / 2.0)) * zoom) - (frameAnchors.size / 2.0) + (((shape.height * dpi) + lineWidth) * zoom * anchor.y);

            return (
              <rect
                key={`shape-anchor-${index}`}
                x={xAnchor}
                y={yAnchor}
                width={frameAnchors.size}
                height={frameAnchors.size}
                stroke="hsla(0, 0%, 0%, 0.5)"
                stroke-width="1"
                fill="#fff"
                fill-opacity="1"
                stroke-opacity="1"
                style={style}
                data-coordinate={anchor.coordinate}
                onMouseDown={this.resizeAnchorSelected}
              />
            )
          })
        }
      </g>
    );
  }

  updateStateForDragging(event) {
    this.setState({
      eX: event.pageX,
      eY: event.pageY,
      oX: this.props.shape.x,
      oY: this.props.shape.y
    });
  }

  updateStateForResizing(event) {
    this.setState({
      eX: event.pageX,
      eY: event.pageY,
      oX: this.props.shape.x,
      oY: this.props.shape.y,
      oW: this.props.shape.width,
      oH: this.props.shape.height
    });
  }

  resetState() {
    this.setState({
      eX: 0,  eY: 0,
      oX: 0,  oY: 0,
      oW: 0,  oH: 0,
      dragging: false,
      resizing: false,
      resizeAnchor: null
    });
  }

  @autobind
  frameSelected(event) {
    this.setState({dragging: true});
    this.updateStateForDragging(event);
    document.addEventListener('mousemove', this.frameDragged);
    document.addEventListener('mouseup', this.frameDeselected);
  }

  @autobind
  resizeAnchorSelected(event) {
    const coordinate = event.nativeEvent.target.attributes.getNamedItem('data-coordinate').value

    this.setState({
      resizing: true,
      resizeAnchor: coordinate
    });

    this.updateStateForResizing(event);
    document.addEventListener('mousemove', this.resizeAnchorDragged);
    document.addEventListener('mouseup', this.resizeAnchorDeselected);
  }

  @autobind
  frameDragged(event) {
    if (!this.state.dragging) return;

     const x = this.state.oX + (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom
     const y = this.state.oY + (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom

    this.props.updateShape({
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2))
    });
  }

  @autobind
  resizeAnchorDragged(event) {
    if (!this.state.resizing) return;

    let updatedMetrics = {};

    if (contains(this.state.resizeAnchor, 'n')) {
      updatedMetrics.height = Math.max(this.state.oH +
        ((this.state.eY - event.pageY) / this.props.dpi / this.props.zoom), 0);

      if (this.props.shape.height > 0) {
        updatedMetrics.y = this.state.oY + (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom;
      }

    } else if (contains(this.state.resizeAnchor, 's')) {
      updatedMetrics.height = Math.max(this.state.oH +
        ((event.pageY - this.state.eY) / this.props.dpi / this.props.zoom), 0);
    }

    if (contains(this.state.resizeAnchor, 'w')) {
      updatedMetrics.width = Math.max(this.state.oW +
        ((this.state.eX - event.pageX) / this.props.dpi / this.props.zoom), 0);

      if (this.props.shape.width > 0) {
        updatedMetrics.x = this.state.oX + (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom;
      }

    } else if (contains(this.state.resizeAnchor, 'e')) {
      updatedMetrics.width = Math.max(this.state.oW +
        ((event.pageX - this.state.eX) / this.props.dpi / this.props.zoom), 0);
    }

    const updatedProperties = Object.getOwnPropertyNames(updatedMetrics)

    for (let idx = updatedProperties.length - 1; idx >= 0; idx--) {
      const value = updatedMetrics[updatedProperties[idx]]
      updatedMetrics[updatedProperties[idx]] = parseFloat(value.toFixed(2))
    }

    this.props.updateShape(updatedMetrics);
  }

  @autobind
  frameDeselected() {
    this.resetState();
    document.removeEventListener('mousemove', this.frameDragged);
    document.removeEventListener('mouseup', this.frameDeselected);
  }

  @autobind
  resizeAnchorDeselected() {
    this.resetState();
    document.removeEventListener('mousemove', this.resizeAnchorDragged);
    document.removeEventListener('mouseup', this.resizeAnchorDeselected);
  }
}
