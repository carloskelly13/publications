package com.carlospaelinck.security;

import com.carlospaelinck.domain.User;
import com.carlospaelinck.repositories.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.inject.Inject;
import javax.inject.Named;

@Named
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

  @Inject
  UserRepository userRepository;

  @Override
  public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findOneByEmailAddress(username);

    if (user == null) {
      throw new UsernameNotFoundException("A user with that email address was not found.");
    }

    return new UserDetails(user);
  }
}
