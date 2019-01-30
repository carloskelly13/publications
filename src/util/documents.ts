import { EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import importTextStyle from "./import-text-style";
import { exporter as textStyleExporter } from "../components/shapes/text-box";
import pick from "lodash/fp/pick";

export const omitTransientData = pick([
  "type",
  "width",
  "height",
  "x",
  "y",
  "z",
  "r",
  "fill",
  "fillOpacity",
  "stroke",
  "strokeWidth",
  "strokeOpacity",
  "text",
]);

export const addEditorStateToDocument = document => ({
  ...document,
  pages: document.pages.map(page => ({
    ...page,
    shapes: page.shapes.map(shape => {
      if (shape.type === "text") {
        return addEditorStateToObject(shape);
      }
      return shape;
    }),
  })),
});

export const addEditorStateToObject = shape => {
  const contentState = stateFromHTML(shape.text, {
    customInlineFn: importTextStyle,
  });
  shape.editorState = EditorState.createWithContent(contentState);
  shape.isEditing = false;
  return shape;
};

export const convertObjStylesToHTML = shape => {
  if (shape.type === "text") {
    const { editorState, ...jsonShape } = shape;
    const inlineStyles = textStyleExporter(editorState);
    jsonShape.text = stateToHTML(editorState.getCurrentContent(), {
      inlineStyles,
    });
    return jsonShape;
  }
  return shape;
};

export const documentsWithEditorState = documents =>
  documents.map(document => addEditorStateToDocument(document));
