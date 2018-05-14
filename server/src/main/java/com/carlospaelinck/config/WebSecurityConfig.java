package com.carlospaelinck.config;

import javax.inject.Inject;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CsrfFilter;
import com.carlospaelinck.security.UserDetailsServiceImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  private final UserDetailsServiceImpl userDetailsServiceImpl;

  @Inject
  public WebSecurityConfig(UserDetailsServiceImpl userDetailsServiceImpl) {
    this.userDetailsServiceImpl = userDetailsServiceImpl;
  }

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
      .userDetailsService(userDetailsServiceImpl)
      .passwordEncoder(new BCryptPasswordEncoder());
  }

  @Override
  @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }
}
