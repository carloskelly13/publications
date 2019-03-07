import styled, { css } from "styled-components";
import { Colors } from "../../util/constants";

export const InspectorContainer = styled.div<{ visible?: boolean }>`
  background: ${Colors.Inspector.Background};
  border-left: 1px solid ${Colors.Inspector.Border};
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  flex: 0 1 250px;
  height: 100%;
  overflow: scroll;
  position: relative;
  right: 0;
  z-index: 5;

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

export const ControlGrid = styled.div<{ compressedMargins?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 0.4em));
  grid-gap: 0.8em;
  padding: 0 0.8em;
  margin-bottom: 2em;
  ${({ compressedMargins }) =>
    compressedMargins &&
    css`
      margin-bottom: 1em;
    `};
`;

export const VerticalControlGrid = styled.div`
  display: grid;
  grid-template-rows: auto;
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
  grid-template-columns: repeat(2, 50%);
`;

export const Tab = styled.div<{ active: boolean }>`
  align-items: center;
  background: ${({ active }) =>
    active
      ? Colors.Inspector.TabActiveBackground
      : Colors.Inspector.TabInactiveBackground};
  color: ${Colors.Inspector.Text};
  cursor: default;
  display: flex;
  font-size: 14px;
  font-weight: bold;
  justify-content: center;
  padding: 0.5em 0;
`;
