import React, { PropTypes } from "react"
import { Toolbar as ToolbarBase } from "../ui/toolbar"
import { AboutButton } from "../ui/about.button"
import { currentDocumentSelector } from "../../selectors"
import { connect } from "react-redux"
import { StrongText } from "../ui/text"

export const Toolbar = ({ currentDocument }, { router }) => (
  <ToolbarBase>
    <StrongText white size="1.1em">Publications</StrongText>
  </ToolbarBase>
)

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  currentDocument: currentDocumentSelector(state)
})

export default connect(mapStateToProps)(Toolbar)
