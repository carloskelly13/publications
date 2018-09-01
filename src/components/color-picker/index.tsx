import React from "react";
import enhanceWithClickOutside from "react-click-outside";
import { ColorPickerButton, PickerContents } from "./components";
import { convertToRGBA } from "../../util/colors";
import { Text } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";
import { capitalizeString } from "../../util/string";
import { ColorFormats } from "tinycolor2";

interface ColorChangeObj {
  hex: string;
  rgb: { a: number };
}

interface SketchPickerProps {
  color: ColorFormats.RGBA;
  onChangeComplete(change: ColorChangeObj): void;
}

let SketchPicker: React.ComponentClass<SketchPickerProps> | null = null;

interface Props {
  onChange: Function;
  property: string;
  hex: string;
  alpha?: number;
}

interface State {
  isOpen: boolean;
}

export default enhanceWithClickOutside(
  class extends React.Component<Props, State> {
    state = {
      isOpen: false,
    };

    loadReactColorModule = async () => {
      const reactColor = await import(/* webpackChunkName: "reactColor" */ "react-color");
      SketchPicker = reactColor.SketchPicker as React.ComponentClass<
        SketchPickerProps
      >;
    };

    handleButtonSelected = async () => {
      if (!this.state.isOpen && SketchPicker === null) {
        await this.loadReactColorModule();
      }

      this.setState(prevState => ({
        isOpen: !prevState.isOpen,
      }));
    };

    handleClickOutside = () => this.setState({ isOpen: false });

    handleColorChange = ({ hex, rgb: { a } }: ColorChangeObj) => {
      const { property, onChange } = this.props;
      onChange({
        [property]: hex,
        [`${property}Opacity`]: a,
      });
    };

    render() {
      const {
        state: { isOpen },
        props: { hex, alpha, property },
      } = this;
      return (
        <ContentContainer verticalAlign style={{ marginRight: "0.75em" }}>
          <Text center color={AppColors.LightGray} size="0.75em" mr="0.33em">
            {capitalizeString(property)}:
          </Text>
          <ContentContainer verticalAlign style={{ position: "relative" }}>
            <ColorPickerButton
              color={hex}
              onClick={this.handleButtonSelected}
            />
            {isOpen &&
              SketchPicker && (
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
