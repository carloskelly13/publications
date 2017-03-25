import React from "react"
import { ZoomIconButton } from "../ui/icon-buttons"
import { MenuItem } from "../ui/menu"
import asMenu from "../ui/menu-hoc"
import { connect } from "react-redux"
import { zoomSelector } from "../../selectors"
import { setZoom as setZoomAction } from "../../actions/app-ui"

const zoomLevels = [ 0.5, 0.75, 1, 1.25, 1.5, 2, 4 ]

const ZoomMenu = ({ currentZoom, setZoom }) => (
  <div>
    { zoomLevels.map((zoom, index) => (
      <MenuItem
        key={`zoom-${index}`}
        onClick={() => setZoom(zoom)}
      >
        {zoom * 100}%
      </MenuItem>
    )) }
  </div>
)

const mapStateToProps = state => ({
  currentZoom: zoomSelector(state)
})

const mapDispatchToProps = {
  setZoom: setZoomAction
}

export default asMenu({
  iconButton: ZoomIconButton,
  menuContent: connect(mapStateToProps, mapDispatchToProps)(ZoomMenu),
  width: 100
})
