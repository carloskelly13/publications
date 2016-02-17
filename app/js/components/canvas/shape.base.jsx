import React, {Component} from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import ShapeFrame from './shape.frame'

export default class ShapeBase extends Component {
  constructor() {
    super(...arguments)
    this.shapeSelected = this.shapeSelected.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    const shouldUpdate = nextProps.shape === nextProps.selectedShape ||
      this.props.selectedShape !== nextProps.selectedShape

    return shouldUpdate
  }

  isShapeSelected() {
    return this.props.selectable &&
           this.props.selectedShape &&
           this.props.selectedShape === this.props.shape;
  }

  shapeSelected(event) {
    event.preventDefault();
    this.props.updateSelectedCanvasObject(this.props.shape);
  }
}
