import * as React from "react";
import styled from "styled-components";
import { Colors } from "../../util/constants";
import PublicationsIcon from "../icons/publications";
import VectorShapeIcon from "../ui/icons/vector-shape";
import FloppyDiskIcon from "../ui/icons/floppy-disk";
import DownloadIcon from "../ui/icons/download";
import CopyIcon from "../ui/icons/copy";
import CutIcon from "../ui/icons/cut";
import PasteIcon from "../ui/icons/paste";
import ZoomInIcon from "../ui/icons/zoom-in";
import ZoomOutIcon from "../ui/icons/zoom-out";
import Spacer from "../ui/spacer";
import TitleBarButton from "./title-bar-button";
import { StateContext } from "../../contexts/app-state";
import downloadPdfAction from "../../util/download-pdf";
import { ClipboardAction } from "../../types/data";
import Menu, { MenuItem } from "../ui/menu";
import { Shapes } from "../../util/new-shapes";

const Container = styled.header`
  background: ${Colors.TitleBar.Background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 25px;
  z-index: 1;
`;

const ControlGroup = styled.div`
  padding: 0 0.5em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 13px;
  color: ${Colors.TitleBar.Text};
`;

const ZoomLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  line-height: 25px;
  width: 35px;
  text-align: center;
`;

const LeftControlGroup = styled(ControlGroup)`
  font-weight: bold;
  svg {
    margin-right: 0.25em;
  }
`;

export default function TitleBar() {
  const {
    actions,
    currentDocument,
    clipboardContents,
    selectedObject,
    zoom,
  } = React.useContext(StateContext);
  const saveDocument = React.useCallback(() => actions.saveDocument(), [
    actions,
  ]);
  const downloadPdf = React.useCallback(
    () => actions.saveDocument().then(downloadPdfAction),
    [actions]
  );
  const zoomIn = React.useCallback(
    () => actions.setZoom(Math.min(4.0, zoom + 0.25)),
    [actions, zoom]
  );
  const zoomOut = React.useCallback(
    () => actions.setZoom(Math.max(0.25, zoom - 0.25)),
    [actions, zoom]
  );
  return (
    <Container>
      <LeftControlGroup>
        <PublicationsIcon size={20} />
        Publications
      </LeftControlGroup>
      <ControlGroup>
        <TitleBarButton disabled={!currentDocument} onPress={saveDocument}>
          <FloppyDiskIcon />
          Save
        </TitleBarButton>
        <TitleBarButton disabled={!currentDocument} onPress={downloadPdf}>
          <DownloadIcon />
          PDF
        </TitleBarButton>
        <Menu
          renderButton={setMenuActive => (
            <TitleBarButton
              disabled={!currentDocument}
              onPress={() => setMenuActive(prevState => !prevState)}
            >
              <VectorShapeIcon />
              Objects
            </TitleBarButton>
          )}
          renderMenu={
            <>
              <MenuItem onClick={() => actions.addObject(Shapes.Rectangle)}>
                Rectangle
              </MenuItem>
              <MenuItem onClick={() => actions.addObject(Shapes.Ellipse)}>
                Ellipse
              </MenuItem>
              <MenuItem onClick={() => actions.addObject(Shapes.Text)}>
                Text Box
              </MenuItem>
            </>
          }
        />
        <Spacer width="1em" />
        <TitleBarButton
          disabled={!currentDocument || !selectedObject}
          onPress={() => actions.handleClipboardAction(ClipboardAction.Cut)}
        >
          <CutIcon />
          Cut
        </TitleBarButton>
        <TitleBarButton
          disabled={!currentDocument || !selectedObject}
          onPress={() => actions.handleClipboardAction(ClipboardAction.Copy)}
        >
          <CopyIcon />
          Copy
        </TitleBarButton>
        <TitleBarButton
          disabled={!currentDocument || !clipboardContents}
          onPress={() => actions.handleClipboardAction(ClipboardAction.Paste)}
        >
          <PasteIcon />
          Paste
        </TitleBarButton>
        <Spacer width="1em" />
        <TitleBarButton disabled={!currentDocument} noLabel onPress={zoomIn}>
          <ZoomInIcon />
        </TitleBarButton>
        <ZoomLabel>{zoom * 100}%</ZoomLabel>
        <TitleBarButton disabled={!currentDocument} noLabel onPress={zoomOut}>
          <ZoomOutIcon />
        </TitleBarButton>
      </ControlGroup>
    </Container>
  );
}
