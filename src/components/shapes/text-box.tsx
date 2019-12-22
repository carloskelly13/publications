import React from "react";
import { Editor } from "draft-js";
import createStyles from "draft-js-custom-styles";
import { PubShape } from "../../types/pub-objects";

export const { styles, customStyleFn, exporter } = createStyles(
  ["font-size", "color", "font-family"],
  "PUB_"
);

interface Props {
  shape: PubShape;
  zoom: number;
  dpi: number;
  activeDraftJSEditor: string;
  updateSelectedObject(sender?: Record<string, any> | null): void;
}

const TextBox: React.FunctionComponent<Props> = ({
  shape,
  zoom,
  dpi,
  activeDraftJSEditor,
  updateSelectedObject,
}) => {
  const readOnly = activeDraftJSEditor !== shape.id;
  const metrics = {
    x: dpi * shape.x * zoom,
    y: dpi * shape.y * zoom,
    width: dpi * shape.width * zoom,
    height: dpi * shape.height * zoom,
  };
  const ref = React.useRef<Editor>(null);
  React.useEffect(
    () => {
      if (ref.current && activeDraftJSEditor === shape.id) {
        ref.current.focus();
      }
    },
    [activeDraftJSEditor, shape.id]
  );
  return (
    <g>
      {readOnly ? null : (
        <rect
          {...metrics}
          strokeWidth={1}
          stroke="hsla(0, 0%, 0%, 0.5)"
          fill="transparent"
        />
      )}
      <foreignObject {...metrics}>
        {typeof window !== "undefined" ? (
          <Editor
            ref={ref}
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
