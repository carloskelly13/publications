import React from "react";
import Menu, { MenuItem } from "../ui/menu";
import { TextButton } from "../ui/text-button";
import { PubUser } from "../../types/pub-objects";

interface Props {
  user: PubUser | null;
  showLoginModal(): void;
  logOut(): Promise<any>;
}

const UserMenu: React.SFC<Props> = props => (
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
          <MenuItem onClick={props.showLoginModal}>Log In…</MenuItem>
          <MenuItem disabled>Create a free Publications account…</MenuItem>
        </>
      )
    }
  />
);

export default UserMenu;
