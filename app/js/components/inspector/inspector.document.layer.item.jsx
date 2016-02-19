import React, {Component} from 'react'
import {autobind} from 'core-decorators'
import {eq} from 'lodash'

export default class InspectorDocumentLayerItem extends Component {
  constructor() {
    super(...arguments)
  }

  @autobind
  updateSelectedCanvasObject() {
    this.props.updateSelectedCanvasObject(this.props.shape)
  }

  render() {
    const {shape, isSelected} = this.props

    const layerIcon = () => {
      switch (shape.type) {
        case 'rect':
        return <span className="layer-item-icon"
          style={{background: shape.fill, border: `1px solid ${shape.stroke}`}}>
        </span>

        case 'ellipse':
        return <span className="layer-item-icon layer-item-icon-ellipse"
          style={{background: shape.fill, border: `1px solid ${shape.stroke}`}}>
        </span>

        case 'text':
        return <span className="layer-item-icon layer-item-icon-text"
          style={{color: shape.color}}>
          Aa
        </span>

        default: return <div />
      }
    }

    return <li
      className={isSelected ? 'layer-active' : null}
      onClick={this.updateSelectedCanvasObject}>
      {layerIcon()}
      <span className="layer-item-size">
        X:&#32;{shape.x.toFixed(2)}&#8221;
        Y:&#32;{shape.y.toFixed(2)}&#8221;
        W:&#32;{shape.width.toFixed(2)}&#8221;
        H:&#32;{shape.height.toFixed(2)}&#8221;
      </span>
    </li>
  }
}
