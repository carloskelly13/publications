import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import get from "lodash/fp/get";
import range from "lodash/range";
import { Keys } from "../../util/constants";
import Canvas from "../canvas";
import Ruler from "../rulers";

const Container = styled.div`
  transition: width 350ms ease-in-out;
  overflow: scroll;
  outline: none;
  z-index: 1;
  height: 100%;
`;

const ALLOWED_KEYS = [Keys.Up, Keys.Down, Keys.Left, Keys.Right];

export default class EditorView extends React.Component {
  static contextTypes = {
    actions: PropTypes.object.isRequired,
  };

  state = {
    scrollOffset: { scrollLeft: 0, scrollTop: 0 },
  };

  componentDidMount() {
    const { match: { params: { id } } } = this.props;
    if (id) {
      this.context.actions.getDocument(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { id } } } = nextProps;
    if (get("id")(this.props.currentDocument) !== id) {
      this.containerRef.scrollTop = 0;
      this.containerRef.scrollLeft = 0;
      this.context.actions.getDocument(id);
    }
  }

  handleViewScrollEvent = ({ target: { scrollLeft, scrollTop } }) => {
    this.setState({ scrollOffset: { scrollLeft, scrollTop } });
  };

  handleKeyPress = event => {
    if (!this.props.selectedObject || this.props.selectedObject.isEditing) {
      return;
    }

    if (ALLOWED_KEYS.indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }

    if (event.keyCode === Keys.Esc) {
      this.context.actions.updateSelectedObject(null);
      return;
    } else if (event.keyCode === Keys.Delete) {
      this.context.actions.deleteObject();
      return;
    }

    const changes = {};
    switch (event.keyCode) {
      case Keys.Up:
        changes.y = this.props.selectedObject.y - 0.05;
        break;
      case Keys.Down:
        changes.y = this.props.selectedObject.y + 0.05;
        break;
      case Keys.Left:
        changes.x = this.props.selectedObject.x - 0.05;
        break;
      case Keys.Right:
        changes.x = this.props.selectedObject.x + 0.05;
        break;
    }

    const changeKeys = Object.keys(changes);
    if (changeKeys.length > 0) {
      changeKeys.forEach(
        key => (changes[key] = parseFloat(changes[key].toFixed(2)))
      );
      this.context.actions.updateSelectedObject(changes);
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
        editModeActive = true,
        sidePanelVisible = false,
        zoom = 1,
      },
      state: { scrollOffset },
    } = this;
    const { actions } = this.context;
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
              width={currentDocument.width}
              height={currentDocument.height}
              dpi={96}
              zoom={zoom}
              selectedShape={selectedObject}
              sortedShapes={currentDocument.shapes}
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
