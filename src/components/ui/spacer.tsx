import styled from "styled-components";

interface Props {
  width?: string;
  height?: string;
}
const Spacer = styled.div<Props>`
  display: inline-block;
  width: ${({ width }) => width || 0};
  height: ${({ height }) => height || 0};
`;
export default Spacer;
