import React from "react";
import styled from "styled-components";
import { AppColors } from "../../util/constants";
import { FileItem } from "./file-item";
import {
  SearchInput,
  FileBrowserContainer,
  FileBrowserContentContainer,
} from "./components";

type Props = {
  documents?: Array,
  handleFileClicked: Function,
  selectedFileId?: string,
};

export default class extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = { searchKeyword: "", filteredDocuments: this.props.documents };
  }

  handleSearchKeywordChanged = ({ target }) =>
    this.setState({
      searchKeyword: target.value,
      filteredDocuments: this.props.documents.filter(doc =>
        doc.name.toLowerCase().includes(target.value.trim().toLowerCase())
      ),
    });

  render() {
    const { handleFileClicked, selectedFileId } = this.props;
    return (
      <FileBrowserContainer>
        <SearchInput
          value={this.state.searchKeyword}
          onChange={this.handleSearchKeywordChanged}
          placeholder="Search for Documents"
        />
        <FileBrowserContentContainer>
          {this.state.filteredDocuments.map(doc => (
            <FileItem
              selected={selectedFileId === doc.id}
              handleClick={() => handleFileClicked(doc.id)}
              key={doc.id}
              doc={doc}
            />
          ))}
        </FileBrowserContentContainer>
      </FileBrowserContainer>
    );
  }
}
