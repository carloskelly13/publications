package com.carlospaelinck.controllers;

import com.carlospaelinck.domain.User;
import com.carlospaelinck.exceptions.ConflictException;
import com.carlospaelinck.security.PubUserDetails;
import com.carlospaelinck.services.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping(value = "/users")
public class UserController {
  @Inject
  UserService userService;

  @GetMapping("/current")
  User current(@AuthenticationPrincipal PubUserDetails userDetails) {
    return userService.get(userDetails.getUser().getEmailAddress());
  }

  @PostMapping
  User create(@RequestBody User user) {
    return userService.create(user);
  }

  @PutMapping
  User update(HttpServletRequest request, @RequestBody User user, @AuthenticationPrincipal PubUserDetails userDetails, HttpServletResponse response) {
    if (userDetails.getUser().getTemporary() && userService.get(user.getEmailAddress()) != null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      return null;
    }

    User currentUser = userDetails.getUser();
    User updatedUser = userService.update(currentUser, user);
    return updatedUser;
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
