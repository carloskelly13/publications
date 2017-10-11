import styled from "styled-components"
import { AppColors } from "../../util/constants"

export const ModalButtonContainer = styled.div`
  position: absolute;
  background: ${AppColors.MediumGray};
  bottom: 0;
  border-top: 1px solid #ccc;
  border-radius: 0 0 6px 6px;
  width: calc(100% - 10px);
  left: 0;
  right: 0;
  height: 40px;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 0 0;
  justify-content: flex-end;
`
