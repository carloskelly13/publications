import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import enhanceWithClickOutside from "react-click-outside"
import { SketchPicker } from "react-color"
import { convertToRGBA } from "../../util/colors"
import { MediumText } from "../ui/text"
import { ContentContainer } from "../ui/containers"
import { AppColors } from "../../util/constants"
import { capitalizeString } from "./../../util/string"

const ColorPickerButton = styled.button`
  width: 32px;
  height: 17px;
  border: 1px solid ${AppColors.Border};
  box-shadow: inset 0 0 0 1px #fff;
  border-radius: 2px;
  background: ${({ color }) => color};
  outline-color: ${({ color }) => color};
  margin: 0;
`

const PickerContents = styled.div`
  position: absolute;
  top: 19px;
  left: 0;
`

export class ColorPicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    property: PropTypes.string.isRequired,
    shape: PropTypes.object.isRequired
  }

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
      props: { property, shape }
    } = this
    return (
      <ContentContainer
        verticalAlign
        style={{ marginRight: "0.75em" }}
      >
        <MediumText
          center
          color={AppColors.DarkGray}
          size="0.75em"
          mr="0.33em"
        >
          { capitalizeString(property) }
        </MediumText>
        <ContentContainer
          verticalAlign
          style={{ position: "relative" }}
        >
          <ColorPickerButton
            color={shape[property]}
            onClick={this.handleButtonSelected}
          />
          { isOpen && (
            <PickerContents>
              <SketchPicker
                color={convertToRGBA(
                  shape[property],
                  shape[`${property}Opacity`]
                )}
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
