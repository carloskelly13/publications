import React, { Component, PropTypes } from "react"
import { Router, RouteHandler, Link } from "react-router"
import { autobind } from "core-decorators"
import { Urls } from "core/constants"
import Canvas from "../canvas/canvas"
import { format as formatDate } from "fecha"
import styled from "styled-components"

const DocumentItemContent = styled.li`
  box-sizing: border-box;
  cursor: default;
  display: inline-block;
  margin: 0em;
  padding: 1.5em 2%;
  text-align: center;
  user-select: none;
  vertical-align: bottom;
  width: 25%;

  @media all and (max-width: 767px) {
    border-bottom: 1px solid #ccc;
    width: 100%;
  }
`

const Name = styled.div`
  display: block;
  font-size: 15px;
  font-weight: 500;
  margin: 0.25em 0 0 0;
`

const InfoLine = styled.div`
  display: block;
  font-size: 12px;
  margin: 0;
`

export default class DocumentItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.selectedDocument && nextProps.selectedDocument.id === this.props.doc.id) ||
      (this.props.selectedDocument && this.props.selectedDocument.id === this.props.doc.id) ||
      (this.props.doc !== nextProps.doc)
  }

  render() {
    const {
      selectedDocument,
      doc: { id }
    } = this.props
    const selected = !!selectedDocument && selectedDocument.id == id
    const lastModifiedDate = new Date(this.props.doc.lastModified)
    const formattedDate = formatDate(lastModifiedDate, "MMM D, h:mm A")

    return (
      <DocumentItemContent>
        <div
          onClick={this.documentSelected}
          onDoubleClick={this.documentDoubleClicked}>
          <Canvas
            doc={this.props.doc}
            zoom={0.2}
            selected={selected}
          />
          <Name>
            {this.props.doc.name}
          </Name>
          <InfoLine>
            { formattedDate }
          </InfoLine>
          <InfoLine>
            {this.props.doc.width}&#8221;&#32;&#215;&#32;{this.props.doc.height}&#8221;
          </InfoLine>
        </div>
      </DocumentItemContent>
    )
  }

  @autobind
  documentSelected(event) {
    event.stopPropagation()
    this.props.updateSelectedDocument(this.props.doc, null)
  }

  @autobind
  documentDoubleClicked(event) {
    event.stopPropagation()
    this.props.updateSelectedDocument(this.props.doc, null)
    this.props.editDocument()
  }
}
