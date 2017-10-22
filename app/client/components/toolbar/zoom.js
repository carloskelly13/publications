import React from "react"
import compose from "lodash.flowright"
import { MenuItem } from "../ui/menu"
import asDropdownMenu from "../ui/menu-hoc"
import { connect } from "react-redux"
import { setZoom, zoomSelector } from "../../modules/document"

const zoomLevels = [ 0.5, 0.75, 1, 1.25, 1.5, 2, 4 ]

const ZoomMenu = ({ setZoom, disabled }) => zoomLevels.map(zoom => (
  <MenuItem
    disabled={disabled}
    key={`zoom-${zoom}`}
    onClick={() => setZoom(zoom)}
  >
    {zoom * 100}%
  </MenuItem>
))

export default compose(
  connect(state => ({
    zoom: zoomSelector(state)
  }), {
    setZoom
  }),
  asDropdownMenu({
    title: "Zoom",
    buttonProps: { marginRight: true }
  })
)(ZoomMenu)
