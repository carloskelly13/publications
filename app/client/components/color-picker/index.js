// @flow
import React, { Component } from "react"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"
import { SketchPicker } from "react-color"
import { convertToRGBA } from "../../util/colors"
import { Text } from "../ui/text"
import { ContentContainer } from "../ui/containers"
import { AppColors } from "../../util/constants"
import { capitalizeString } from "./../../util/string"

const ColorPickerButton = styled.button`
  width: 32px;
  height: 15px;
  border: 1px solid ${AppColors.Gray40};
  box-shadow: inset 0 0 0 1px #fff;
  border-radius: 2px;
  background: ${({ color }) => color};
  outline: none;
  margin: 0;
  &:focus {
    box-shadow: inset 0 0 0 1px #fff, 0 0 0 1px ${AppColors.Highlight};
  }
`

const PickerContents = styled.div`
  position: absolute;
  top: 19px;
  left: 0;
`

type ColorPickerProps = {
  onChange: Function,
  property: string,
  hex: string,
  alpha?: number
}
export class ColorPicker extends Component<ColorPickerProps> {
  state = {
    isOpen: false
  }

  handleButtonSelected = () => this.setState(prevState => ({
    isOpen: !prevState.isOpen
  }))

  handleClickOutside = () => this.setState({ isOpen: false })

  handleColorChange = ({ hex, rgb: { a } }) => {
    const { property, onChange } = this.props
    onChange({
      [property]: hex,
      [`${property}Opacity`]: a
    })
  }

  render() {
    const {
      state: { isOpen },
      props: { hex, alpha, property }
    } = this
    return (
      <ContentContainer
        verticalAlign
        style={{ marginRight: "0.75em" }}
      >
        <Text
          center
          color={AppColors.DarkGray}
          size="0.75em"
          mr="0.33em"
        >
          { capitalizeString(property) }:
        </Text>
        <ContentContainer
          verticalAlign
          style={{ position: "relative" }}
        >
          <ColorPickerButton
            color={hex}
            onClick={this.handleButtonSelected}
          />
          { isOpen && (
            <PickerContents>
              <SketchPicker
                color={convertToRGBA(hex, alpha)}
                onChangeComplete={this.handleColorChange}
              />
            </PickerContents>
          ) }
        </ContentContainer>
      </ContentContainer>
    )
  }
}

export default enhanceWithClickOutside(ColorPicker)
