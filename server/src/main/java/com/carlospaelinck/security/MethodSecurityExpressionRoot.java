package com.carlospaelinck.security;

import com.carlospaelinck.domain.Document;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

import java.util.Optional;

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

  public boolean isOwner(Optional<Document> optionalDocument) {
    PubUserDetails principal = (PubUserDetails) this.getPrincipal();

    if (optionalDocument.isPresent()) {
      Document document = optionalDocument.get();
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
