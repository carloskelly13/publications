import styled, { css } from "styled-components";
import { Colors } from "../../util/constants";

export const InspectorContainer = styled.div<{ visible?: boolean }>`
  width: 250px;
  background: ${Colors.Inspector.Background};
  border-left: 1px solid ${Colors.Inspector.Border};
  z-index: 2;
  height: 100%;
  flex-direction: column;
  right: 0;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  overflow: scroll;

  @media print {
    display: none;
  }
`;

export const SectionTitle = styled.h1<{ marginTop?: boolean }>`
  color: ${Colors.Inspector.SectionTitleText};
  font-weight: bold;
  font-size: 1.1em;
  padding: 0 0.8em;
  margin-bottom: 0.667em;
  ${({ marginTop }) =>
    marginTop &&
    css`
      margin-top: 1em;
    `};
`;

export const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 0.4em));
  grid-gap: 0.8em;
  padding: 0 0.8em;
  margin-bottom: 2em;
`;

export const VerticalControlGrid = styled.div`
  grid-template-rows: repeat(2, 100%);
  grid-gap: 0.8em;
  padding: 0 0.8em;
  margin-bottom: 1em;
`;

export const Separator = styled.div`
  height: 1px;
  background-color: hsla(0, 0%, 0%, 0.25);
`;

export const Text = styled.p<{ bold?: boolean }>`
  color: #fff;
  margin: 0 0.8em;
  ${({ bold }) =>
    bold &&
    css`
      font-weight: bold;
    `};
`;

export const Tabs = styled.nav`
  background: ${Colors.Inspector.Border};
  border-bottom: 1px solid ${Colors.Inspector.Border};
  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(4, 33%);
`;

export const Tab = styled.div<{ active: boolean }>`
  background: ${({ active }) =>
    active
      ? Colors.Inspector.TabActiveBackground
      : Colors.Inspector.TabInactiveBackground};
  color: ${Colors.Inspector.Text};
  text-transform: uppercase;
  padding: 0.5em 0;
  align-items: center;
  justify-content: center;
  display: flex;
`;
