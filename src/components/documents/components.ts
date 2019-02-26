import styled from "styled-components";

export const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ViewContent = styled.div`
  display: flex;
  flex: 1 0 calc(100% - 85px);
`;

export const DocumentView = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  height: 100vh;

  @media print {
    height: 100vh;
  }
`;
