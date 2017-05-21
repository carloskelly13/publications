import React from "react"
import styled from "styled-components"
import asMenu from "../ui/menu-hoc"
import { FillIconButton } from "../ui/icon-buttons/fill"
import { SketchPicker } from "react-color"
import { convertToRGBA } from "../../util/colors"

const PickerContents = styled.div`
  .sketch-picker {
    box-shadow: none !important;
  }
`

const ColorPicker = props => {
  const {
    property, shape, onColorChange
  } = props
  return (
    <PickerContents>
      <SketchPicker
        color={convertToRGBA(
          shape[property],
          shape[`${property}Opacity`]
        )}
        onChangeComplete={({ hex, rgb: { a } }) => {
          onColorChange({
            [property]: hex,
            [`${property}Opacity`]: a
          })
        }}
      />
    </PickerContents>
  )
}

export default asMenu({
  iconButton: FillIconButton,
  menuContent: ColorPicker,
  width: 220
})
