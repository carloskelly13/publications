import React, {Component} from 'react'
import {eq} from 'lodash'

import ShapeFrame from './shape.frame'

export default class ShapeBase extends Component {
  constructor() {
    super(...arguments)
    this.shapeSelected = this.shapeSelected.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    const shouldUpdate =
      !eq(this.props.shape, nextProps.shape) ||
      !nextProps.selectedShape ||
      !eq((this.props.selectedShape || {}).id, nextProps.selectedShape.id)

    return shouldUpdate
  }

  isShapeSelected() {
    return this.props.selectable &&
           this.props.selectedShape &&
           eq(this.props.selectedShape, this.props.shape)
  }

  shapeSelected(event) {
    event.preventDefault()
    this.props.updateSelectedCanvasObject(this.props.shape)
  }
}
