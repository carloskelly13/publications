import React from "react";
import { FileItem } from "./file-item";
import {
  SearchInput,
  FileBrowserContainer,
  FileBrowserContentContainer,
} from "./components";
import { PubDocument } from "../../types/pub-objects";

interface Props {
  selectedFileId: string | null;
  documents: Array<PubDocument>;
  handleFileClicked(id: string): void;
}

export default class extends React.Component<Props> {
  state = {
    searchKeyword: "",
  };

  handleSearchKeywordChanged = ({ target }) =>
    this.setState({
      searchKeyword: target.value,
    });

  render() {
    const { handleFileClicked, selectedFileId } = this.props;
    const filteredDocuments = this.props.documents.filter(doc =>
      doc.name
        .toLowerCase()
        .includes(this.state.searchKeyword.trim().toLowerCase())
    );

    return (
      <FileBrowserContainer>
        <SearchInput
          value={this.state.searchKeyword}
          onChange={this.handleSearchKeywordChanged}
          placeholder="Search for Documents"
        />
        <FileBrowserContentContainer>
          {filteredDocuments.map(doc => (
            <FileItem
              selected={selectedFileId === doc.id}
              handleClick={() => handleFileClicked(doc.id!)}
              key={doc.id}
              doc={doc}
            />
          ))}
        </FileBrowserContentContainer>
      </FileBrowserContainer>
    );
  }
}