import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import { DocumentType, DocumentInputType } from "./document";
import { UserType } from "./user";
import {
  loginResolver,
  createUserResolver,
  currentUserResolver,
} from "../resolvers/user";
import {
  getDocumentsResolver,
  getDocumentResolver,
  saveDocumentResolver,
  deleteDocumentResolver,
} from "../resolvers/document";
import { any } from "bluebird";

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    documents: {
      type: new GraphQLList(DocumentType),
      resolve: getDocumentsResolver,
    },

    document: {
      type: DocumentType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: getDocumentResolver,
    },

    currentUser: {
      type: UserType,
      resolve: currentUserResolver,
    },
  },
});

const MutationType = new GraphQLObjectType<{}, {}>({
  name: "Mutation",
  fields: {
    login: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: loginResolver,
    },

    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: createUserResolver,
    },

    saveDocument: {
      type: DocumentType,
      args: {
        document: { type: DocumentInputType },
      },
      resolve: saveDocumentResolver,
    },

    deleteDocument: {
      type: DocumentType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: deleteDocumentResolver,
    },
  },
});

const AppSchema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default AppSchema;
