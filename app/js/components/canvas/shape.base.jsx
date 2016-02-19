import React, {Component} from 'react'
import {eq} from 'lodash'
import {autobind} from 'core-decorators'

import ShapeFrame from './shape.frame'

export default class ShapeBase extends Component {
  constructor() {
    super(...arguments)
  }

  isShapeSelected() {
    return this.props.selectable &&
           this.props.selectedShape &&
           eq(this.props.selectedShape, this.props.shape)
  }

  @autobind
  shapeSelected(event) {
    event.preventDefault()
    this.props.updateSelectedCanvasObject(this.props.shape)
  }
}
