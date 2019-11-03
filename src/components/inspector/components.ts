import styled, { css } from "styled-components";
import { Colors } from "../../util/constants";

export const InspectorContainer = styled.div<{ visible?: boolean }>`
  background: ${Colors.Inspector.Background};
  box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, 0.1);
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  top: 25px;
  width: 250px;

  @media print {
    display: none;
  }
`;

export const SectionTitle = styled.h1<{ marginTop?: boolean }>`
  color: ${Colors.Inspector.SectionTitleText};
  font-weight: bold;
  font-size: 12px;
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
  margin-bottom: 1.5em;
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
  background: ${Colors.App.Background};
  display: grid;
  grid-template-columns: repeat(2, 50%);
`;

export const Tab = styled.div<{ active: boolean }>`
  align-items: center;
  background: ${({ active }) =>
    active
      ? Colors.Inspector.TabActiveBackground
      : Colors.Inspector.TabInactiveBackground};
  box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, 0.2);
  color: ${Colors.Inspector.Text};
  cursor: default;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  margin-top: 2px;
  justify-content: center;
  height: 23px;
  ${({ active }) =>
    active &&
    css`
      border-radius: 4px 4px 0 0;
      box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, 0.1);
    `};
`;
