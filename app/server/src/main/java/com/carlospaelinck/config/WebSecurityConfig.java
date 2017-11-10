package com.carlospaelinck.config;

import javax.inject.Inject;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import com.carlospaelinck.security.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

  @Inject
  UserDetailsService userDetailsService;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .csrf()
        .ignoringAntMatchers("/users/**")
      .and()
        .addFilterAfter(new CsrfTokenGeneratorFilter(), CsrfFilter.class)
        .exceptionHandling()
      .and()
        .authorizeRequests()
        .antMatchers("/users/login")
            .permitAll()
        .antMatchers(HttpMethod.POST, "/users")
            .permitAll()
        .anyRequest()
            .authenticated();
  }

  @Inject
  protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    auth
      .userDetailsService(userDetailsService)
      .passwordEncoder(new BCryptPasswordEncoder());
  }
}
