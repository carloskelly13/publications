import React, {PropTypes} from 'react'

const InspectorDocumentAdd = ({addNewShape}) => {
  const _addNewShapeRect = () => addNewShape('rect')
  const _addNewShapeEllipse = () => addNewShape('ellipse')
  const _addNewShapeText = () => addNewShape('text')

  return <div className="inspector-content-section">
    <h1>Add Shape</h1>
    <button className="btn half left" onClick={_addNewShapeRect}>
      Rectangle
    </button>
    <button className="btn half right" onClick={_addNewShapeEllipse}>
      Ellipse
    </button>
    <button className="btn half left" onClick={_addNewShapeText}>
      Text Box
    </button>
  </div>
}

InspectorDocumentAdd.propTypes = {
  addNewShape: PropTypes.func
}

export default InspectorDocumentAdd
