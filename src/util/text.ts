import { ItalicIcon, BoldIcon, UnderlineIcon } from "../components/ui/icons";
import { PubShape } from "../types/pub-objects";

export const INLINE_STYLES = [
  { label: "Bold", style: "BOLD", icon: BoldIcon },
  { label: "Italic", style: "ITALIC", icon: ItalicIcon },
  { label: "Underline", style: "UNDERLINE", icon: UnderlineIcon },
];

export const getSelectedText = (shape: PubShape) => {
  if (!shape || !shape.editorState) {
    return "";
  }
  const { editorState } = shape;
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  return currentContentBlock.getText().slice(start, end);
};

export const colorFromStyles = styles =>
  styles.toJS().reduce((memo, style) => {
    if (style.includes("PUB_COLOR_")) {
      return style.substr(10);
    }
    return memo;
  }, "#000000");

export const sizeFromStyles = styles =>
  styles.toJS().reduce((memo, style) => {
    if (style.includes("PUB_FONT_SIZE_")) {
      return style.slice(14, style.length - 2);
    }
    return memo;
  }, "14");
