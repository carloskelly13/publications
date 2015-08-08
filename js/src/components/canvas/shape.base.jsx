import React, {Component} from 'react';

import ShapeFrame from './shape.frame';

export default class ShapeBase extends Component {
  constructor(props, context) {
    super(props);
    this.shapeSelected = this.shapeSelected.bind(this);
  }

  isShapeSelected() {
    return this.props.params.selectable &&
           this.props.params.selectedShape &&
           this.props.params.selectedShape === this.props.shape;
  }

  shapeSelected(event) {
    event.preventDefault();
    this.props.params.updateSelectedCanvasObject(this.props.shape, null);
  }
}
