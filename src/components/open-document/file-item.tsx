import React from "react";
import styled, { css } from "styled-components";
// import { lastModifiedString } from "../../util/string";
import Canvas from "../canvas";
import { Colors } from "../../util/constants";
import { PubDocument } from "../../types/pub-objects";
import noop from "lodash/fp/noop";

const FileItemContainer = styled.div`
  text-align: center;
`;

const FileName = styled.div`
  font-weight: 500;
  font-size: 0.9em;
  margin: 5px 0 0;
`;

// const FileDescription = styled.div`
//   font-size: 0.85em;
// `;

const SvgContainer = styled.div<{ selected?: boolean }>`
  display: inline-block;
  margin: 0 auto;
  padding: 3px 3px 0;
  border-radius: 2px;
  box-shadow: 0 0 0 1px ${Colors.DocumentThumbnail.Outline};
  ${({ selected }) =>
    selected &&
    css`
      box-shadow: 0 0 0 3px ${Colors.DocumentThumbnail.SelectedOutline};
    `};
`;

interface Props {
  doc: PubDocument;
  selected: boolean;
  handleClick(): void;
}

export const FileItem: React.StatelessComponent<Props> = ({
  doc,
  handleClick,
  selected,
}) => (
  <FileItemContainer onClick={handleClick}>
    <SvgContainer selected={selected}>
      <Canvas
        thumbnail
        dpi={96}
        zoom={0}
        allowsEditing={false}
        width={doc.pages[0].width}
        height={doc.pages[0].height}
        sortedShapes={doc.pages[0].shapes}
        selectedShape={null}
        updateSelectedObject={noop}
      />
    </SvgContainer>
    <FileName>{doc.name}</FileName>
    {/* <FileDescription>{lastModifiedString(doc.lastModified)}</FileDescription> */}
  </FileItemContainer>
);
