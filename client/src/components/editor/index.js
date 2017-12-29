import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import range from "lodash/range";
import {
  AppColors,
  contentPanelWidthFull,
  contentPanelWidthPartial,
  Keys,
} from "../../util/constants";
import Canvas from "../canvas";
import Ruler from "../rulers";

const Container = styled.div`
  transition: width 350ms ease-in-out;
  background: ${AppColors.Gray20};
  overflow: scroll;
  width: ${({ sidePanelVisible }) =>
    sidePanelVisible ? contentPanelWidthPartial : contentPanelWidthFull};
  z-index: 1;
  height: 100%;
`;

export default class EditorView extends React.Component {
  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 },
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    if (id) {
      this.props.getDocument(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = nextProps;
    if (get(this.props.currentDocument, "id") !== id) {
      this.containerRef.scrollTop = 0;
      this.containerRef.scrollLeft = 0;
      this.props.getDocument(id);
    }
  }

  handleViewScrollEvent = ({ target: { scrollLeft, scrollTop } }) => {
    this.setState({ scrollOffset: { scrollLeft, scrollTop } });
  };

  handleKeyPress = event => {
    if (!this.props.selectedShape || this.props.selectedShape.isEditing) {
      return;
    }

    const arrowKeys = [Keys.Up, Keys.Down, Keys.Left, Keys.Right];
    if (arrowKeys.indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }

    const changes = {};
    switch (event.keyCode) {
      case Keys.Up:
        changes.y = this.props.selectedShape.y - 0.05;
        break;
      case Keys.Down:
        changes.y = this.props.selectedShape.y + 0.05;
        break;
      case Keys.Left:
        changes.x = this.props.selectedShape.x - 0.05;
        break;
      case Keys.Right:
        changes.x = this.props.selectedShape.x + 0.05;
        break;
    }

    const changeKeys = Object.keys(changes);
    if (changeKeys.length > 0) {
      changeKeys.forEach(
        key => (changes[key] = parseFloat(changes[key].toFixed(2)))
      );
      this.props.updateSelectedShape(changes);
    }
  };

  gridLineRanges = () => {
    const { currentDocument: { width, height }, zoom = 1 } = this.props;
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
        updateSelectedObject,
        editModeActive = true,
        sidePanelVisible = false,
        zoom = 1,
      },
      state: { scrollOffset },
    } = this;
    return (
      <Container
        sidePanelVisible={sidePanelVisible}
        innerRef={c => (this.containerRef = c)}
        onKeyDown={this.handleKeyPress}
        onScroll={this.handleViewScrollEvent}
        tabIndex={0}
      >
        {currentDocument && (
          <div>
            <Ruler
              showDetail={editModeActive}
              scrollOffset={scrollOffset}
              doc={currentDocument}
              zoom={zoom}
            />
            <Canvas
              allowsEditing
              doc={currentDocument}
              dpi={96}
              zoom={zoom}
              selectedShape={selectedObject}
              sortedShapes={currentDocument.shapes}
              documentMetrics={{
                width: currentDocument.width,
                height: currentDocument.height,
              }}
              updateSelectedShape={updateSelectedObject}
              backgroundGridLineRanges={this.gridLineRanges()}
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @page {
                    size: ${
                      currentDocument.width > currentDocument.height
                        ? "landscape"
                        : "portrait"
                    };
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
        )}
      </Container>
    );
  }
}
