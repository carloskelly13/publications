export const documentFields = `
  id
  name
  pages {
    id
    pageNumber
    width
    height
    shapes {
      id
      type
      x
      y
      r
      z
      width
      height
      fill
      stroke
      fillOpacity
      strokeOpacity
      strokeWidth
      text
    }
  }
`;

export const currentUserQuery = `#graphql
  query {
    currentUser {
      id
      name
      token
    }
  }
`;

export const documentsQuery = `#graphql
  query {
    documents {
     ${documentFields}
    }
  }
`;

export const documentQuery = `#graphql
  query($id: ID!) {
    document(id: $id) {
     ${documentFields}
    }
  }
`;

export const loginMutation = `#graphql
  mutation($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      id
      name
      token
    }
  }
`;

export const createUserMutation = `#graphql
  mutation($name: String!, $password: String!) {
    createUser(name: $name, password: $password) {
      id
      name
      token
    }
  }
`;

export const saveDocumentMutation = `#graphql
  mutation($document: DocumentInput!) {
    saveDocument(document: $document) {
      ${documentFields}
    }
  }
`;

export const deleteDocumentMutation = `#graphql
  mutation($id: ID!) {
    deleteDocument(id: $id) {
      ${documentFields}
    }
  }
`;
