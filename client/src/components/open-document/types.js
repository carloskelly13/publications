// @flow
import type { PubDocument } from "../../util/types";

export type OpenDocProps = {
  documents: PubDocument[],
  onDismiss: () => void,
  replaceRoute: string => void,
  getDocuments: () => Promise<void>,
};
export type OpenDocState = {
  selectedId: string,
};
