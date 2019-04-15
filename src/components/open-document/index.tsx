import React from "react";
import Button from "../ui/framed-button";
import {
  OpenDocumentContainer,
  FileBrowserContainer,
  SearchInputContainer,
  SearchInput,
  FileBrowserContentContainer,
} from "./components";
import { PubDocument } from "../../types/pub-objects";
import { StateContext } from "../../contexts/documents-provider";
import { FileItem } from "./file-item";

export default function OpenDocumentDialog() {
  const { documents, actions } = React.useContext(StateContext);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const [
    selectedDocument,
    setSelectedDocument,
  ] = React.useState<PubDocument | null>(null);
  const handleOpenButtonClicked = React.useCallback(() => {
    actions.getDocument(selectedDocument.id);
    actions.setOpenDocumentModalVisible(false);
  }, [actions, selectedDocument]);
  const filterDocuments = React.useCallback(
    (doc: PubDocument) => {
      if (searchKeyword.trim().length === 0) {
        return true;
      }
      return doc.name
        .toLowerCase()
        .includes(searchKeyword.trim().toLowerCase());
    },
    [searchKeyword]
  );

  return (
    <OpenDocumentContainer>
      <FileBrowserContainer>
        <SearchInputContainer>
          <SearchInput
            value={searchKeyword}
            onChange={({ target }) => setSearchKeyword(target.value)}
            placeholder="Search for Documents"
          />
          <Button
            marginRight
            disabled={selectedDocument === null}
            onClick={handleOpenButtonClicked}
          >
            Open Document
          </Button>
          <Button onClick={() => actions.setOpenDocumentModalVisible(false)}>
            Close
          </Button>
        </SearchInputContainer>
        <FileBrowserContentContainer disabled={false}>
          {documents.filter(filterDocuments).map((doc: PubDocument) => (
            <FileItem
              selected={selectedDocument && selectedDocument.id === doc.id}
              handleClick={() => setSelectedDocument(doc)}
              key={doc.id}
              doc={doc}
            />
          ))}
        </FileBrowserContentContainer>
      </FileBrowserContainer>
    </OpenDocumentContainer>
  );
}

// class OpenDocumentDialog extends React.Component<Props, State> {
//   readonly state: State = {
//     selectedDocument: null,
//     showDeleteConfirmBar: false,
//     showRenameActionBar: false,
//     potentialNewDocumentName: "",
//   };

//   renameInputRef: HTMLInputElement;

//   handleFileClicked = (doc: PubDocument) =>
//     this.setState(() => ({ selectedDocument: doc }));

//   handleOpenButtonClicked = () => {
//     this.props.onDismiss();
//     this.props.onOpenDocument(this.state.selectedDocument.id);
//   };

//   handleDeleteButtonClicked = () => {
//     this.setState({ showDeleteConfirmBar: true });
//   };

//   handleRenameDocumentClicked = () => {
//     this.setState(prevState => ({
//       showRenameActionBar: true,
//       potentialNewDocumentName: prevState.selectedDocument!.name,
//     }));
//     this.renameInputRef.focus();
//   };

//   handleCancelDeleteDocumentButtonClicked = () =>
//     this.setState({ showDeleteConfirmBar: false });

//   handleCancelRenameDocumentButtonClicked = () =>
//     this.setState({ showRenameActionBar: false });

//   handleConfirmDeleteDocumentButtonClicked = async () => {
//     await this.props.onDeleteDocument(this.state.selectedDocument!.id);
//     this.setState({ showDeleteConfirmBar: false });
//   };

//   handleConfirmRenameButtonClicked = async () => {
//     if (this.state.potentialNewDocumentName.trim().length) {
//       this.props.onRenameDocument({
//         ...this.state.selectedDocument,
//         name: this.state.potentialNewDocumentName,
//       });
//       this.setState({
//         showRenameActionBar: false,
//         potentialNewDocumentName: "",
//       });
//     }
//   };

//   render() {
//     const {
//       props: { onDismiss, documents },
//       state: { selectedDocument, showDeleteConfirmBar, showRenameActionBar },
//     } = this;
//     const selectedId = (selectedDocument && selectedDocument.id) || "";
//     return (
//       <OpenDocumentContainer>
//         <FileBrowser
//           documents={documents}
//           selectedFileId={selectedId}
//           disabled={showDeleteConfirmBar || showRenameActionBar}
//           handleFileClicked={this.handleFileClicked}
//         />
//         <ModalButtonContainer>
//           <Button
//             marginRight
//             disabled={selectedId === ""}
//             onClick={this.handleOpenButtonClicked}
//           >
//             Open Document
//           </Button>
//           <Button
//             marginRight
//             disabled={selectedId === ""}
//             onClick={this.handleRenameDocumentClicked}
//           >
//             Rename Document…
//           </Button>
//           <Button
//             marginRight
//             disabled={selectedId === ""}
//             onClick={this.handleDeleteButtonClicked}
//           >
//             Delete Document…
//           </Button>
//           <Button onClick={onDismiss}>Close</Button>
//         </ModalButtonContainer>
//         {/* <AnimatedActionBar
//           pose={this.state.showDeleteConfirmBar ? "show" : "hide"}
//         >
//           <span>
//             Are you sure you want to delete{" "}
//             {(this.state.selectedDocument || { name: "" }).name || ""}?
//             <DeleteWarning>This operation cannot be undone.</DeleteWarning>
//           </span>
//           <div>
//             <Button
//               destructive
//               marginRight
//               onClick={this.handleConfirmDeleteDocumentButtonClicked}
//             >
//               Delete
//             </Button>
//             <Button onClick={this.handleCancelDeleteDocumentButtonClicked}>
//               Cancel
//             </Button>
//           </div>
//         </AnimatedActionBar>
//         <AnimatedActionBar
//           pose={this.state.showRenameActionBar ? "show" : "hide"}
//         >
//           <RenameInputContainer>
//             <FormInput
//               innerRef={i => (this.renameInputRef = i)}
//               placeholder="Document Name"
//               name="name"
//               onChange={({ target }) =>
//                 this.setState({ potentialNewDocumentName: target.value })
//               }
//               value={this.state.potentialNewDocumentName}
//             />
//           </RenameInputContainer>
//           <div>
//             <Button
//               marginRight
//               disabled={this.state.potentialNewDocumentName.trim().length === 0}
//               onClick={this.handleConfirmRenameButtonClicked}
//             >
//               Rename
//             </Button>
//             <Button onClick={this.handleCancelRenameDocumentButtonClicked}>
//               Cancel
//             </Button>
//           </div>
//         </AnimatedActionBar> */}
//       </OpenDocumentContainer>
//     );
//   }
// }

// export default () => (
//   <StateContext.Consumer>
//     {({ documents, actions }) => (
//       <OpenDocumentDialog
//         documents={documents}
//         onOpenDocument={actions.getDocument}
//         onDeleteDocument={actions.deleteDocument}
//         onRenameDocument={actions.saveDocument}
//         onDismiss={() => actions.setOpenDocumentModalVisible(false)}
//       />
//     )}
//   </StateContext.Consumer>
// );
