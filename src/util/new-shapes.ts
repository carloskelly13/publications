import { EditorState, ContentState } from "draft-js";
import { PubShape, PubShapeType } from "../types/pub-objects";

interface AllShapes {
  Rectangle: PubShape;
  Ellipse: PubShape;
  Text: PubShape;
}

export const Shapes: AllShapes = {
  Rectangle: {
    id: "0",
    type: PubShapeType.Rectangle,
    x: 0.25,
    y: 0.25,
    r: 0,
    z: 0,
    width: 1,
    height: 1,
    fill: "#609eeb",
    stroke: "#4e8bda",
    strokeWidth: 1,
    strokeOpacity: 1.0,
    fillOpacity: 1.0,
  },
  Ellipse: {
    id: "0",
    type: PubShapeType.Ellipse,
    x: 0.25,
    y: 0.25,
    r: 0,
    z: 0,
    width: 1,
    height: 1,
    fill: "#609eeb",
    stroke: "#4e8bda",
    strokeWidth: 1,
    strokeOpacity: 1.0,
    fillOpacity: 1.0,
  },
  Text: {
    id: "0",
    type: PubShapeType.Text,
    x: 0.25,
    y: 0.25,
    r: 0,
    z: 0,
    editorState: EditorState.createWithContent(
      ContentState.createFromText("Double click to insert text")
    ),
    fill: "",
    fillOpacity: 1,
    stroke: "",
    strokeOpacity: 0,
    strokeWidth: 0,
    width: 2,
    height: 1,
  },
};
