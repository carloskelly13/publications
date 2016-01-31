import React, {Component, PropTypes} from 'react'
import {isEmpty} from 'lodash'
import InspectorDocument from './inspector.document'
import InspectorShape from './inspector.shape'
import InspectorTabBar from './inspector.tabbar'

export default class InspectorBase extends Component {
  constructor() {
    super(...arguments)
    this.state = {theme: 'light', tab: 'document'}
  }

  switchTab(sender) {
    this.setState({tab: sender})
  }

  render() {
    let
      currentPane = '',
      {
        addNewShape,
        doc,
        selectedShape,
        showInspector,
        updateDocument,
        updateShape,
        updateSelectedCanvasObject
      } = this.props,
      documentLoaded = !isEmpty(doc.get('id'))

    if (documentLoaded) {
      switch (this.state.tab) {
        case 'document':
        currentPane = (
          <InspectorDocument
            addNewShape={addNewShape}
            doc={doc}
            shape={selectedShape}
            theme={this.state.theme}
            updateDocument={updateDocument}
            updateSelectedCanvasObject={updateSelectedCanvasObject}
          />
        )
        break

        case 'shape':
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
        break
      }
    }

    return (
      <div className={`inspector-container ${showInspector ? 'inspector-container-visible' : ''} ${this.state.theme}`}>
        <InspectorTabBar
          selectedTab={this.state.tab}
          switchTab={::this.switchTab}
        />
        {currentPane}
      </div>
    )
  }
}
