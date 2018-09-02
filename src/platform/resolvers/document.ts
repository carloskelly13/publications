import { Context } from "../../types/server";
import db from "../database/";

export const getDocumentResolver = async function(_, { id }, context: Context) {
  if (!context.user) {
    return null;
  }
  const [document] = await db.getDocument({ id, userId: context.user.id });
  return document;
};

export const getDocumentsResolver = async function(_, __, context: Context) {
  if (!context.user) {
    return [];
  }
  return await db.getDocuments(context.user.id);
};

export const saveDocumentResolver = async function(
  _,
  { document },
  context: Context
) {
  if (!context.user) {
    throw new Error("Unauthenticated");
  }
  return await db.saveDocument(document, context.user.id);
};

export const deleteDocumentResolver = async function(
  _,
  { id },
  context: Context
) {
  if (!context.user) {
    return null;
  }
  return await db.deleteDocument({ id, userId: context.user.id });
};
