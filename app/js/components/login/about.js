import React from "react"
import styled from "styled-components"

const Content = styled.div`
  border-top: 1px #ccc solid;
  padding: 1.5em 2em 2em;
  text-align: center;

  @media all and (max-width: 767px) {
    padding: 1.5em 1em 2em;
  }
`

export const LoginAboutBox = () => (
  <Content>
    Publications is designed, developed and maintained by&nbsp;<a href="https://twitter.com/mikerkelly" target="_blank">Mike Kelly</a>&nbsp;and&nbsp;<a href="https://twitter.com/carlos_paelinck" target="_blank">Carlos Paelinck</a>. Powered by React, Redux and Spring Boot. The source for&nbsp;<a href="https://github.com/carlospaelinck/publications-js" target="_blank">the React client app</a>&nbsp;and&nbsp;<a href="https://github.com/carlospaelinck/publications-spring" target="_blank">the Spring Boot API</a>&nbsp;are available on GitHub.
  </Content>
)
