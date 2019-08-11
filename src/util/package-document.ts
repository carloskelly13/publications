import produce from "immer";
import pick from "lodash/fp/pick";
import get from "lodash/fp/get";
import { convertObjStylesToHTML, omitTransientData } from "./documents";
import { PubDocument } from "../types/pub-objects";

interface PubDocumentOrmMetadata {
  __typename?: string;
  createdAt?: string;
  updatedAt?: string;
}

type DraftPubDocument = Partial<PubDocument & PubDocumentOrmMetadata>;

export function packageDocument(input: PubDocument): PubDocument {
  return produce(input, (draftDocument: DraftPubDocument) => {
    draftDocument.pages[0] = {
      ...pick(["id", "width", "height", "pageNumber"], draftDocument.pages[0]),
      shapes: input.pages[0].shapes.map(shape =>
        omitTransientData(convertObjStylesToHTML(shape))
      ),
    };
    draftDocument.id = get("id")(input);
    delete draftDocument.__typename;
    delete draftDocument.createdAt;
    delete draftDocument.updatedAt;
  });
}
