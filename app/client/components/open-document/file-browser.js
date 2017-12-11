import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { sortedDocumentsSelector } from "../../modules/document";
import { AppColors } from "../../util/constants";
import { FileItem } from "./file-item";

export const BaseContainer = styled.div`
  width: calc(100% - 1em);
  height: 370px;
  border-radius: 0;
  background: ${AppColors.White};
  padding: 1.5em 0.5em;
`;

export const FileBrowserLoadingContainer = styled(BaseContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FileBrowserContainer = styled(BaseContainer)`
  overflow: scroll;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;

export const FileBrowser = ({
  documents,
  handleFileClicked,
  selectedFileId,
}) => (
  <FileBrowserContainer>
    {documents.map(doc => (
      <FileItem
        selected={selectedFileId === doc.id}
        handleClick={() => handleFileClicked(doc.id)}
        key={doc.id}
        doc={doc}
      />
    ))}
  </FileBrowserContainer>
);

export default connect(
  state => ({
    documents: sortedDocumentsSelector(state),
  }),
  null
)(FileBrowser);
