package com.carlospaelinck.security;

import org.aopalliance.intercept.MethodInvocation;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.core.Authentication;

public class MethodSecurityExpressionHandler extends DefaultMethodSecurityExpressionHandler {

  private final AuthenticationTrustResolver trustResolver = new AuthenticationTrustResolverImpl();

  @Override
  protected MethodSecurityExpressionOperations createSecurityExpressionRoot(Authentication authentication,
      MethodInvocation invocation) {
      final MethodSecurityExpressionRoot root = new MethodSecurityExpressionRoot(authentication);
      root.setThis(invocation.getThis());
      root.setPermissionEvaluator(getPermissionEvaluator());
      root.setTrustResolver(trustResolver);
      root.setRoleHierarchy(getRoleHierarchy());
      return root;
  }
}
