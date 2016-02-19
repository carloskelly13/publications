import React, {Component, PropTypes} from 'react'
import {isEmpty} from 'lodash'
import {autobind} from 'core-decorators'
import InspectorDocument from './inspector.document'
import InspectorShape from './inspector.shape'
import InspectorTabBar from './inspector.tabbar'

export default class InspectorBase extends Component {
  constructor() {
    super(...arguments)
    this.state = {tab: 'document'}
  }

  @autobind
  switchTab(sender) {
    this.setState({tab: sender})
  }

  render() {
    const {
      addNewShape,
      doc,
      selectedShape,
      showInspector,
      updateDocument,
      updateShape,
      updateSelectedCanvasObject
    } = this.props

    const documentLoaded = doc.id
    const inspectorSelectors = `inspector-container ${showInspector ? 'visible' : ''}`
    const currentPane = () => {
      if (documentLoaded && this.state.tab === 'document') {
        return <InspectorDocument
          addNewShape={addNewShape}
          doc={doc}
          shape={selectedShape}
          theme={this.state.theme}
          updateDocument={updateDocument}
          updateSelectedCanvasObject={updateSelectedCanvasObject} />

      } else if (documentLoaded && this.state.tab === 'shape') {
        return <InspectorShape
          doc={doc}
          shape={selectedShape}
          theme={this.state.theme}
          updateDocument={updateDocument}
          updateShape={updateShape}
          updateSelectedCanvasObject={updateSelectedCanvasObject} />
      }
    }

    return <div className={inspectorSelectors}>
      <InspectorTabBar
        selectedTab={this.state.tab}
        switchTab={this.switchTab} />
      {currentPane()}
    </div>
  }
}
