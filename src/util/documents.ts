import { EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import importTextStyle from "./import-text-style";
import { exporter as textStyleExporter } from "../components/shapes/text-box";
import pick from "lodash/fp/pick";
import { PubShape, PubDocument, PubShapeType } from "../types/pub-objects";
import cloneDeep from "clone-deep";
import flowRight from "lodash/fp/flowRight";

export const omitTransientData = pick<PubShape, keyof PubShape>([
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

export function addEditorStateToObject(shape: PubShape) {
  const contentState = stateFromHTML(shape.text, {
    customInlineFn: importTextStyle,
  });
  shape.editorState = EditorState.createWithContent(contentState);
  shape.isEditing = false;
  return shape;
}

export function addEditorStateToDocument(document: PubDocument) {
  return {
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
  };
}

export function convertObjStylesToHTML(shape: PubShape) {
  if (shape.type === PubShapeType.Text) {
    const { editorState, ...jsonShape } = shape;
    const inlineStyles = textStyleExporter(editorState);
    jsonShape.text = stateToHTML(editorState.getCurrentContent(), {
      inlineStyles,
    });
    return jsonShape;
  }
  return shape;
}

export function documentsWithEditorState(documents: PubDocument[] | null) {
  if (!documents) {
    return null;
  }
  return documents.map(document => addEditorStateToDocument(document));
}

export const duplicateShape: (shape: PubShape) => PubShape = flowRight(
  cloneDeep,
  omitTransientData,
  convertObjStylesToHTML
);

export const documentNameSort = (lhs: PubDocument, rhs: PubDocument) =>
  lhs.name.localeCompare(rhs.name);

export const validatePositiveFloat = (candidate: string) =>
  /^\d*\.?\d*$/.test(candidate);
