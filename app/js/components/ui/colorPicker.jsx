import React from 'react'
import { colors } from 'core/constants'

export const ColorPicker = ({
  updateColor
}) => {
  const colorSwatches = colors.map((color, idx) => <div
    key={ `color-${idx}` }
    className="swatch"
    style={ { background: color } }
    onClick={ () => updateColor(color) }>
  </div>)

  return <div className="color-picker">
    { colorSwatches }
  </div>
}
