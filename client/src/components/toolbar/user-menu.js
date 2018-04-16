// @flow
import * as React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { TextButton } from "../ui/text-button";

type Props = {
  user: ?Object,
  showLoginDialog: () => void,
  logOut: () => Promise<any>,
};
export default (props: Props) => (
  <Menu
    alignRight
    renderButton={
      <TextButton>
        {props.user ? props.user.emailAddress : "Log In / Create Account"}
      </TextButton>
    }
    renderMenu={
      props.user ? (
        <>
          <MenuItem onClick={props.logOut}>Log Out</MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={props.showLoginDialog}>Log In…</MenuItem>
          <MenuItem disabled>Create a free Publications account…</MenuItem>
        </>
      )
    }
  />
);
