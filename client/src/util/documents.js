import { EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import importTextStyle from "../util/import-text-style";
import { exporter as textStyleExporter } from "../components/shapes/text-box";
import sortBy from "lodash/fp/sortBy";

export const sortShapesByZIndex = sortBy("z");

export const addEditorStateToDocument = document => ({
  ...document,
  shapes: document.shapes.map(shape => {
    if (shape.type === "text") {
      return addEditorStateToObject(shape);
    }
    return shape;
  }),
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

export const packageDocumentToJson = document => ({
  width: document.width,
  height: document.height,
  name: document.name,
  shapes: document.shapes.map(shape => convertObjStylesToHTML(shape)),
});

export const documentsWithEditorState = documents =>
  documents.map(document => addEditorStateToDocument(document));
