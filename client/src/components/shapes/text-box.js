import React from "react";
import PropTypes from "prop-types";
import { Editor } from "draft-js";
import createStyles from "draft-js-custom-styles";

export const { styles, customStyleFn, exporter } = createStyles(
  ["font-size", "color", "font-family"],
  "PUB_"
);

class TextBox extends React.PureComponent {
  static contextTypes = {
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { shape, zoom, dpi, activeDraftJSEditor } = this.props;

    const readOnly = activeDraftJSEditor !== shape.id;
    const metrics = {
      x: dpi * shape.x,
      y: dpi * shape.y,
      width: dpi * shape.width,
      height: dpi * shape.height,
    };
    const transform = `scale(${zoom})`;

    return (
      <g>
        {!readOnly && (
          <rect
            {...metrics}
            strokeWidth={1}
            stroke="hsla(0, 0%, 0%, 0.5)"
            fill="transparent"
            style={{ transform }}
          />
        )}
        <foreignObject {...metrics} style={{ transform }}>
          <Editor
            customStyleFn={customStyleFn}
            editorState={shape.editorState}
            onChange={state =>
              this.context.actions.updateSelectedObject({ editorState: state })
            }
            readOnly={readOnly}
          />
        </foreignObject>
      </g>
    );
  }
}

export default TextBox;
