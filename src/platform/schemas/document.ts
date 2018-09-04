import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

const shapeFields = {
  type: { type: GraphQLString },
  width: { type: GraphQLFloat },
  height: { type: GraphQLFloat },
  x: { type: GraphQLFloat },
  y: { type: GraphQLFloat },
  z: { type: GraphQLInt },
  r: { type: GraphQLFloat },
  fill: { type: GraphQLString },
  fillOpacity: { type: GraphQLFloat },
  stroke: { type: GraphQLString },
  strokeWidth: { type: GraphQLFloat },
  strokeOpacity: { type: GraphQLFloat },
  text: { type: GraphQLString },
};

const pageFields = {
  id: { type: GraphQLID },
  width: { type: GraphQLFloat },
  height: { type: GraphQLFloat },
  pageNumber: { type: GraphQLInt },
};

const documentFields = {
  id: { type: GraphQLID },
  name: { type: GraphQLString },
};

const ShapeType = new GraphQLObjectType({
  name: "Shape",
  fields: {
    id: { type: GraphQLID },
    ...shapeFields,
  },
});

const ShapeInputType = new GraphQLInputObjectType({
  name: "ShapeInput",
  fields: {
    ...shapeFields,
  },
});

const PageType = new GraphQLObjectType({
  name: "Page",
  fields: {
    shapes: { type: new GraphQLList(ShapeType) },
    ...pageFields,
  },
});

const PageInputType = new GraphQLInputObjectType({
  name: "PageInput",
  fields: {
    ...pageFields,
    shapes: { type: new GraphQLList(ShapeInputType) },
  },
});

export const DocumentType = new GraphQLObjectType({
  name: "Document",
  fields: {
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    pages: { type: new GraphQLList(PageType) },
    ...documentFields,
  },
});

export const DocumentInputType = new GraphQLInputObjectType({
  name: "DocumentInput",
  fields: {
    ...documentFields,
    pages: { type: new GraphQLList(PageInputType) },
  },
});
