import React, {Component} from 'react'
import {eq} from 'lodash'

import ShapeFrame from './shape.frame'

export default class ShapeBase extends Component {
  constructor() {
    super(...arguments)
    this.shapeSelected = this.shapeSelected.bind(this)
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
