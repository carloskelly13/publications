// @flow
import React from "react";
import Logo from "./icons/logo";
import styled from "styled-components";
import { Colors } from "../../util/constants";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const AppName = styled.div<{ textColor?: string; fontSize?: string }>`
  color: ${({ textColor }) => textColor};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: 600;
`;

interface Props {
  textColor?: string;
  outlineColor?: string;
  backgroundColor?: string;
  iconSize?: number;
  fontSize?: string;
}

const LogoBanner: React.SFC<Props> = props => (
  <Container>
    <Logo
      size={props.iconSize}
      outline={props.outlineColor}
      background={props.backgroundColor}
    />
    <AppName textColor={props.textColor} fontSize={props.fontSize}>
      Publications
    </AppName>
  </Container>
);

LogoBanner.defaultProps = {
  outlineColor: Colors.Logo.Outline,
  backgroundColor: Colors.Logo.Background,
  textColor: Colors.StartView.AppNameColor,
  iconSize: 96,
  fontSize: "1.667em",
};

export default LogoBanner;
