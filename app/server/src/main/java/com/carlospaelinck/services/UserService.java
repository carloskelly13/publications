package com.carlospaelinck.services;

import com.carlospaelinck.domain.User;
import com.carlospaelinck.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;

@Service
@Transactional
public class UserService {

  @Inject
  UserRepository userRepository;

  @Inject
  DocumentService documentService;

  @Inject
  AuthenticationManager authenticationManager;

  public User get(String emailAddress) {
    return userRepository.findOneByEmailAddress(emailAddress);
  }

  public User create(User user) {
    user.setPasswordHash(new BCryptPasswordEncoder().encode(user.getPassword()));
    return userRepository.save(user);
  }

  public User update(User user) {
    user.setPasswordHash(new BCryptPasswordEncoder().encode(user.getPassword()));
    return userRepository.save(user);
  }

  public User login(User user) {
    UsernamePasswordAuthenticationToken authRequest =
        new UsernamePasswordAuthenticationToken(user.getEmailAddress(), user.getPassword());

    // Authenticate the user
    Authentication authentication = authenticationManager.authenticate(authRequest);
    SecurityContext securityContext = SecurityContextHolder.getContext();
    securityContext.setAuthentication(authentication);
    return userRepository.findOneByEmailAddress(user.getEmailAddress());
  }

  public void logout(String emailAddress) {
    User user = userRepository.findOneByEmailAddress(emailAddress);

    if (user.getTemporary()) {
      user.getDocuments().forEach(documentService::delete);
      userRepository.delete(user);
    }

    SecurityContextHolder.getContext().setAuthentication(null);
  }
}
