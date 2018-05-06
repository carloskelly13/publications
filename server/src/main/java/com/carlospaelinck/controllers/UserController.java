package com.carlospaelinck.controllers;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.carlospaelinck.domain.User;
import com.carlospaelinck.security.PubUserDetails;
import com.carlospaelinck.services.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/users")
public class UserController {
  private final UserService userService;

  @Inject
  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/current")
  User current(@AuthenticationPrincipal PubUserDetails userDetails) {
    return userService.get(userDetails.getUser().getEmailAddress());
  }

  @PostMapping
  User create(@RequestBody User user) {
    return userService.create(user);
  }

  @PutMapping
  User update(HttpServletRequest request, @RequestBody User user, @AuthenticationPrincipal PubUserDetails userDetails,
      HttpServletResponse response) {
    User currentUser = userDetails.getUser();
    return userService.update(currentUser, user);
  }

  @PostMapping("/login")
  Authentication login(@RequestBody User user) {
    return userService.authenticate(user);
  }

  @DeleteMapping("/logout")
  void logout(HttpServletRequest request, @AuthenticationPrincipal PubUserDetails userDetails) throws ServletException {
    userService.logout(userDetails.getUser().getEmailAddress());
    request.logout();
  }
}
