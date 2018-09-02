import db from "../database";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Context } from "../../types/server";

export const loginResolver = async function(_, { name, password }) {
  const user = await db.getUser(name);
  if (!user) {
    throw new Error("Invalid user name or password.");
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);
  if (!isPasswordValid) {
    throw new Error("Invalid user name or password.");
  }
  const token = jsonwebtoken.sign(
    {
      id: user.id,
      name: user.name,
    },
    "carlos-secret-pls-change",
    { expiresIn: "1y" }
  );
  return { id: user.id, name: user.name, token };
};

export const currentUserResolver = function(_, __, context: Context) {
  if (!context.user) {
    return null;
  }
  return context.user;
};

export const createUserResolver = async function(_, { name, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.createUser(name, passwordHash);
  const token = jsonwebtoken.sign(
    {
      id: user.id,
      name: user.name,
    },
    "carlos-secret-pls-change",
    { expiresIn: "1y" }
  );
  return { id: user.id, name: user.name, token };
};
