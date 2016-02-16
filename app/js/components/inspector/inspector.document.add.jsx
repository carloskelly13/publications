import React, {PropTypes} from 'react'

const InspectorDocumentAdd = ({addNewShape}) => <div className="inspector-content-section">
  <h1>Add Shape</h1>
  <button className="btn half left" onClick={addNewShape.bind(this, 'rect')}>
    Rectangle
  </button>
  <button className="btn half right" onClick={addNewShape.bind(this, 'ellipse')}>
    Ellipse
  </button>
  <button className="btn half left" onClick={addNewShape.bind(this, 'text')}>
    Text Box
  </button>
</div>

InspectorDocumentAdd.propTypes = {
  addNewShape: PropTypes.func
}

export default InspectorDocumentAdd
