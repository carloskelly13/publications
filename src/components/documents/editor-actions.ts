import { EditorState } from "draft-js";
import cloneDeep from "lodash/fp/cloneDeep";
import omit from "lodash/fp/omit";
import flowRight from "lodash/fp/flowRight";
import {
  addEditorStateToObject,
  convertObjStylesToHTML,
} from "../../util/documents";
import shortid from "shortid";
import {
  PubShape,
  PubDocument,
  PubShapeChanges,
} from "../../types/pub-objects";

export const omitTransientDataFromObj = omit([
  "z",
  "editorState",
  "id",
  "isEditing",
]);

type UpdateDocumentStateForChangesFn = (
  changes: PubShapeChanges,
  currentObject: PubShape,
  currentDocument: PubDocument
) => { selectedObject: PubShape | null; currentDocument?: PubDocument };

export const updatedDocumentStateForObjectChanges: UpdateDocumentStateForChangesFn = (
  changes,
  currentObject,
  currentDocument
) => {
  /**
   * If changes are not null, then a new shape has been selected or existing
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
    } else if (changes.type === "text" && newObject.editorState) {
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

export interface LayerMutationDelta {
  source?: { index: number };
  destination?: { index: number };
}
type UpdateDocumentStateForLayerChangesFn = (
  delta: LayerMutationDelta,
  currentDocument: PubDocument | null
) => { currentDocument?: PubDocument; selectedObject?: PubShape };

export const updatedDocumentStateForLayerChanges: UpdateDocumentStateForLayerChangesFn = (
  { source, destination },
  currentDocument
) => {
  if (!source || !destination || !currentDocument) {
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

export enum ClipboardAction {
  Copy = "copy",
  Paste = "paste",
  Cut = "cut",
}

type UpdateDocumentStateForClipboardActionFn = (
  action: ClipboardAction,
  state: {
    clipboardContents: PubShape | null;
    selectedObject: PubShape | null;
    currentDocument: PubDocument | null;
  }
) => {
  clipboardContents?: PubShape;
  selectedObject?: PubShape | null;
  currentDocument?: PubDocument;
};

const duplicateObj: (object: PubShape) => PubShape = flowRight<
  PubShape,
  PubShape,
  PubShape
>(
  cloneDeep,
  omitTransientDataFromObj,
  convertObjStylesToHTML
);

export const updatedDocumentStateForClipboardAction: UpdateDocumentStateForClipboardActionFn = (
  action,
  { clipboardContents, selectedObject, currentDocument }
) => {
  if (!selectedObject || !currentDocument) {
    return {};
  }

  const updatedState: { [key: string]: PubDocument | PubShape } = {};

  if (action === ClipboardAction.Copy) {
    updatedState.clipboardContents = duplicateObj(selectedObject);
  } else if (action === ClipboardAction.Cut) {
    return {
      clipboardContents: duplicateObj(selectedObject),
      ...updatedDocumentStateForDeleteAction(selectedObject, currentDocument),
    };
  } else if (action === ClipboardAction.Paste && clipboardContents) {
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

type UpdateDocumentStateForDeleteActionFn = (
  objectToDelete: PubShape | null,
  currentDocument: PubDocument | null
) => { currentDocument?: PubDocument; selectedObject: PubShape | null };

export const updatedDocumentStateForDeleteAction: UpdateDocumentStateForDeleteActionFn = (
  objectToDelete,
  currentDocument
) => {
  if (!objectToDelete || !currentDocument) {
    return { selectedObject: null };
  }
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
