import React, {Component} from 'react';
import {capitalize} from 'lodash';

export default class InspectorDocumentLayerItem extends Component {
  constructor(props) {
    super(props);
  }

  dimensionsElement(shape) {
    return (
      <span className="layer-item-size">
        X:&#32;{shape.x.toFixed(2)}&#8221;
        Y:&#32;{shape.y.toFixed(2)}&#8221;
        W:&#32;{shape.width.toFixed(2)}&#8221;
        H:&#32;{shape.height.toFixed(2)}&#8221;
      </span>
    )
  }

  render() {
    let {shape} = this.props;

    return (
      <li onClick={::this.layerItemSelected}>
        {
          (() => {
            switch (shape.type) {
              case 'rect':
                return (
                  <div className="row">
                    <span className="layer-item-icon" style={{background: shape.fill, border: `1px solid ${shape.stroke}`}}></span>
                    <div className="box">
                      <span className="layer-item-name">Rectangle</span>
                      { this.dimensionsElement(shape) }
                    </div>
                  </div>);
              case 'ellipse':
                return (
                  <div className="row">
                    <span className="layer-item-icon layer-item-icon-ellipse" style={{background: shape.fill, border: `1px solid ${shape.stroke}`}}></span>
                    <div className="box">
                      <span className="layer-item-name">Ellipse</span>
                      { this.dimensionsElement(shape) }
                    </div>
                  </div>);
              case 'text':
                return (
                  <div className="row">
                    <span className="layer-item-icon layer-item-icon-text" style={{color: shape.color}}>Aa</span>
                    <div className="box">
                      <span className="layer-item-name">Text Box</span>
                      { this.dimensionsElement(shape) }
                    </div>
                  </div>);
              default:
                return <div></div>;
            }
          })()
        }
      </li>
    )
  }

  layerItemSelected(sender) {
    this.props.updateSelectedCanvasObject(this.props.shape);
  }
}
