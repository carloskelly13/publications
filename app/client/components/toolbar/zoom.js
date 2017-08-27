import React from "react"
import { MenuItem } from "../ui/menu"
import componentAsDowndownMenu from "../ui/menu-hoc"
import { connect } from "react-redux"
import { zoomSelector } from "../../state/selectors"
import { setZoom as setZoomAction } from "../../state/actions/app-ui"

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

const mapStateToProps = state => ({
  currentZoom: zoomSelector(state)
})

const mapDispatchToProps = {
  setZoom: setZoomAction
}

export default componentAsDowndownMenu({
  title: "Zoom",
  buttonProps: { marginRight: true },
  menuContent: connect(mapStateToProps, mapDispatchToProps)(ZoomMenu)
})
