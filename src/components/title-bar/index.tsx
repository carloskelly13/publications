import * as React from "react";
import styled from "styled-components";
// import { StateContext } from "../../contexts";
import { Colors } from "../../util/constants";
import PublicationsIcon from "../icons/publications";
import VectorShapeIcon from "../ui/icons/vector-shape";
import FloppyDiskIcon from "../ui/icons/floppy-disk";

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

const LeftControlGroup = styled(ControlGroup)`
  font-weight: bold;
  svg {
    margin-right: 0.25em;
  }
`;

export default function TitleBar() {
  return (
    <Container>
      <LeftControlGroup>
        <PublicationsIcon size={20} />
        Publications
      </LeftControlGroup>
      <ControlGroup>
        <VectorShapeIcon size={18} />
        <FloppyDiskIcon size={18} />
      </ControlGroup>
    </Container>
  );
}
