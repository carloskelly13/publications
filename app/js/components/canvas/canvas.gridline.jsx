import React from 'react'

const CanvasGridline = ({
  mX, mY, major, direction, dX, dY
}) => <path
  className={ major ? 'inchmark' : null }
  d={ `M${mX},${mY} ${direction}${dX},${dY} Z` } />

export default CanvasGridline