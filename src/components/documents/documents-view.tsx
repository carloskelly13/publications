import styled, { css } from "styled-components";
import { Colors } from "../../util/constants";

export const Content = styled.div`
  flex: 1;
  color: ${Colors.DocumentsView.Text};
  overflow: scroll;
  display: flex;
`;

export const PreviewPane = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;
  margin: 0 0 10px;
  border-radius: 1px;
  padding: 0;
  width: auto;

  ${props =>
    props.selected &&
    css`
      box-shadow: 0 0 0 2px ${Colors.App.Background},
        0 0 0 4px ${Colors.DocumentThumbnail.SelectedOutline};
    `};
`;

export const DocumentLabel = styled.div`
  text-align: center;
`;

export const EmptyDocument = styled.figure`
  border: 1px dashed ${Colors.DocumentsView.DisabledText};
  color: ${Colors.DocumentsView.DisabledText};
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  border-radius: 4px;
  width: 75px;
  height: 100px;
  margin: 0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &:hover,
  &:active {
    border-color: ${Colors.DocumentsView.Text};
    color: ${Colors.DocumentsView.Text};
  }
`;

export const DocumentsListPanel = styled.div`
  padding: 1em 4em 2em;
  flex: 1;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 180px;
    grid-gap: 1em;
    align-items: center;
    justify-content: flex-start;

    @media only screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media only screen and (min-width: 1024px) {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    @media only screen and (min-width: 1440px) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  }
`;

export const ListItem = styled.li`
  padding: 1em;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 2em);
`;
