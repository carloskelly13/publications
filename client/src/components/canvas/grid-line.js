import React from "react";
import styled from "styled-components";

export const GridPath = styled.path`
  fill: none;
  stroke: ${({ major }) =>
    major ? "hsla(207, 86%, 86%, 1)" : "hsla(0, 0%, 0%, 0.075)"};
  stroke-width: 1;
  shape-rendering: crispEdges;

  @media print {
    display: none;
  }
`;

export class GridLine extends React.PureComponent {
  render() {
    const { mX, mY, direction, dX, dY, major } = this.props;
    return (
      <GridPath major={major} d={`M${mX},${mY} ${direction}${dX},${dY} Z`} />
    );
  }
}
