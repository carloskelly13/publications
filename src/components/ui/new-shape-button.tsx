import * as React from "react";
import styled from "styled-components";
import { Colors } from "../../util/constants";
import PlusCloseIcon from "./icons/plus-close";
import posed, { PoseGroup } from "react-pose";
import { Shapes } from "../../util/new-shapes";
import { StateContext } from "../../contexts/documents-provider";
import { PubShape } from "../../types/pub-objects";

const NewShapeContainer = posed(styled.div`
  background: ${Colors.NewShapeButton.Background};
  border-radius: 24px 0 0 24px;
  border: 1px solid ${Colors.NewShapeButton.Border};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.33),
    1px 1px 5px hsla(0, 0%, 0%, 0.5);
  display: grid;
  grid-template-columns: repeat(3, 33%);
  height: 46px;
  position: relative;
  width: 320px;
  z-index: 0;
`)({
  enter: { opacity: 1, marginRight: "-1px" },
  exit: { opacity: 0, marginRight: "-10px" },
});

const NewShapeColumnButton = styled.button`
  background: transparent;
  border: none;
  border-right: 1px solid ${Colors.NewShapeButton.Border};
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.33);
  color: ${Colors.NewShapeButton.Text};
  font-size: 15px;
  font-weight: bold;
  margin: 0;
  padding: 0;

  &:first-child {
    border-radius: 24px 0 0 24px;
  }

  &:last-child {
    border-right: none;
  }

  &:active {
    box-shadow: inset 1px 1px 0 hsla(0, 0%, 0%, 0.167);
  }
`;

const Container = styled.div`
  align-items: center;
  bottom: 25px;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 275px;
`;

const Button = posed(styled.button`
  align-items: center;
  background: ${Colors.NewShapeButton.Background};
  border-radius: 24px;
  border: 1px solid hsla(0, 0%, 0%, 0.25);
  box-shadow: inset 1px 1px 0 hsla(0, 0%, 100%, 0.33),
    1px 1px 5px hsla(0, 0%, 0%, 0.5);
  color: ${Colors.NewShapeButton.Text};
  display: flex;
  height: 48px;
  justify-content: center;
  width: 48px;
  z-index: 1;
  position: relative;
  &:active {
    box-shadow: inset 1px 1px 0 hsla(0, 0%, 0%, 0.167),
      1px 1px 5px hsla(0, 0%, 0%, 0.5);
  }
`)({
  open: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  closed: {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
});

export default function NewShapeButton() {
  const [open, setOpen] = React.useState(false);
  const { actions } = React.useContext(StateContext);
  const addObject = React.useCallback(
    (shape: PubShape) => {
      actions.addObject(shape);
      setOpen(false);
    },
    [actions]
  );
  return (
    <Container>
      {open && (
        <PoseGroup animateOnMount>
          <NewShapeContainer key="new-shape">
            <NewShapeColumnButton onClick={() => addObject(Shapes.Ellipse)}>
              Ellipse
            </NewShapeColumnButton>
            <NewShapeColumnButton onClick={() => addObject(Shapes.Rectangle)}>
              Rectangle
            </NewShapeColumnButton>
            <NewShapeColumnButton onClick={() => addObject(Shapes.Text)}>
              Text Box
            </NewShapeColumnButton>
          </NewShapeContainer>
        </PoseGroup>
      )}
      <Button
        pose={open ? "open" : "closed"}
        onClick={() => setOpen(prevOpen => !prevOpen)}
      >
        <PlusCloseIcon showAsClose={open} />
      </Button>
    </Container>
  );
}
