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

const documentFields = {
  id: { type: GraphQLID },
  name: { type: GraphQLString },
  width: { type: GraphQLFloat },
  height: { type: GraphQLFloat },
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

export const DocumentType = new GraphQLObjectType({
  name: "Document",
  fields: {
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    shapes: { type: new GraphQLList(ShapeType) },
    ...documentFields,
  },
});

export const DocumentInputType = new GraphQLInputObjectType({
  name: "DocumentInput",
  fields: {
    ...documentFields,
    shapes: { type: new GraphQLList(ShapeInputType) },
  },
});
