import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import ShapeFrame from './shape.frame'

export default class ShapeBase extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const shapeChanged = nextProps.shape !== this.props.shape
    const dpiChanged = nextProps.dpi !== this.props.dpi
    const zoomChanged = nextProps.zoom !== this.props.zoom
    const differentShapeWasSelected = (
      this.props.selectedShapeId !== nextProps.selectedShapeId &&
      (this.props.selectedShapeId === this.props.shape.id ||
       nextProps.selectedShapeId === this.props.shape.id)
    )

    return shapeChanged || dpiChanged || zoomChanged || differentShapeWasSelected
  }

  isShapeSelected() {
    return this.props.selectable && this.props.selectedShapeId === this.props.shape.id
  }

  @autobind
  shapeSelected(event) {
    event.preventDefault()
    this.props.updateShape(this.props.shape)
  }
}
