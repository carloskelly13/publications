import React, { KeyboardEvent, UIEvent } from "react";
import styled from "styled-components";
import get from "lodash/fp/get";
import range from "lodash/range";
import { Keys } from "../../util/constants";
import Canvas from "../canvas";
import Ruler from "../rulers";
import { StateContext } from "../../contexts/app-state";
import { IPubDocument, IPubShape } from "../../types/pub-objects";

const Container = styled.div`
  overflow: scroll;
  outline: none;
  z-index: 1;
  flex: 1;

  @media print {
    overflow: hidden;
  }
`;

const getIdFromDocument = get("id");
const ALLOWED_KEYS = [Keys.Up, Keys.Down, Keys.Left, Keys.Right];

interface IProps {
  currentDocument: IPubDocument | null;
  selectedObject: IPubShape | null;
  zoom: number;
  updateSelectedObject(sender?: Object | null): void;
  deleteObject(object?: IPubShape): void;
}

interface IState {
  scrollOffset: {
    scrollTop: number;
    scrollLeft: number;
  };
}

export class EditorView extends React.Component<IProps, IState> {
  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 },
  };

  containerRef: HTMLDivElement;

  componentWillReceiveProps(nextProps: IProps) {
    if (
      getIdFromDocument(this.props.currentDocument) !==
      getIdFromDocument(nextProps.currentDocument)
    ) {
      this.containerRef.scrollTop = 0;
      this.containerRef.scrollLeft = 0;
    }
  }

  handleViewScrollEvent = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop } = event.target as any;
    this.setState({ scrollOffset: { scrollLeft, scrollTop } });
  };

  handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    const { selectedObject } = this.props;
    if (!selectedObject || selectedObject.isEditing) {
      return;
    }

    if (ALLOWED_KEYS.indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }

    if (event.keyCode === Keys.Esc) {
      this.props.updateSelectedObject(null);
      return;
    } else if (event.keyCode === Keys.Delete) {
      this.props.deleteObject();
      return;
    }

    const changes = { y: 0, x: 0 };
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
    }

    const changeKeys = Object.keys(changes);
    if (changeKeys.length > 0) {
      changeKeys.forEach(
        key => (changes[key] = parseFloat(changes[key].toFixed(2)))
      );
      this.props.updateSelectedObject(changes);
    }
  };

  gridLineRanges = (): { x: number[]; y: number[] } => {
    const { currentDocument, zoom = 1 } = this.props;
    if (!currentDocument) {
      return { x: [], y: [] };
    }
    const { width, height } = currentDocument;
    return {
      x: range(0, width * 96 * zoom, 0.25 * 96 * zoom),
      y: range(0, height * 96 * zoom, 0.25 * 96 * zoom),
    };
  };

  render() {
    const {
      props: {
        currentDocument,
        selectedObject,
        zoom = 1,
        updateSelectedObject,
      },
      state: { scrollOffset },
    } = this;
    return (
      <Container
        innerRef={c => (this.containerRef = c)}
        onKeyDown={this.handleKeyPress}
        onScroll={this.handleViewScrollEvent}
        tabIndex={0}
      >
        {currentDocument ? (
          <div>
            <Ruler
              showDetail
              scrollOffset={scrollOffset}
              doc={currentDocument}
              zoom={zoom}
            />
            <Canvas
              allowsEditing
              width={currentDocument.width}
              height={currentDocument.height}
              dpi={96}
              zoom={zoom}
              thumbnail={false}
              selected={false}
              selectedShape={selectedObject}
              sortedShapes={currentDocument.shapes}
              backgroundGridLineRanges={this.gridLineRanges()}
              updateSelectedObject={updateSelectedObject}
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
          </div>
        ) : null}
      </Container>
    );
  }
}

const ConnectedCanvas: React.StatelessComponent<{}> = () => (
  <StateContext.Consumer>
    {({
      zoom,
      currentDocument,
      selectedObject,
      actions: { updateSelectedObject, deleteObject },
    }) => (
      <EditorView
        currentDocument={currentDocument}
        zoom={zoom}
        selectedObject={selectedObject}
        updateSelectedObject={updateSelectedObject}
        deleteObject={deleteObject}
      />
    )}
  </StateContext.Consumer>
);

export default ConnectedCanvas;
