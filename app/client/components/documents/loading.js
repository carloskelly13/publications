import React from "react";
import styled from "styled-components";
import { AppColors } from "../../util/constants";
import { Spinner } from "../ui/spinner";

const Background = styled.div`
  position: absolute;
  top: 50px;
  bottom: 0;
  right: 0;
  left: 0;
  background: ${AppColors.White};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export default () => (
  <Background>
    <Spinner />
  </Background>
);
