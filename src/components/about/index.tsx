import React from "react";
import { ModalButtonContainer } from "../ui/button-container";
import Button from "../ui/framed-button";
import { ModalContent } from "../modal";
import styled from "styled-components";
import LogoBadge from "../ui/icons/logo-badge";
import { StateContext } from "../../contexts/documents-provider";

const PanelContainer = styled(ModalContent)`
  width: 550px;
`;

const Content = styled.div`
  padding: 32px 32px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
`;

const RightContent = styled.div`
  color: #fff;
  padding-left: 32px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 11px;
`;

const MoreInfo = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  font-size: 12px;
  border-top: 1px solid hsla(0, 0%, 100%, 0.25);
`;

const Link = styled.a`
  color: #fff;
`;

interface Props {
  onDismiss(): void;
}
function AboutPanel(props: Props) {
  return (
    <PanelContainer>
      <Content>
        <LogoBadge />
        <RightContent>
          <Title>Publications</Title>
          <Description>An app for page and print design.</Description>
          <MoreInfo>
            Publications is an{" "}
            <Link
              href="https://github.com/carlospaelinck/publications"
              target="_blank"
            >
              open-source
            </Link>{" "}
            application built using Express, React, and GraphQL.
          </MoreInfo>
        </RightContent>
      </Content>
      <ModalButtonContainer>
        <Button type="button" onClick={props.onDismiss}>
          Close
        </Button>
      </ModalButtonContainer>
    </PanelContainer>
  );
}

export default () => (
  <StateContext.Consumer>
    {({ actions }) => (
      <AboutPanel onDismiss={() => actions.setAboutModalVisible(false)} />
    )}
  </StateContext.Consumer>
);
