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

const EditorView: React.FC<
  RouteComponentProps<{ documentId: string }>
> = props => {
  const { actions, currentDocument } = React.useContext(StateContext);
  React.useEffect(() => {
    actions.getDocument(props.documentId);
  }, [actions, props.documentId]);
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
