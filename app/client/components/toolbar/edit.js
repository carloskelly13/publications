import React from "react"
import Menu, { MenuItem, MenuDivider } from "../ui/menu"
import { TextButton } from "../ui/text-button"
import { connect } from "react-redux"
import {
  cutShape, copyShape, pasteShape, deleteShape,
  clipboardDataSelector, selectedShapeSelector
} from "../../modules/document"

const EditMenu = props => {
  const {
    disabled,
    cutShape,
    copyShape,
    pasteShape,
    deleteShape,
    clipboardData,
    selectedShape
  } = props
  return (
    <Menu
      disabled={disabled}
      renderButton={<TextButton>Edit</TextButton>}
      renderMenu={[
        <MenuItem
          key="cut-menu-item"
          disabled={!selectedShape}
          onClick={() => cutShape(selectedShape)}
        >
          Cut
        </MenuItem>,
        <MenuItem
          key="copy-menu-item"
          disabled={!selectedShape}
          onClick={() => copyShape(selectedShape)}
        >
          Copy
        </MenuItem>,
        <MenuItem
          key="paste-menu-item"
          disabled={!clipboardData}
          onClick={() => pasteShape()}
        >
          Paste
        </MenuItem>,
        <MenuDivider key="menu-divider-1" />,
        <MenuItem
          key="delete-menu-item"
          disabled={!selectedShape}
          onClick={() => deleteShape(selectedShape)}
        >
          Delete
        </MenuItem>
      ]}
    />
  )
}

export default connect(
  state => ({
    selectedShape: selectedShapeSelector(state),
    clipboardData: clipboardDataSelector(state)
  }), {
    cutShape, copyShape, pasteShape, deleteShape
  })(EditMenu)
