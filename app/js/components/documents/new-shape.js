import React from "react"
import { connect } from "react-redux"
import { ShapeAddIconButton } from "../ui/icon-buttons/shape-add"
import { addShape as addShapeAction } from "../../actions/document"
import { MenuItem } from "../ui/menu"
import { Shapes } from "../../core/constants"
import asMenu from "../ui/menu-hoc"

const NewShapeMenu = ({ addShape }) => (
  <div>
    <MenuItem onClick={() => addShape(Shapes.Rectangle)}>
      Rectangle
    </MenuItem>
    <MenuItem onClick={() => addShape(Shapes.Ellipse)}>
      Ellipse
    </MenuItem>
    <MenuItem onClick={() => addShape(Shapes.Text)}>
      Text Box
    </MenuItem>
  </div>
)

const mapDispatchToProps = {
  addShape: addShapeAction
}

export default asMenu({
  iconButton: ShapeAddIconButton,
  menuContent: connect(null, mapDispatchToProps)(NewShapeMenu),
  width: 175
})
