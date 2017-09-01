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
      doc={doc}
    />
    { doc.name }
    { lastModifiedString(doc.lastModified) }
  </FileItemContainer>
)
