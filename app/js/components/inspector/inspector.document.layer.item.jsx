import React, {Component} from 'react';
import {capitalize} from 'lodash';

export default class InspectorDocumentLayerItem extends Component {
  constructor(props) {
    super(props);
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
                  <div>
                    <span className="layer-item-name">Rectangle</span>
                    <span className="layer-item-size">
                      {shape.width.toFixed(2)}&#8221;&#32;&times;&#32;{shape.height.toFixed(2)}&#8221;
                    </span>
                  </div>);
              case 'ellipse':
                return (
                  <div>
                    <span className="layer-item-name">Ellipse</span>
                    <span className="layer-item-size">
                      {shape.width.toFixed(2)}&#8221;&#32;&times;&#32;{shape.height.toFixed(2)}&#8221;
                    </span>
                  </div>);
              case 'text':
                return (
                  <div>
                    <span className="layer-item-name">Text Box</span>
                    <span className="layer-item-size">
                      {shape.width.toFixed(2)}&#8221;&#32;&times;&#32;{shape.height.toFixed(2)}&#8221;
                    </span>
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
