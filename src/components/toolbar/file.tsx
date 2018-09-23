import React from "react";
import Menu, { MenuItem, MenuDivider } from "../ui/menu";
import { TextButton } from "../ui/text-button";
import { PubDocument } from "../../types/pub-objects";

interface Props {
  loggedIn: boolean;
  currentDocument: PubDocument | null;
  saveDocument(): Promise<any>;
  showOpenDocumentModal(): void;
  showNewDocumentModal(): void;
  showAboutModal(): void;
  setZoom(zoom: number): void;
}

const FileMenu: React.SFC<Props> = ({
  loggedIn,
  currentDocument,
  saveDocument,
  showNewDocumentModal,
  showOpenDocumentModal,
  showAboutModal,
  setZoom,
}) => (
  <Menu
    renderButton={<TextButton>File</TextButton>}
    renderMenu={
      <>
        <MenuItem onClick={showNewDocumentModal}>New Document…</MenuItem>
        <MenuItem onClick={showOpenDocumentModal} disabled={!loggedIn}>
          View all Documents…
        </MenuItem>
        <MenuDivider />
        <MenuItem disabled={!currentDocument} onClick={() => saveDocument()}>
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
        <MenuDivider />
        <MenuItem onClick={showAboutModal}>About Publications…</MenuItem>
      </>
    }
  />
);

export default FileMenu;
