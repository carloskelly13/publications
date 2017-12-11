package com.carlospaelinck.controllers;

import com.carlospaelinck.domain.User;
import com.carlospaelinck.exceptions.ConflictException;
import com.carlospaelinck.security.UserDetails;
import com.carlospaelinck.services.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/users")
public class UserController {
  @Inject
  UserService userService;

  @RequestMapping(value = "/current", method = RequestMethod.GET)
  User current(@AuthenticationPrincipal UserDetails userDetails) {
    return userService.get(userDetails.getUser().getEmailAddress());
  }

  @RequestMapping(method = RequestMethod.POST)
  User create(@RequestBody User user) {
    return userService.create(user);
  }

  @RequestMapping(method = RequestMethod.PUT)
  User update(HttpServletRequest request, @RequestBody User user, @AuthenticationPrincipal UserDetails userDetails) {
    if (userDetails.getUser().getTemporary() && userService.get(user.getEmailAddress()) != null) {
      throw new ConflictException();
    }

    User updatedUser = userService.update(user);
    userDetails.setUser(updatedUser);
    return updatedUser;
  }

  @RequestMapping(value = "/login", method = RequestMethod.POST)
  User login(@RequestBody User user) {
    return userService.login(user);
  }

  @RequestMapping(value = "/logout", method = RequestMethod.DELETE)
  void logout(HttpServletRequest request, @AuthenticationPrincipal UserDetails userDetails) throws ServletException {
    userService.logout(userDetails.getUser().getEmailAddress());
    request.logout();
  }
}
