import React, {Component} from 'react';
import _ from 'lodash';

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
  constructor(props, context) {
    super(props)

    this.frameSelected = this.frameSelected.bind(this);
    this.frameDeselected = this.frameDeselected.bind(this);
    this.frameDragged = this.frameDragged.bind(this);
    this.resizeAnchorSelected = this.resizeAnchorSelected.bind(this);
  }

  componentDidMount() {
    this.resetDragState();
  }

  render() {
    let shape = this.props.shape;
    let dpi = this.props.dpi;
    let zoom = this.props.zoom;

    return (
      <g>
        <rect
          x={(shape.x * dpi * zoom) - (shape.strokeWidth / 2.0)} y={(shape.y * dpi * zoom) - (shape.strokeWidth / 2.0)}
          width={(shape.width * dpi * zoom) + (shape.strokeWidth)} height={(shape.height * dpi * zoom) + (shape.strokeWidth)}
          fillOpacity="0" stroke="hsla(0, 0%, 0%, 0.5)"
          strokeWidth={1 * zoom}
          onMouseDown={this.frameSelected}
          onMouseUp={this.frameDeselected}
        />
        {
          frameAnchors.points.map((anchor, index) => {
            let lineWidth = shape.strokeWidth > 0 ? shape.strokeWidth : 1;
            let x = ((shape.x * dpi - (shape.strokeWidth / 2.0)) * zoom) - (frameAnchors.size / 2.0) + (((shape.width * dpi) + lineWidth) * zoom * anchor.x);
            let y = ((shape.y * dpi - (shape.strokeWidth / 2.0)) * zoom) - (frameAnchors.size / 2.0) + (((shape.height * dpi) + lineWidth) * zoom * anchor.y);
            return (
              <rect
                key={`shape-anchor-${index}`}
                x={x}
                y={y}
                width={frameAnchors.size}
                height={frameAnchors.size}
                stroke="hsla(0, 0%, 0%, 0.5)"
                strokeWidth="1"
                fill="#fff"
                fillOpacity="1"
                strokeOpacity="1"
                cursor={`${anchor.coordinate}-resize`}
                onClick={this.resizeAnchorSelected.bind(this, anchor.coordinate)}
              />
            )
          })
        }
      </g>
    );
  }

  updateStateForDragging(event) {
    this.state.eX = event.pageX;
    this.state.eY = event.pageY;
    this.state.oX = this.props.shape.x;
    this.state.oY = this.props.shape.y;
  }

  resetDragState() {
    this.setState({eX: 0, eY: 0, oX: 0, oY: 0, dragging: false, resizing: false});
  }

  frameSelected(event) {
    this.state.dragging = true;
    this.updateStateForDragging(event);
    document.addEventListener('mousemove', this.frameDragged);
  }

  frameDragged(event) {
    let dX = this.state.oX + (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom;
    let dY = this.state.oY + (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom;
    this.props.updateShape({x: dX, y: dY});
  }

  frameDeselected(event) {
    this.resetDragState();
    document.removeEventListener('mousemove', this.frameDragged);
  }

  resizeAnchorSelected(coordinate, event) {
    console.log(coordinate);
  }
}
