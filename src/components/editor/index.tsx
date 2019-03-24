import React, { KeyboardEvent, UIEvent } from "react";
import styled from "styled-components";
// import get from "lodash/fp/get";
import range from "lodash/range";
import { Keys } from "../../util/constants";
import Canvas from "../canvas";
import Ruler from "../rulers";
import { StateContext } from "../../contexts";
import { PubShape } from "../../types/pub-objects";

const Container = styled.div`
  overflow: scroll;
  outline: none;
  flex: 1;
  padding: 0 25px 25px 0;
  position: relative;

  @media print {
    overflow: hidden;
    padding: 0;
  }
`;

const gridRangesZero = { x: [], y: [] };
const scrollOffsetZero = {
  scrollLeft: 0,
  scrollTop: 0,
};

const ALLOWED_KEYS = [Keys.Up, Keys.Down, Keys.Left, Keys.Right];

export default function Editor() {
  const { currentDocument, zoom, selectedObject, actions } = React.useContext(
    StateContext
  );
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = React.useState(scrollOffsetZero);
  const [gridLineRanges, setGridLineRanges] = React.useState(gridRangesZero);

  const handleViewScrollEvent = React.useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      setScrollOffset({
        scrollTop: event.currentTarget.scrollTop,
        scrollLeft: event.currentTarget.scrollLeft,
      });
    },
    []
  );

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!selectedObject || selectedObject.isEditing) {
        return;
      }
      if (ALLOWED_KEYS.indexOf(event.keyCode) > -1) {
        event.preventDefault();
      }
      if (event.keyCode === Keys.Esc) {
        actions.updateSelectedObject(null);
        return;
      } else if (event.keyCode === Keys.Delete) {
        actions.deleteObject();
        return;
      }
      const changes: Partial<PubShape> = {};
      switch (event.keyCode) {
        case Keys.Up:
          changes.y = selectedObject.y - 0.05;
          break;
        case Keys.Down:
          changes.y = selectedObject.y + 0.05;
          break;
        case Keys.Left:
          changes.x = selectedObject.x - 0.05;
          break;
        case Keys.Right:
          changes.x = selectedObject.x + 0.05;
          break;
        default:
          break;
      }
      const changeKeys = Object.keys(changes);
      if (changeKeys.length > 0) {
        changeKeys.forEach(
          key => (changes[key] = parseFloat(changes[key].toFixed(2)))
        );
        actions.updateSelectedObject(changes);
      }
    },
    [actions, selectedObject]
  );

  React.useEffect(() => {
    if (!currentDocument) {
      setGridLineRanges(gridRangesZero);
      return;
    }
    const { width, height } = currentDocument.pages[0];
    setGridLineRanges({
      x: range(0, width * 96 * zoom, 0.25 * 96 * zoom),
      y: range(0, height * 96 * zoom, 0.25 * 96 * zoom),
    });
  }, [currentDocument, zoom]);

  return (
    <Container
      innerRef={containerRef}
      onScroll={handleViewScrollEvent}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {currentDocument ? (
        <>
          <Ruler
            dpi={96}
            showDetail
            scrollOffset={scrollOffset}
            doc={currentDocument}
            zoom={zoom}
          />
          <Canvas
            allowsEditing
            width={currentDocument.pages[0].width}
            height={currentDocument.pages[0].height}
            dpi={96}
            zoom={zoom}
            thumbnail={false}
            selectedShape={selectedObject}
            sortedShapes={currentDocument.pages[0].shapes}
            backgroundGridLineRanges={gridLineRanges}
            updateSelectedObject={actions.updateSelectedObject}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                  @page {
                    size: auto;
                    margin: 0mm;
                    marks: none;
                  }
                  @media print {
                    html, body { margin: 0; }
                  }
                `,
            }}
          />
        </>
      ) : null}
    </Container>
  );
}
