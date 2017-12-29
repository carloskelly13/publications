package com.carlospaelinck.config;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public final class CsrfTokenGeneratorFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, java.io.IOException {
    CsrfToken token = (CsrfToken) request.getAttribute("_csrf");
    response.setHeader("X-CSRF-HEADER", token.getHeaderName());
    response.setHeader("X-CSRF-PARAM", token.getParameterName());
    response.setHeader("X-CSRF-TOKEN", token.getToken());
    filterChain.doFilter(request, response);
  }
}
