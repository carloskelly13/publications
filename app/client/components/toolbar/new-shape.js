import React from "react"
import { connect } from "react-redux"
import { ShapeAddIconButton } from "../ui/icon-buttons/shape-add"
import { addShape as addShapeAction } from "../../state/actions/document"
import { MenuItem } from "../ui/menu"
import { Shapes } from "../../util/constants"
import componentAsDowndownMenu from "../ui/menu-hoc"

const NewShapeMenu = ({ addShape }) => [
  <MenuItem
    key="rectangle"
    onClick={() => addShape(Shapes.Rectangle)}
  >
    Rectangle
  </MenuItem>,
  <MenuItem
    key="ellipse"
    onClick={() => addShape(Shapes.Ellipse)}
  >
    Ellipse
  </MenuItem>,
  <MenuItem
    key="text-box"
    onClick={() => addShape(Shapes.Text)}
  >
    Text Box
  </MenuItem>
]

const mapDispatchToProps = {
  addShape: addShapeAction
}

export default componentAsDowndownMenu({
  iconButton: ShapeAddIconButton,
  menuContent: connect(null, mapDispatchToProps)(NewShapeMenu)
})
