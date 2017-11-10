package com.carlospaelinck.security;

import com.carlospaelinck.domain.Document;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

public class MethodSecurityExpressionRoot
  extends SecurityExpressionRoot
  implements MethodSecurityExpressionOperations {

  @Getter
  @Setter
  public Object filterObject;

  @Getter
  @Setter
  public Object returnObject;

  @Getter
  @Setter
  private Object target;

  public MethodSecurityExpressionRoot(Authentication authentication) {
    super(authentication);
  }

  public boolean isOwner(Object object) {
    UserDetails principal = (UserDetails) this.getPrincipal();

    if (object instanceof Document) {
      Document document = (Document) object;
      return document.getUser().getId().equals(principal.getUser().getId());
    }

    return false;
  }

  public Object getThis() {
    return target;
  }

  public void setThis(Object target) {
    this.target = target;
  }
}
