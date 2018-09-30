import React from "react";
import { Editor } from "draft-js";
import createStyles from "draft-js-custom-styles";
import { PubShape } from "../../types/pub-objects";

export const { styles, customStyleFn, exporter } = createStyles(
  ["font-size", "color", "font-family"],
  "PUB_"
);

interface IProps {
  shape: PubShape;
  zoom: number;
  dpi: number;
  activeDraftJSEditor: string;
  updateSelectedObject(sender?: Object | null): void;
}

const TextBox: React.StatelessComponent<IProps> = ({
  shape,
  zoom,
  dpi,
  activeDraftJSEditor,
  updateSelectedObject,
}) => {
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
      {readOnly ? null : (
        <rect
          {...metrics}
          strokeWidth={1}
          stroke="hsla(0, 0%, 0%, 0.5)"
          fill="transparent"
          style={{ transform }}
        />
      )}
      <foreignObject {...metrics} style={{ transform }}>
        {typeof window !== "undefined" ? (
          <Editor
            customStyleFn={customStyleFn}
            editorState={shape.editorState!}
            onChange={state => updateSelectedObject({ editorState: state })}
            readOnly={readOnly}
          />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: shape.text }} />
        )}
      </foreignObject>
    </g>
  );
};

export default TextBox;
