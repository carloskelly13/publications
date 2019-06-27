import styled, { css } from "styled-components";
import { appFont, Colors } from "../../util/constants";

export const Content = styled.div`
  flex: 1;
  color: ${Colors.DocumentsView.Text};
  overflow: scroll;
`;

export const PreviewPane = styled.div`
  width: 100px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;
`;

export const EmptyDocument = styled.figure`
  border: 1px dotted ${Colors.DocumentsView.DisabledText};
  color: ${Colors.DocumentsView.DisabledText};
  font-size: 3em;
  font-weight: lighter;
  text-align: center;
  line-height: 45px;
  border-radius: 4px;
  width: 100px;
  height: 50px;
  margin: 0;
`;

export const DocumentsListPanel = styled.div`
  padding: 1em 4em 2em;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      padding: 1em;
      cursor: default;
      display: grid;
      grid-template-columns: 1fr 2fr 1fr 2fr;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid ${Colors.DocumentsView.ItemLine};

      span.action-column {
        display: grid;
        grid-template-columns: repeat(3, auto);
        align-items: center;
        justify-content: flex-end;
        margin-right: 1em;
      }
    }

    li.new-document-item {
      border-bottom: 1px dotted ${Colors.DocumentsView.ItemLine};
    }
  }
`;

export const inputCSS = css`
  font-weight: bold;
  margin-left: -5px;
`;

export const newDocumentMetricInputCSS = css`
  width: 30px;
  text-align: right;
  margin-right: 3px;
`;

export const NewDocumentMetricContainer = styled.span`
  font-size: 0.9em;
`;

export const ListItem = styled.li<{ selected?: boolean }>`
  background: ${({ selected }) =>
    selected ? Colors.DocumentsView.ActiveBackground : "transparent"};
  &:hover {
    background: ${({ selected }) =>
      selected
        ? Colors.DocumentsView.ActiveBackground
        : "hsla(0, 0%, 100%, 0.075)"};
  }

  ${({ selected }) =>
    selected &&
    css`
      figure {
        border-color: white;
        color: white;
      }
    `};
`;

export const ActionButton = styled.button`
  font-family: ${appFont};
  padding: 0;
  border: none;
  background: transparent;
  color: ${Colors.DocumentsView.Text};
  text-decoration: underline;
  font-weight: 600;
  font-size: 13px;
  margin: 0 0 0 2em;
  &:focus {
    border-radius: 2px;
    box-shadow: 0 0 0 2px ${Colors.FormInput.FocusOutline};
  }
`;
