import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { Shapes } from "../../util/new-shapes";
import { TextButton } from "../ui/text-button";
import { PubShape } from "../../types/pub-objects";

interface Props {
  disabled: boolean;
  addObject(object: PubShape): void;
}

const NewShapeMenu: React.SFC<Props> = ({ addObject, disabled }) => (
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

export default NewShapeMenu;
