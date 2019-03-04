import * as React from "react";
import {
  SectionTitle,
  Separator,
  ControlGrid,
  VerticalControlGrid,
} from "./components";
import { StateContext } from "../../contexts";
import Button from "../ui/framed-button";

export default function DocumentTab() {
  const { user } = React.useContext(StateContext);
  return (
    <>
      <SectionTitle>File</SectionTitle>
      <VerticalControlGrid>
        <Button fullWidth>New Document</Button>
        <Button fullWidth>View all Document</Button>
      </VerticalControlGrid>
      <ControlGrid>
        <Button>Save</Button>
        <Button>PDF</Button>
      </ControlGrid>
      <Separator />
      <SectionTitle marginTop>Document</SectionTitle>
      <Separator />
      <SectionTitle marginTop>{user ? user.name : "Account"}</SectionTitle>
      {user ? (
        <>
          <ControlGrid>
            <Button>Settings</Button>
            <Button>Log Out</Button>
          </ControlGrid>
        </>
      ) : (
        <>You are not logged in</>
      )}
      <Separator />
    </>
  );
}
