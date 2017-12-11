import React from "react";
import styled from "styled-components";
import { PubInput } from "../ui/pub-input";

const SearchContainer = styled.div`
  margin: 0 0 10px 0;
  text-align: center;
`;

const SearchInput = styled(PubInput)`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  width: 50%;

  @media all and (max-width: 767px) {
    border-left: none;
    border-radius: 0;
    border-right: none;
    width: 100%;
  }
`;

export const Search = ({ keyword, keywordChanged }) => (
  <SearchContainer>
    <SearchInput
      value={keyword}
      onChange={keywordChanged}
      placeholder="Search for Documents"
    />
  </SearchContainer>
);
