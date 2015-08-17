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
    this.resizeAnchorDeselected = this.resizeAnchorDeselected.bind(this);
    this.resizeAnchorDragged = this.resizeAnchorDragged.bind(this);
  }

  componentDidMount() {
    this.resetState();
  }

  render() {
    let {
      dpi,
      shape,
      zoom
    } = this.props;

    console.log(shape);

    return (
      <g>
        <rect
          x={(shape.x * dpi * zoom) - (shape.strokeWidth / 2.0)} y={(shape.y * dpi * zoom) - (shape.strokeWidth / 2.0)}
          width={(shape.width * dpi * zoom) + (shape.strokeWidth)} height={(shape.height * dpi * zoom) + (shape.strokeWidth)}
          fillOpacity="0" stroke="hsla(0, 0%, 0%, 0.5)"
          strokeWidth={1 * zoom}
          onMouseDown={this.frameSelected}
        />
        {
          frameAnchors.points.map((anchor, index) => {
            let
              lineWidth = shape.strokeWidth > 0 ? shape.strokeWidth : 1,
              style = {
                cursor: `${anchor.coordinate}-resize`
              },
              x = ((shape.x * dpi - (shape.strokeWidth / 2.0)) * zoom) - (frameAnchors.size / 2.0) + (((shape.width * dpi) + lineWidth) * zoom * anchor.x),
              y = ((shape.y * dpi - (shape.strokeWidth / 2.0)) * zoom) - (frameAnchors.size / 2.0) + (((shape.height * dpi) + lineWidth) * zoom * anchor.y);

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
                style={style}
                onMouseDown={this.resizeAnchorSelected.bind(this, anchor.coordinate)}
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

  frameSelected(event) {
    this.setState({dragging: true});
    this.updateStateForDragging(event);
    document.addEventListener('mousemove', this.frameDragged);
    document.addEventListener('mouseup', this.frameDeselected);
  }

  resizeAnchorSelected(coordinate, event) {
    this.setState({
      resizing: true,
      resizeAnchor: coordinate
    });

    this.updateStateForResizing(event);
    document.addEventListener('mousemove', this.resizeAnchorDragged);
    document.addEventListener('mouseup', this.resizeAnchorDeselected);
  }

  frameDragged(event) {
    if (!this.state.dragging) return;

    let dX = this.state.oX + (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom;
    let dY = this.state.oY + (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom;

    this.props.updateShape({x: dX, y: dY});
  }

  resizeAnchorDragged(event) {
    if (!this.state.resizing) return;

    let updatedMetrics = {};

    if (_.contains(this.state.resizeAnchor, 'n')) {
      updatedMetrics.height = Math.max(this.state.oH +
        ((this.state.eY - event.pageY) / this.props.dpi / this.props.zoom), 0);

      if (this.props.shape.height > 0) {
        updatedMetrics.y = this.state.oY + (event.pageY - this.state.eY) / this.props.dpi / this.props.zoom;
      }

    } else if (_.contains(this.state.resizeAnchor, 's')) {
      updatedMetrics.height = Math.max(this.state.oH +
        ((event.pageY - this.state.eY) / this.props.dpi / this.props.zoom), 0);
    }

    if (_.contains(this.state.resizeAnchor, 'w')) {
      updatedMetrics.width = Math.max(this.state.oW +
        ((this.state.eX - event.pageX) / this.props.dpi / this.props.zoom), 0);

      if (this.props.shape.width > 0) {
        updatedMetrics.x = this.state.oX + (event.pageX - this.state.eX) / this.props.dpi / this.props.zoom;
      }

    } else if (_.contains(this.state.resizeAnchor, 'e')) {
      updatedMetrics.width = Math.max(this.state.oW +
        ((event.pageX - this.state.eX) / this.props.dpi / this.props.zoom), 0);
    }

    this.props.updateShape(updatedMetrics);
  }

  frameDeselected() {
    this.resetState();
    document.removeEventListener('mousemove', this.frameDragged);
    document.removeEventListener('mouseup', this.frameDeselected);
  }

  resizeAnchorDeselected() {
    this.resetState();
    document.removeEventListener('mousemove', this.resizeAnchorDragged);
    document.removeEventListener('mouseup', this.resizeAnchorDeselected);
  }
}
