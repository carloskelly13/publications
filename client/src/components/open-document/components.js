import styled from "styled-components";
import { ModalContent } from "../modal";
import { AppColors } from "../../util/constants";

export const OpenDocumentContainer = styled(ModalContent)`
  min-width: 630px;
  width: 85%;
  padding: 0 0 40px;
`;

export const HeaderContainer = styled.div`
  padding: 1.5em 1.5em 1em;
  border-bottom: 1px solid ${AppColors.Gray};
`;
