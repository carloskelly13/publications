import * as React from "react";
import { StateContext } from "../contexts/app-state";
import { PubDocument } from "../types/pub-objects";
import Canvas from "../components/canvas";
import { RouteComponentProps, navigate } from "@reach/router";
import { documentNameSort } from "../util/documents";
import {
  Content,
  ListItem,
  DocumentsListPanel,
  EmptyDocument,
  PreviewPane,
  DocumentLabel,
} from "../components/documents/documents-view";
import DeleteDocumentDialog from "../components/delete-document-dialog";
import DialogWrapper from "../components/modal";
import NewDocumentForm from "../components/new-document";

const DocumentsView: React.FC<RouteComponentProps> = () => {
  const {
    documents,
    actions,
    deleteDocumentDialogVisible,
    selectedDocumentItem,
    newDocumentModalVisible,
  } = React.useContext(StateContext);
  const {
    setCurrentDocument,
    setSelectedObject,
    setSelectedDocumentItem,
  } = actions;

  const handleDocumentItemSelected = React.useCallback(
    (event: React.MouseEvent, doc: PubDocument) => {
      event.stopPropagation();
      if (selectedDocumentItem && selectedDocumentItem.id === doc.id) {
        return;
      }
      setSelectedDocumentItem(doc);
    },
    [selectedDocumentItem, setSelectedDocumentItem]
  );

  React.useEffect(() => {
    setCurrentDocument(null);
    setSelectedObject(null);
  }, [setCurrentDocument, setSelectedObject]);

  const handleDocumentsPanelClick = React.useCallback(() => {
    setSelectedDocumentItem(null);
  }, [setSelectedDocumentItem]);

  const handleDocumentItemDoubleClick = React.useCallback(() => {
    navigate(`edit/${selectedDocumentItem.id}`);
    setSelectedDocumentItem(null);
  }, [selectedDocumentItem, setSelectedDocumentItem]);

  return (
    <>
      <Content>
        <DocumentsListPanel onClick={handleDocumentsPanelClick}>
          <ul>
            <ListItem>
              <EmptyDocument
                onClick={() => actions.setNewDocumentModalVisible(true)}
              >
                Create New Document
              </EmptyDocument>
            </ListItem>
            {!!documents &&
              documents.sort(documentNameSort).map(d => {
                const isSelected =
                  selectedDocumentItem && selectedDocumentItem.id === d.id;
                return (
                  <ListItem key={d.id}>
                    <PreviewPane
                      selected={isSelected}
                      onClick={e => handleDocumentItemSelected(e, d)}
                      onDoubleClick={handleDocumentItemDoubleClick}
                    >
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
                    <DocumentLabel
                      onClick={e => handleDocumentItemSelected(e, d)}
                      onDoubleClick={() => navigate(`edit/${d.id}`)}
                    >
                      <div>
                        <strong>{d.name}</strong>
                      </div>
                      <div>
                        {d.pages[0].width}” &times; {d.pages[0].height}”
                      </div>
                    </DocumentLabel>
                  </ListItem>
                );
              })}
          </ul>
        </DocumentsListPanel>
      </Content>
      <DialogWrapper visible={deleteDocumentDialogVisible}>
        <DeleteDocumentDialog
          doc={selectedDocumentItem}
          onDocumentDelete={() => setSelectedDocumentItem(null)}
        />
      </DialogWrapper>
      <DialogWrapper visible={newDocumentModalVisible}>
        <NewDocumentForm />
      </DialogWrapper>
    </>
  );
};

export default DocumentsView;
