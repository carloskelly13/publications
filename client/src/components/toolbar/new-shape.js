import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { Shapes } from "../../util/new-shapes";
import { TextButton } from "../ui/text-button";

export default ({ addObject, disabled }) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Insert</TextButton>}
    renderMenu={[
      <MenuItem key="rectangle" onClick={() => addObject(Shapes.Rectangle)}>
        Rectangle
      </MenuItem>,
      <MenuItem key="ellipse" onClick={() => addObject(Shapes.Ellipse)}>
        Ellipse
      </MenuItem>,
      <MenuItem key="text-box" onClick={() => addObject(Shapes.Text)}>
        Text Box
      </MenuItem>,
    ]}
  />
);
