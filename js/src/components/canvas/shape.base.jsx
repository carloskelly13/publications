import React, {Component} from 'react';

import ShapeFrame from './shape.frame';

export default class ShapeBase extends Component {
  constructor(props, context) {
    super(props);
    this.shapeSelected = this.shapeSelected.bind(this);
  }

  isShapeSelected() {
    return this.props.selectable &&
           this.props.selectedShape &&
           this.props.selectedShape === this.props.shape;
  }

  shapeSelected(event) {
    event.preventDefault();
    this.props.updateSelectedCanvasObject(this.props.shape, null);
  }
}
