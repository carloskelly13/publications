import React from "react"
import compose from "lodash.flowright"
import { connect } from "react-redux"
import { addShape as addShapeAction } from "../../state/actions/document"
import { MenuItem } from "../ui/menu"
import { Shapes } from "../../util/constants"
import asDropdownMenu from "../ui/menu-hoc"

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

export default compose(
  connect(null, mapDispatchToProps),
  asDropdownMenu({
    title: "Insert",
    buttonProps: { marginRight: true }
  })
)(NewShapeMenu)
