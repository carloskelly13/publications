// @flow
import * as React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { TextButton } from "../ui/text-button";

type Props = {
  user: ?Object,
};
export default (props: Props) => (
  <Menu
    alignRight
    renderButton={
      <TextButton>
        {props.user ? props.user.name : "Log In / Create Account"}
      </TextButton>
    }
    renderMenu={
      props.user ? (
        <>
          <MenuItem>Log Out</MenuItem>
        </>
      ) : (
        <>
          <MenuItem>Log In…</MenuItem>
          <MenuItem>Create a free Publications account…</MenuItem>
        </>
      )
    }
  />
);
