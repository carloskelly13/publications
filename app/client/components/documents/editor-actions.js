import { EditorState } from "draft-js";

export const newStateForChanges = (changes, currentObject, currentDocument) => {
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
