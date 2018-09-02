import { UserModel, DocumentModel } from "./models";
import { transaction } from "objection";
// import changeCase from "change-object-case";

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
    .eager("shapes")
    .where("user_id", userId)
    .where("id", id);
};

const deleteDocument = function({ userId, id }) {
  return DocumentModel.query()
    .eager("shapes")
    .delete()
    .where("user_id", userId)
    .where("id", id);
};

const getDocuments = function(userId) {
  return DocumentModel.query()
    .eager("shapes")
    .where("user_id", userId);
};

const saveDocument = function(document, userId) {
  return transaction(DocumentModel.knex(), trx =>
    DocumentModel.query(trx).upsertGraphAndFetch({ ...document, userId })
  );
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
