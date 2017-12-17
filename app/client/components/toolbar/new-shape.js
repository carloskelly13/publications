import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { Shapes } from "../../util/constants";
import { TextButton } from "../ui/text-button";

export default ({ addShape = () => {}, disabled }) => (
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
