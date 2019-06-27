import * as React from "react";
import { StateContext } from "../contexts/app-state";
import { PubDocument } from "../types/pub-objects";
import { Keys } from "../util/constants";
import Canvas from "../components/canvas";
import { RouteComponentProps, navigate } from "@reach/router";
import { TextInput } from "../components/ui/inputs";
import { documentNameSort, validatePositiveFloat } from "../util/documents";
import {
  ActionButton,
  Content,
  ListItem,
  DocumentsListPanel,
  EmptyDocument,
  PreviewPane,
  inputCSS,
  newDocumentMetricInputCSS,
  NewDocumentMetricContainer,
} from "../components/documents/documents-view";

const DocumentsView: React.FC<RouteComponentProps> = () => {
  const { documents, actions } = React.useContext(StateContext);
  const newDocumentNameInputRef = React.useRef<HTMLInputElement>(null);
  const [
    selectedDocument,
    setSelectedDocument,
  ] = React.useState<PubDocument | null>(null);
  const [isCreatingNewDocument, setIsCreatingNewDocument] = React.useState(
    false
  );
  const [renamingDocumentId, setRenamingDocumentId] = React.useState<
    string | null
  >(null);
  const [newDocumentName, setNewDocumentName] = React.useState("");
  const [newDocumentHeight, setNewDocumentHeight] = React.useState<
    string | number
  >(11);
  const [newDocumentWidth, setNewDocumentWidth] = React.useState<
    string | number
  >(8.5);

  const handleDocumentItemSelected = React.useCallback(
    (event: React.MouseEvent, doc: PubDocument) => {
      setIsCreatingNewDocument(false);
      event.stopPropagation();
      if (selectedDocument && selectedDocument.id === doc.id) {
        return;
      }
      setSelectedDocument(doc);
    },
    [selectedDocument]
  );

  const handleCreateNewDocument = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedDocument(null);
      if (isCreatingNewDocument) {
        return;
      }
      setNewDocumentName("New Document");
      setNewDocumentHeight(11);
      setNewDocumentWidth(8.5);
      setIsCreatingNewDocument(true);
    },
    [isCreatingNewDocument]
  );

  React.useEffect(() => {
    if (isCreatingNewDocument && newDocumentNameInputRef.current) {
      const input = newDocumentNameInputRef.current;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  }, [isCreatingNewDocument]);

  React.useEffect(() => {
    if (!selectedDocument || selectedDocument.id !== renamingDocumentId) {
      setRenamingDocumentId(null);
    }
  }, [renamingDocumentId, selectedDocument]);
  React.useEffect(() => actions.setCurrentDocument(null));

  const handleDocumentsPanelClick = React.useCallback(() => {
    setIsCreatingNewDocument(false);
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

  const handleUpdateNewDocumentName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const possibleName = event.target.value;
      setNewDocumentName(possibleName);
    },
    []
  );

  const handleUpdateNewDocumentWidth = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const possibleNumber = event.target.value;
      if (validatePositiveFloat(possibleNumber)) {
        setNewDocumentWidth(possibleNumber);
      }
    },
    []
  );

  const handleUpdateNewDocumentHeight = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const possibleNumber = event.target.value;
      if (validatePositiveFloat(possibleNumber)) {
        setNewDocumentHeight(possibleNumber);
      }
    },
    []
  );

  const handleCreateNewDocumentSubmit = React.useCallback(async () => {
    await actions.handleCreateNewDocument({
      height: parseFloat(newDocumentHeight.toString()),
      name: newDocumentName,
      width: parseFloat(newDocumentWidth.toString()),
    });
    setIsCreatingNewDocument(false);
  }, [actions, newDocumentHeight, newDocumentName, newDocumentWidth]);

  return (
    <Content>
      <DocumentsListPanel onClick={handleDocumentsPanelClick}>
        <ul>
          <ListItem
            className="new-document-item"
            onClick={handleCreateNewDocument}
            selected={isCreatingNewDocument}
          >
            {isCreatingNewDocument ? (
              <>
                <EmptyDocument>+</EmptyDocument>
                <span>
                  <TextInput
                    innerRef={newDocumentNameInputRef}
                    value={newDocumentName}
                    onChange={handleUpdateNewDocumentName}
                    css={inputCSS}
                  />
                </span>
                <NewDocumentMetricContainer>
                  <TextInput
                    value={newDocumentWidth}
                    onChange={handleUpdateNewDocumentWidth}
                    css={newDocumentMetricInputCSS}
                  />
                  ”&nbsp;&times;&nbsp;
                  <TextInput
                    value={newDocumentHeight}
                    onChange={handleUpdateNewDocumentHeight}
                    css={newDocumentMetricInputCSS}
                  />
                  ”
                </NewDocumentMetricContainer>
                <span className="action-column">
                  <ActionButton onClick={handleCreateNewDocumentSubmit}>
                    Create
                  </ActionButton>
                </span>
              </>
            ) : (
              <>
                <EmptyDocument>+</EmptyDocument>
                <span>
                  <strong>New Document</strong>
                </span>
              </>
            )}
          </ListItem>
          {documents.sort(documentNameSort).map(d => {
            const isSelected = selectedDocument && selectedDocument.id === d.id;
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
                      <ActionButton onClick={() => setRenamingDocumentId(d.id)}>
                        Rename
                      </ActionButton>
                      <ActionButton>Delete</ActionButton>
                    </>
                  )}
                  {isSelected && isRenaming && (
                    <>
                      <ActionButton onClick={handleUpdateDocumentName}>
                        Update
                      </ActionButton>
                      <ActionButton onClick={() => setRenamingDocumentId(null)}>
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
