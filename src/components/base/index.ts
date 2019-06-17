import styled, { injectGlobal } from "styled-components";
import { appFont, AppColors, Colors } from "../../util/constants";

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html, body {
    font-family: ${appFont};
    text-rendering: optimizeLegibility;
    font-feature-settings: "kern" 1, "dlig" 1, "tnum" 1, "ss01" 1, "ss02" 1;
    -moz-font-feature-settings: "kern" 1, "dlig" 1;
    font-size: 14px;
  }

  /* ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${Colors.ScrollBar.Track};
  }
  ::-webkit-scrollbar-corner {
    background: ${Colors.ScrollBar.Corner};
  }
  ::-webkit-scrollbar-thumb {
    background: ${Colors.ScrollBar.Thumb};
    box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.2),
    1px 1px 2px hsla(0, 0%, 0%, 0.25);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${Colors.ScrollBar.ThumbHover};
  } */
`;

export default styled.div`
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
