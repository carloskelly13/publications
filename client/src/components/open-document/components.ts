import styled from "styled-components";
import { ModalContent } from "../modal";
import { Colors } from "../../util/constants";
import FormInput from "../ui/form-input";

export const OpenDocumentContainer = styled(ModalContent)`
  min-width: 630px;
  width: 85%;
  padding: 0 0 51px;
`;

export const HeaderContainer = styled.div`
  padding: 1.5em 1.5em 1em;
`;

export const FileBrowserBaseContainer = styled.div`
  width: calc(100% - 1em);
  height: 370px;
  border-radius: 0;
  background: ${Colors.FileOpen.BrowserBackground};
  padding: 1.5em 0.5em;
`;

export const FileBrowserLoadingContainer = styled(FileBrowserBaseContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FileBrowserContentContainer = styled(FileBrowserBaseContainer)`
  border-top: 1px solid ${Colors.OpenDocument.FileBrowserBorder};
  overflow: scroll;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;

export const FileBrowserContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SearchInput = styled(FormInput)`
  margin: 15px;
  width: calc(100% - 30px);
`;
