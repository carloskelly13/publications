import styled, { createGlobalStyle } from "styled-components";
import { appFont, AppColors, Colors } from "../../util/constants";

export const AppStyle = createGlobalStyle`
  html, body {
    font-family: ${appFont};
    text-rendering: optimizeLegibility;
    font-feature-settings: "kern" 1, "dlig" 1, "tnum" 0, "ss01" 1, "ss02" 1;
    -moz-font-feature-settings: "kern" 1, "dlig" 1;
    font-size: 14px;
  }
`;

export const AppContainer = styled.div`
  background: ${Colors.App.Background};
  color: ${AppColors.DarkGray};
  margin: 0;
  padding: 0;
  position: absolute;
  overflow: hidden;
  width: 100vw;
  display: flex;
  flex-direction: column;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  @media print {
    height: 100vh;
  }
`;
