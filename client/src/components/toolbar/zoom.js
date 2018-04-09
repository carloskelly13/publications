// @flow
import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import CheckmarkIcon from "../ui/icons/checkmark";
import { TextButton } from "../ui/text-button";
import styled from "styled-components";

const zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2, 4];

const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

const Spacer = styled.span`
  display: inline-block;
  width: 14px;
`;

const Label = styled.span`
  display: inline-block;
  padding: 0 0 0 7px;
`;

type Props = {
  zoom: number,
  setZoom: number => void,
  disabled: boolean,
};
export default ({ zoom, setZoom, disabled }: Props) => (
  <Menu
    disabled={disabled}
    renderButton={<TextButton>Zoom</TextButton>}
    renderMenu={zoomLevels.map(zoomLevel => (
      <MenuItem
        noExtraRightPadding
        disabled={disabled}
        key={`zoom-${zoomLevel}`}
        onClick={() => setZoom(zoomLevel)}
      >
        <Content>
          {zoomLevel === zoom ? <CheckmarkIcon /> : <Spacer />}
          <Label>{zoomLevel * 100}%</Label>
        </Content>
      </MenuItem>
    ))}
  />
);
