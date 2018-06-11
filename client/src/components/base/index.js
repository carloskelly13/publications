import styled, { injectGlobal } from "styled-components";
import { appFont, AppColors, Colors } from "../../util/constants";

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html, body {
    font-family: ${appFont};
    text-rendering: optimizeLegibility;
    font-feature-settings: "kern" 1, "dlig" 1;
    -moz-font-feature-settings: "kern" 1, "dlig" 1;
    font-size: 14px;
  }
`;

export default styled.div`
  background: ${Colors.App.Background};
  color: ${AppColors.DarkGray};
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
