import React from "react";
import { connect } from "react-redux";
import { addShape } from "../../modules/document";
import Menu, { MenuItem } from "../ui/menu";
import { Shapes } from "../../util/constants";
import { TextButton } from "../ui/text-button";

const NewShapeMenu = ({ addShape, disabled }) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Insert</TextButton>}
    renderMenu={[
      <MenuItem key="rectangle" onClick={() => addShape(Shapes.Rectangle)}>
        Rectangle
      </MenuItem>,
      <MenuItem key="ellipse" onClick={() => addShape(Shapes.Ellipse)}>
        Ellipse
      </MenuItem>,
      <MenuItem key="text-box" onClick={() => addShape(Shapes.Text)}>
        Text Box
      </MenuItem>,
    ]}
  />
);

export default connect(null, {
  addShape,
})(NewShapeMenu);
