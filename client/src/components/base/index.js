import styled from "styled-components";
import { appFont, AppColors } from "../../util/constants";

export default styled.div`
  font-family: ${appFont};
  color: ${AppColors.DarkGray};
  font-size: 14px;
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
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "dlig" 1;
  -moz-font-feature-settings: "kern" 1, "dlig" 1;
`;
