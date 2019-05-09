import * as React from "react";
import styled from "styled-components";
import { StateContext } from "../contexts/app-state";
import { PubDocument } from "../types/pub-objects";
import { appFont, Colors } from "../util/constants";
import Canvas from "../components/canvas";
import { RouteComponentProps, navigate } from "@reach/router";

const Content = styled.div`
  flex: 1;
  color: ${Colors.DocumentsView.Text};
  overflow: scroll;
`;

const PreviewPane = styled.div`
  width: 100px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: hidden;
`;

const EmptyDocument = styled.figure`
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
    }

    li.new-document-item {
      border-bottom: 1px dotted ${Colors.DocumentsView.ItemLine};

      &:hover {
        background: hsla(0, 0%, 100%, 0.075);
      }
    }

    li.document-item {
      border-bottom: 1px solid ${Colors.DocumentsView.ItemLine};

      span.action-column {
        display: grid;
        grid-template-columns: repeat(3, auto);
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
`;

const DocumentListItem = styled.li<{ selected?: boolean }>`
  background: ${({ selected }) =>
    selected ? Colors.DocumentsView.ActiveBackground : "transparent"};
  &:hover {
    background: ${({ selected }) =>
      selected
        ? Colors.DocumentsView.ActiveBackground
        : "hsla(0, 0%, 100%, 0.075)"};
  }
`;

const ActionButton = styled.button`
  font-family: ${appFont};
  padding: 0;
  border: none;
  background: transparent;
  color: ${Colors.DocumentsView.Text};
  text-decoration: underline;
  font-weight: 600;
  font-size: 13px;
  margin: 0 0 0 2em;
`;

const DocumentsView: React.FC<RouteComponentProps> = () => {
  const { documents, actions } = React.useContext(StateContext);
  const [
    selectedDocument,
    setSelectedDocument,
  ] = React.useState<PubDocument | null>(null);

  const handleDocumentItemSelected = React.useCallback(
    (event: React.MouseEvent, doc: PubDocument) => {
      event.stopPropagation();
      setSelectedDocument(doc);
    },
    []
  );

  React.useEffect(() => actions.setCurrentDocument(null));
  return (
    <Content>
      <DocumentsListPanel onClick={() => setSelectedDocument(null)}>
        <ul>
          <li className="new-document-item">
            <EmptyDocument>+</EmptyDocument>
            <span>Create New Document</span>
          </li>
          {documents.map(d => (
            <DocumentListItem
              className="document-item"
              onClick={e => handleDocumentItemSelected(e, d)}
              key={d.id}
              selected={selectedDocument && selectedDocument.id === d.id}
            >
              <PreviewPane>
                <Canvas
                  thumbnail
                  dpi={96}
                  zoom={0}
                  allowsEditing={false}
                  width={d.pages[0].width}
                  height={d.pages[0].height}
                  sortedShapes={d.pages[0].shapes}
                  selectedShape={null}
                  updateSelectedObject={() => void 0}
                />
              </PreviewPane>
              <span>
                <strong>{d.name}</strong>
              </span>
              <span>
                {d.pages[0].width}” &times; {d.pages[0].height}”
              </span>
              <span className="action-column">
                <ActionButton onClick={() => navigate(`edit/${d.id}`)}>
                  Edit
                </ActionButton>
                <ActionButton>Rename</ActionButton>
                <ActionButton>Delete</ActionButton>
              </span>
            </DocumentListItem>
          ))}
        </ul>
      </DocumentsListPanel>
    </Content>
  );
};

export default DocumentsView;
