import React, {Component, PropTypes} from 'react'

export default class InspectorDocumentAdd extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className="inspector-content-section">
        <h1>Add Shape</h1>
          <button className="button button-full" onClick={this.props.addNewShape.bind(this, 'rect')}>
            Rectangle
          </button>
          <button className="button button-full" onClick={this.props.addNewShape.bind(this, 'ellipse')}>
            Ellipse
          </button>
          <button className="button button-full" onClick={this.props.addNewShape.bind(this, 'text')}>
            Text Box
          </button>
      </div>
    )
  }
}
