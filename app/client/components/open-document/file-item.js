import React from "react";
import styled from "styled-components";
import { lastModifiedString } from "../../util/string.js";
import Canvas from "../canvas";

const FileItemContainer = styled.div`
  text-align: center;
`;

const FileName = styled.div`
  font-weight: 500;
  font-size: 0.9em;
  margin: 5px 0 0;
`;

const FileDescription = styled.div`
  font-size: 0.85em;
`;

export const FileItem = ({ doc, handleClick, selected }) => (
  <FileItemContainer onClick={handleClick}>
    <Canvas
      selected={selected}
      thumbnail
      documentMetrics={{
        width: doc.width,
        height: doc.height,
      }}
      sortedShapes={doc.shapes}
    />
    <FileName>{doc.name}</FileName>
    <FileDescription>{lastModifiedString(doc.lastModified)}</FileDescription>
  </FileItemContainer>
);
