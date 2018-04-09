// @flow
import type { PubDocument } from "../../util/types";
import * as React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";

type Props = {
  loggedIn: boolean,
  currentDocument: ?PubDocument,
  saveDocument: () => Promise<any>,
  logOut: () => void,
  showNewDocumentModal: () => void,
  showOpenDocumentModal: () => void,
  setZoom: number => void,
};
export default ({
  loggedIn,
  currentDocument,
  saveDocument,
  showNewDocumentModal,
  showOpenDocumentModal,
  setZoom,
}: Props) => (
  <Menu
    renderButton={<TextButton>File</TextButton>}
    renderMenu={
      <>
        <MenuItem onClick={showNewDocumentModal}>New…</MenuItem>
        <MenuItem onClick={showOpenDocumentModal} disabled={!loggedIn}>
          Open…
        </MenuItem>
        <MenuDivider />
        <MenuItem
          disabled={!currentDocument || !loggedIn}
          onClick={saveDocument}
        >
          Save
        </MenuItem>
        <MenuItem
          disabled={!currentDocument}
          onClick={() => {
            setZoom(1.0);
            setTimeout(() => window.print(), 100);
          }}
        >
          Print and Export PDF…
        </MenuItem>
        <MenuItem disabled={!currentDocument || !loggedIn} onClick={() => {}}>
          Delete…
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => {}}>About Publications…</MenuItem>
      </>
    }
  />
);
