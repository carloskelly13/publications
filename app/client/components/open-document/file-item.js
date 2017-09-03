import React from "react"
import styled from "styled-components"
import { lastModifiedString } from "../../util/string.js"
import { Canvas } from "../canvas"

const FileItemContainer = styled.div`

`

export const FileItem = ({ doc }) => (
  <FileItemContainer>
    <Canvas
      thumbnail
      documentMetrics={{
        width: doc.width,
        height: doc.height
      }}
      sortedShapes={doc.shapes}
    />
    { doc.name }
    { lastModifiedString(doc.lastModified) }
  </FileItemContainer>
)
