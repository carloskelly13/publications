import * as React from "react";
import styled from "styled-components";
import LayersSidebar from "../components/inspector";
import Editor from "../components/editor";
import { RouteComponentProps } from "@reach/router";
import { StateContext } from "../contexts/app-state";

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

type EditorView = React.FC<
  RouteComponentProps<{
    documentId: string;
  }>
>;
const EditorView: EditorView = props => {
  const { currentDocument, actions, dataLoaded } = React.useContext(
    StateContext
  );
  const getDocument = React.useRef(actions.getDocument);
  const documentId = React.useRef(props.documentId);
  React.useEffect(() => {
    if (!dataLoaded) {
      return;
    }
    getDocument.current(documentId.current);
  }, [dataLoaded]);
  return (
    <Content>
      {currentDocument && (
        <>
          <Editor />
          <LayersSidebar />
        </>
      )}
    </Content>
  );
};

export default EditorView;
