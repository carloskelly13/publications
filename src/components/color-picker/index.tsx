import React from "react";
import { ColorPickerButton } from "./components";
import { Text } from "../ui/text";
import { ContentContainer } from "../ui/containers";
import { AppColors } from "../../util/constants";
import { capitalizeString } from "../../util/string";
import styled from "styled-components";

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
}

export default function ColorPicker(props: Props) {
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
        <ColorPickerButton disabled={props.disabled} color={props.hex} />
      </ColorButtonContainer>
    </ContentContainer>
  );
}
