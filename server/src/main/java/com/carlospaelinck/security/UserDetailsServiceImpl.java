package com.carlospaelinck.security;

import com.carlospaelinck.domain.User;
import com.carlospaelinck.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.inject.Inject;
import javax.inject.Named;

@Named
public class UserDetailsServiceImpl implements org.springframework.security.core.userdetails.UserDetailsService {

  @Inject
  UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username)
      throws UsernameNotFoundException {
    User user = userRepository.findOneByEmailAddress(username);

    if (user == null) {
      throw new UsernameNotFoundException("A user with that email address was not found.");
    }

    return new PubUserDetails(user);
  }
}
