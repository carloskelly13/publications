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

const DocumentsView: React.FC<RouteComponentProps> = () => {
  const { documents, actions, deleteDocumentDialogVisible } = React.useContext(
    StateContext
  );
  const [selectedDocument, setSelectedDocument] = React.useState<PubDocument>(
    null
  );

  const handleDocumentItemSelected = React.useCallback(
    (event: React.MouseEvent, doc: PubDocument) => {
      event.stopPropagation();
      if (selectedDocument && selectedDocument.id === doc.id) {
        return;
      }
      setSelectedDocument(doc);
    },
    [selectedDocument]
  );

  const handleDocumentsPanelClick = React.useCallback(() => {
    setSelectedDocument(null);
  }, []);

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
                  selectedDocument && selectedDocument.id === d.id;
                return (
                  <ListItem key={d.id}>
                    <PreviewPane
                      selected={isSelected}
                      onClick={e => handleDocumentItemSelected(e, d)}
                      onDoubleClick={() => navigate(`edit/${d.id}`)}
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
                    {/*<span className="action-column">
                      {isSelected && (
                        <>
                          <ActionButton
                            onClick={() => navigate(`edit/${d.id}`)}
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            onClick={() =>
                              actions.setDeleteDocumentDialogVisible(true)
                            }
                          >
                            Delete
                          </ActionButton>
                        </>
                      )}
                    </span>*/}
                  </ListItem>
                );
              })}
          </ul>
        </DocumentsListPanel>
      </Content>
      <DialogWrapper visible={deleteDocumentDialogVisible}>
        <DeleteDocumentDialog
          doc={selectedDocument}
          onDocumentDelete={() => setSelectedDocument(null)}
        />
      </DialogWrapper>
    </>
  );
};

export default DocumentsView;
