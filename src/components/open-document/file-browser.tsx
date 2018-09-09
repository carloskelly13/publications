import React from "react";
import { FileItem } from "./file-item";
import {
  SearchInput,
  FileBrowserContainer,
  FileBrowserContentContainer,
  SearchInputContainer,
} from "./components";
import { PubDocument } from "../../types/pub-objects";

interface Props {
  disabled: boolean;
  selectedFileId: string | null;
  documents: Array<PubDocument>;
  handleFileClicked(doc: PubDocument): void;
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
        <SearchInputContainer>
          <SearchInput
            value={this.state.searchKeyword}
            onChange={this.handleSearchKeywordChanged}
            placeholder="Search for Documents"
          />
        </SearchInputContainer>
        <FileBrowserContentContainer disabled={this.props.disabled}>
          {filteredDocuments.map(doc => (
            <FileItem
              selected={selectedFileId === doc.id}
              handleClick={() => !this.props.disabled && handleFileClicked(doc)}
              key={doc.id}
              doc={doc}
            />
          ))}
        </FileBrowserContentContainer>
      </FileBrowserContainer>
    );
  }
}
