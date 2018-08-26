import React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";
import { PubShape } from "../../types/pub-objects";
import { ClipboardAction } from "../documents/editor-actions";

interface Props {
  disabled: boolean;
  clipboardContents: PubShape | null;
  selectedObject: PubShape | null;
  deleteObject: () => void;
  handleClipboardAction(action: ClipboardAction): void;
}

const EditMenu: React.SFC<Props> = ({
  disabled,
  clipboardContents,
  selectedObject,
  deleteObject,
  handleClipboardAction,
}) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Edit</TextButton>}
    renderMenu={
      <>
        <MenuItem
          disabled={!selectedObject}
          onClick={() => handleClipboardAction(ClipboardAction.Cut)}
        >
          Cut
        </MenuItem>
        <MenuItem
          disabled={!selectedObject}
          onClick={() => handleClipboardAction(ClipboardAction.Copy)}
        >
          Copy
        </MenuItem>
        <MenuItem
          disabled={!clipboardContents}
          onClick={() => handleClipboardAction(ClipboardAction.Paste)}
        >
          Paste
        </MenuItem>
        <MenuDivider />
        <MenuItem disabled={!selectedObject} onClick={deleteObject}>
          Delete Object
        </MenuItem>
      </>
    }
  />
);

export default EditMenu;
