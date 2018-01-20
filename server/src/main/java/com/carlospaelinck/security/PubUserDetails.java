package com.carlospaelinck.security;

import com.carlospaelinck.domain.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.authority.AuthorityUtils;

public class PubUserDetails extends org.springframework.security.core.userdetails.User {
  @Getter
  @Setter
  User user;

  public PubUserDetails(User user) {
    super(user.getEmailAddress(), user.getPasswordHash(), AuthorityUtils.createAuthorityList());
    this.user = user;
  }
}
