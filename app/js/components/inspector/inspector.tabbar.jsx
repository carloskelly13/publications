import React from 'react'

const InspectorTabBar = ({selectedTab, switchTab}) => {
  const _switchTabToDocument = () => switchTab('document')
  const _switchTabToShape = () => switchTab('shape')

  return <div className="inspector-tab-bar">
    <div
      className={`tab-button ${selectedTab === 'document' ? 'active' : ''}`}
      onClick={_switchTabToDocument}>
      Document
    </div>
    <div
      className={`tab-button ${selectedTab === 'shape' ? 'active' : ''}`}
      onClick={_switchTabToShape}>
      Shape
    </div>
  </div>
}

export default InspectorTabBar
