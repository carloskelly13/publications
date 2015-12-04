import React, {Component, PropTypes} from 'react'
import {isEmpty} from 'lodash'
import InspectorDocument from './inspector.document'
import InspectorShape from './inspector.shape'
import InspectorBreadcrumbBar from './inspector.breadcrumb'

export default class InspectorBase extends Component {
  constructor() {
    super(...arguments)
    this.state = {theme: 'light'}
  }

  render() {
    let
      currentPane = '',
      {
        doc,
        selectedShape,
        showInspector,
        updateDocument,
        updateShape,
        updateSelectedCanvasObject
      } = this.props,
      documentLoaded = !isEmpty(doc.get('_id'))

    if (documentLoaded && !!selectedShape) {
      currentPane = (
        <InspectorShape
          doc={doc}
          shape={selectedShape}
          theme={this.state.theme}
          updateDocument={updateDocument}
          updateShape={updateShape}
          updateSelectedCanvasObject={updateSelectedCanvasObject}
          />
      )

    } else if (documentLoaded & !selectedShape) {
      currentPane = (
        <InspectorDocument
          doc={doc}
          theme={this.state.theme}
          updateDocument={updateDocument}
          updateSelectedCanvasObject={updateSelectedCanvasObject}
          />
      )
    }

    return (
      <div className={`inspector-container ${showInspector ? 'inspector-container-visible' : ''} ${this.state.theme}`}>
        <InspectorBreadcrumbBar
          shape={selectedShape}
          updateSelectedCanvasObject={this.props.updateSelectedCanvasObject}/>
        {currentPane}
      </div>
    )
  }
}
