// @flow
import type {
  ColorPickerProps,
  ColorPickerState,
  ColorChangeObj,
} from "./types";
import React from "react";
import enhanceWithClickOutside from "react-click-outside";
import { SketchPicker } from "react-color";
import { ColorPickerButton, PickerContents } from "./components";
import { convertToRGBA } from "../../util/colors";
import { Text } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";
import { capitalizeString } from "./../../util/string";

export default enhanceWithClickOutside(
  class extends React.Component<ColorPickerProps, ColorPickerState> {
    state = {
      isOpen: false,
    };

    handleButtonSelected = () =>
      this.setState(prevState => ({
        isOpen: !prevState.isOpen,
      }));

    handleClickOutside = () => this.setState({ isOpen: false });

    handleColorChange = ({ hex, rgb: { a } }: ColorChangeObj) => {
      const { property, onChange } = this.props;
      onChange({
        [property]: hex,
        [`${property}Opacity`]: a,
      });
    };

    render() {
      const { state: { isOpen }, props: { hex, alpha, property } } = this;
      return (
        <ContentContainer verticalAlign style={{ marginRight: "0.75em" }}>
          <Text center color={AppColors.DarkGray} size="0.75em" mr="0.33em">
            {capitalizeString(property)}:
          </Text>
          <ContentContainer verticalAlign style={{ position: "relative" }}>
            <ColorPickerButton
              color={hex}
              onClick={this.handleButtonSelected}
            />
            {isOpen && (
              <PickerContents>
                <SketchPicker
                  color={convertToRGBA(hex, alpha)}
                  onChangeComplete={this.handleColorChange}
                />
              </PickerContents>
            )}
          </ContentContainer>
        </ContentContainer>
      );
    }
  }
);
