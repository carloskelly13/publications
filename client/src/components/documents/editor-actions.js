import { EditorState } from "draft-js";
import cloneDeep from "lodash/fp/cloneDeep";
import omit from "lodash/fp/omit";
import compose from "lodash/fp/compose";
import {
  addEditorStateToObject,
  convertObjStylesToHTML,
} from "../../util/documents";
import shortid from "shortid";

export const omitTransientDataFromObj = omit([
  "z",
  "editorState",
  "id",
  "isEditing",
]);

export const updatedDocumentStateForObjectChanges = (
  changes,
  currentObject,
  currentDocument
) => {
  /**
   * If changes is not null, then a new shape has been selected or existing
   * shape that is currently selected has been modified
   */
  if (changes !== null) {
    /**
     * Update shape action only send the delta, so create a new shape object
     * with the previous and new properties merged
     */
    const newObject = { ...currentObject, ...changes };
    const currentObjects = currentDocument.shapes;
    /**
     * If a currently selected shape is being modified replace the existing
     * shape in the documents shape array with a new shapes
     */
    if (
      currentObject !== null &&
      (typeof changes.id === "undefined" || changes.id === currentObject.id)
    ) {
      const idx = currentObjects.findIndex(
        shape => currentObject.id === shape.id
      );
      const shapes = [
        ...currentObjects.slice(0, idx),
        newObject,
        ...currentObjects.slice(idx + 1),
      ];
      return {
        selectedObject: newObject,
        currentDocument: { ...currentDocument, shapes },
      };
    } else if (changes.type === "text") {
      newObject.editorState = EditorState.moveSelectionToEnd(
        newObject.editorState
      );
    }
    return { selectedObject: newObject };
  }

  /**
   * A shape has been deselected so nullify the newObject property
   */
  return { selectedObject: null };
};

export const updatedDocumentStateForLayerChanges = (
  { source, destination },
  currentDocument
) => {
  if (!source || !destination) {
    return {};
  }
  const sortedObjects = Array.from(currentDocument.shapes);
  const fromIndex = source.index;
  const toIndex = destination.index;

  const [adjustedShape] = sortedObjects.splice(fromIndex, 1);
  sortedObjects.splice(toIndex, 0, adjustedShape);

  const normalizedObjects = sortedObjects.map((shape, index) => ({
    ...shape,
    z: index + 1,
  }));

  const normalizedSelectedObject = normalizedObjects.find(
    shape => shape.id === adjustedShape.id
  );

  return {
    currentDocument: {
      ...currentDocument,
      shapes: normalizedObjects,
    },
    selectedObject: normalizedSelectedObject,
  };
};

export const updatedDocumentStateForClipboardAction = (
  action,
  // eslint-disable-next-line no-unused-vars
  { clipboardContents, selectedObject, currentDocument }
) => {
  const updatedState = {};

  const duplicateObj = () =>
    compose(cloneDeep, omitTransientDataFromObj, convertObjStylesToHTML)(
      selectedObject
    );

  if (action === "copy") {
    updatedState.clipboardContents = duplicateObj();
  } else if (action === "cut") {
    return {
      clipboardContents: duplicateObj(),
      ...updatedDocumentStateForDeleteAction(selectedObject, currentDocument),
    };
  } else if (action === "paste") {
    const z = currentDocument.shapes.length + 1;
    const newObject = cloneDeep(clipboardContents);
    newObject.z = z;
    newObject.id = shortid.generate();

    if (newObject.type === "text") {
      addEditorStateToObject(newObject);
    }

    updatedState.currentDocument = {
      ...currentDocument,
      shapes: [...currentDocument.shapes, newObject],
    };
    updatedState.selectedObject = newObject;
  }

  return updatedState;
};

export const updatedDocumentStateForDeleteAction = (
  objectToDelete,
  currentDocument
) => {
  const shapes = currentDocument.shapes
    .filter(shape => shape.id !== objectToDelete.id)
    .map(shape => {
      if (shape.z > objectToDelete.z) {
        shape.z -= 1;
      }
      return shape;
    });
  return {
    selectedObject: null,
    currentDocument: { ...currentDocument, shapes },
  };
};
