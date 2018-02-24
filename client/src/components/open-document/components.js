import styled from "styled-components";
import { ModalContent } from "../modal";
import { AppColors } from "../../util/constants";
import { TextInput } from "../ui/inputs";

export const OpenDocumentContainer = styled(ModalContent)`
  min-width: 630px;
  width: 85%;
  padding: 0 0 40px;
`;

export const HeaderContainer = styled.div`
  padding: 1.5em 1.5em 1em;
`;

export const FileBrowserBaseContainer = styled.div`
  width: calc(100% - 1em);
  height: 370px;
  border-radius: 0;
  background: ${AppColors.White};
  padding: 1.5em 0.5em;
`;

export const FileBrowserLoadingContainer = styled(FileBrowserBaseContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FileBrowserContentContainer = styled(FileBrowserBaseContainer)`
  overflow: scroll;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;

export const FileBrowserContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SearchInput = styled(TextInput)`
  background: #f9f9f9;
  flex: 1;
  border-top: none;
  border-left: none;
  border-right: none;
  text-align: center;
  border-radius: 0;
  padding: 10px 2px;
  font-size: 15px;
  font-weight: 600;
`;
