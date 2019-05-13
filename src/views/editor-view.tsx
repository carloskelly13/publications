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
  const { currentDocument, actions } = React.useContext(StateContext);
  const getDocument = React.useRef(actions.getDocument);
  React.useEffect(() => {
    getDocument.current(props.documentId);
  }, [props.documentId]);
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
