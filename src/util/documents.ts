import { EditorState } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import importTextStyle from "./import-text-style";
import { exporter as textStyleExporter } from "../components/shapes/text-box";
import sortBy from "lodash/fp/sortBy";
import omit from "lodash/fp/omit";

const omitTransientData = omit([
  "id",
  "isEditing",
  "__typename",
  "editorState",
]);

export const sortShapesByZIndex = sortBy("z");

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

export const packageDocumentToJson = document => ({
  name: document.name,
  pages: [
    {
      id: document.pages[0].id,
      pageNumber: document.pages[0].pageNumber,
      width: document.pages[0].width,
      height: document.pages[0].height,
      shapes: document.pages[0].shapes.map(inputShape => {
        const outputShape = convertObjStylesToHTML(inputShape);
        return omitTransientData(outputShape);
      }),
    },
  ],
});

export const documentsWithEditorState = documents =>
  documents.map(document => addEditorStateToDocument(document));
