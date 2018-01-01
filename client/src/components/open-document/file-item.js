import React from "react";
import styled, { css } from "styled-components";
import { lastModifiedString } from "../../util/string";
import Canvas from "../canvas";
import { AppColors } from "../../util/constants";

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

const SvgContainer = styled.div`
  display: inline-block;
  margin: 0 auto;
  padding: 3px 3px 0;
  ${({ selected }) =>
    selected &&
    css`
      border-radius: 2px;
      box-shadow: 0 0 0 2px ${AppColors.Highlight};
    `};
`;

export const FileItem = ({ doc, handleClick, selected }) => (
  <FileItemContainer onClick={handleClick}>
    <SvgContainer selected={selected}>
      <Canvas
        selected={selected}
        thumbnail
        documentMetrics={{
          width: doc.width,
          height: doc.height,
        }}
        sortedShapes={doc.shapes}
      />
    </SvgContainer>
    <FileName>{doc.name}</FileName>
    <FileDescription>{lastModifiedString(doc.lastModified)}</FileDescription>
  </FileItemContainer>
);
