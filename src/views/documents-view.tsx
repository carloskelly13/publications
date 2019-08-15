import * as React from "react";
import { StateContext } from "../contexts/app-state";
import { PubDocument } from "../types/pub-objects";
import { Keys } from "../util/constants";
import Canvas from "../components/canvas";
import { RouteComponentProps, navigate } from "@reach/router";
import { TextInput } from "../components/ui/inputs";
import { documentNameSort } from "../util/documents";
import {
  ActionButton,
  Content,
  ListItem,
  DocumentsListPanel,
  EmptyDocument,
  PreviewPane,
  inputCSS,
} from "../components/documents/documents-view";

const DocumentsView: React.FC<RouteComponentProps> = () => {
  const { documents, actions } = React.useContext(StateContext);
  const [selectedDocument, setSelectedDocument] = React.useState<PubDocument>(
    null
  );
  const [renamingDocumentId, setRenamingDocumentId] = React.useState<string>(
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

  React.useEffect(() => {
    if (!selectedDocument || selectedDocument.id !== renamingDocumentId) {
      setRenamingDocumentId(null);
    }
  }, [renamingDocumentId, selectedDocument]);

  const handleDocumentsPanelClick = React.useCallback(() => {
    setSelectedDocument(null);
  }, []);

  const handleDocumentRename = React.useCallback(({ target }) => {
    setSelectedDocument(prevDoc => ({
      ...prevDoc,
      name: target.value,
    }));
  }, []);

  const handleUpdateDocumentName = React.useCallback(async () => {
    try {
      await actions.saveDocument(selectedDocument);
      setRenamingDocumentId(null);
    } catch (e) {
      console.error("Cannot rename document.", e);
    }
  }, [actions, selectedDocument]);

  const handleDocumentNameKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === Keys.Esc) {
        setRenamingDocumentId(null);
      } else if (event.keyCode === Keys.Enter) {
        handleUpdateDocumentName().then(void 0);
      }
    },
    [handleUpdateDocumentName]
  );

  const handleDocumentDelete = React.useCallback(
    async (id: string | number) => {
      await actions.deleteDocument(id);
    },
    [actions]
  );

  return (
    <Content>
      <DocumentsListPanel onClick={handleDocumentsPanelClick}>
        <ul>
          <ListItem
            className="new-document-item"
            onClick={() => actions.setNewDocumentModalVisible(true)}
          >
            <EmptyDocument>+</EmptyDocument>
            <span>
              <strong>New Document</strong>
            </span>
          </ListItem>
          {!!documents &&
            documents.sort(documentNameSort).map(d => {
              const isSelected =
                selectedDocument && selectedDocument.id === d.id;
              const isRenaming = renamingDocumentId === d.id;
              return (
                <ListItem
                  className="document-item"
                  onClick={e => handleDocumentItemSelected(e, d)}
                  key={d.id}
                  selected={isSelected}
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
                    {isSelected && isRenaming ? (
                      <TextInput
                        value={selectedDocument.name}
                        onChange={handleDocumentRename}
                        css={inputCSS}
                        onKeyDown={handleDocumentNameKeyDown}
                      />
                    ) : (
                      <strong>{d.name}</strong>
                    )}
                  </span>
                  <span>
                    {d.pages[0].width}” &times; {d.pages[0].height}”
                  </span>
                  <span className="action-column">
                    {isSelected && !isRenaming && (
                      <>
                        <ActionButton onClick={() => navigate(`edit/${d.id}`)}>
                          Edit
                        </ActionButton>
                        <ActionButton
                          onClick={() => setRenamingDocumentId(d.id)}
                        >
                          Rename
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDocumentDelete(d.id)}
                        >
                          Delete
                        </ActionButton>
                      </>
                    )}
                    {isSelected && isRenaming && (
                      <>
                        <ActionButton onClick={handleUpdateDocumentName}>
                          Update
                        </ActionButton>
                        <ActionButton
                          onClick={() => setRenamingDocumentId(null)}
                        >
                          Cancel
                        </ActionButton>
                      </>
                    )}
                  </span>
                </ListItem>
              );
            })}
        </ul>
      </DocumentsListPanel>
    </Content>
  );
};

export default DocumentsView;
