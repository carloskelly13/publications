import React from "react";
import { ColorPickerButton } from "./components";
import { Text } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors, appFont, Colors } from "../../util/constants";
import { capitalizeString } from "../../util/string";
import styled, { createGlobalStyle } from "styled-components";
import {
  Callout,
  ColorPicker,
  getColorFromString,
  IColorPickerStyles,
  IColor,
  ICalloutContentStyles,
} from "office-ui-fabric-react";
import { IColorPickerStyleProps } from "office-ui-fabric-react/src/components/ColorPicker/ColorPicker.types";

const ColorLabel = styled(Text)`
  width: 35%;
  text-align: right;
`;

const ColorButtonContainer = styled(ContentContainer).attrs({
  verticalAlign: true,
})`
  width: 65%;
  position: relative;
`;

interface Props {
  onChange: Function;
  property: string;
  disabled: boolean;
  hex: string;
  alpha: string;
}

const ColorPickerStyle = createGlobalStyle`
  .ms-ColorPicker {
    td {
      color: ${Colors.FormInput.Text};
      font-family: ${appFont};
    }
    .ms-ColorPicker-colorRect, .ms-ColorPicker-slider {
      border: 1px solid transparent;
    }   
    .ms-ColorPicker-thumb {
      background: ${Colors.ColorPicker.ThumbBackground};
      border: 1px solid ${Colors.FormInput.Border};
      box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.233), 1px 1px 2px hsla(0, 0%, 0%, 0.2);
    }   
    input[type="text"] {
      border-radius: 2px;
      padding: 0 4px;
      color: ${Colors.FormInput.Text};
      background: ${Colors.FormInput.MetricBackground};
      border: 1px solid ${Colors.FormInput.Border};
      box-shadow: inset 0 1px 0 hsla(0, 0%, 0%, 0.1), 0 1px 0 hsla(0, 0%, 100%, 0.1);
      font-family: ${appFont};
      font-size: 12px;
      height: 17px;
    
      &:focus {
        border-radius: 2px;
        box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
      }
    } 
    .ms-TextField-fieldGroup {
      border: none;
      background: transparent;
    }
  }
`;

export default function ColorPickerControl(props: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleColorChange = React.useCallback(
    (_, color: IColor) => {
      console.log(color.a);
      props.onChange({
        [props.property]: `#${color.hex}`,
        // [`${props.property}Opacity`]: color.a / 100,
      });
    },
    [props]
  );
  const color = React.useMemo<IColor>(
    () => ({
      ...getColorFromString(props.hex),
      a: parseFloat(props.alpha) * 100,
    }),
    [props.hex, props.alpha]
  );
  const calloutStyle = React.useRef<Partial<ICalloutContentStyles>>({
    beakCurtain: {
      background: "transparent",
    },
    root: {
      border: `1px solid ${Colors.ColorPicker.Border}`,
      borderRadius: 7,
    },
    calloutMain: {
      background: Colors.ColorPicker.Background,
      borderRadius: 6,
    },
    beak: {
      background: Colors.ColorPicker.Background,
    },
  });
  return (
    <ContentContainer verticalAlign>
      <ColorLabel
        center
        color={props.disabled ? AppColors.DisabledGray : AppColors.LightGray}
        size="0.75em"
        mr="0.33em"
      >
        {capitalizeString(props.property)}:
      </ColorLabel>
      <ColorButtonContainer>
        <ColorPickerButton
          ref={buttonRef}
          disabled={props.disabled}
          color={props.hex}
          onClick={() => setIsOpen(true)}
        />
      </ColorButtonContainer>
      {isOpen && (
        <Callout
          styles={calloutStyle.current}
          target={buttonRef.current}
          onDismiss={() => setIsOpen(false)}
        >
          <>
            <ColorPickerStyle />
            <ColorPicker
              alphaLabel="Opacity"
              color={color}
              onChange={handleColorChange}
            />
          </>
        </Callout>
      )}
    </ContentContainer>
  );
}
