import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { Shapes } from "../../util/new-shapes";
import { TextButton } from "../ui/text-button";

export default ({ addObject, disabled }) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Insert</TextButton>}
    renderMenu={
      <>
        <MenuItem onClick={() => addObject(Shapes.Rectangle)}>
          Rectangle
        </MenuItem>
        <MenuItem onClick={() => addObject(Shapes.Ellipse)}>Ellipse</MenuItem>
        <MenuItem onClick={() => addObject(Shapes.Text)}>Text Box</MenuItem>
      </>
    }
  />
);
