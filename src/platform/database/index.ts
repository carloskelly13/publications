import { UserModel, DocumentModel, ShapeModel } from "./models";
import { transaction } from "objection";
import { PubPage } from "../../types/pub-objects";
import { PageModel } from "./models/page";

const createUser = async function(name, password) {
  const newUser = await UserModel.query().insert({
    user_name: name,
    password_hash: password,
  });
  return {
    name: newUser.user_name,
    id: newUser.id,
  };
};

const getUser = async function(name) {
  const [user] = await UserModel.query().where("user_name", name);
  if (!user) {
    return null;
  }
  return {
    name: user.user_name,
    id: user.id,
    passwordHash: user.password_hash,
  };
};

const getDocument = function({ userId, id }) {
  return DocumentModel.query()
    .eager("pages.shapes")
    .where("user_id", userId)
    .where("id", id);
};

const deleteDocument = async function(options) {
  return transaction<DocumentModel>(DocumentModel.knex(), async function(trx) {
    const [document] = await getDocument(options);
    if (!document) {
      throw new Error("Document to delete for user does not exist.");
    }
    await document.pages.forEach(
      async (page: PubPage) =>
        await ShapeModel.query(trx)
          .delete()
          .where("page_id", page.id)
    );
    await PageModel.query(trx)
      .delete()
      .where("document_id", document.id);
    await DocumentModel.query(trx).deleteById(document.id);
    return document;
  });
};

const getDocuments = function(userId) {
  return DocumentModel.query()
    .eager("pages.shapes")
    .where("user_id", userId);
};

const saveDocument = function(document, userId) {
  return transaction(DocumentModel.knex(), function(trx) {
    return DocumentModel.query(trx).upsertGraphAndFetch({
      ...document,
      userId,
    });
  });
};

const ops = {
  getUser,
  createUser,
  getDocument,
  getDocuments,
  saveDocument,
  deleteDocument,
};

export default ops;
