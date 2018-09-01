export const documentFields = `
  id
  name
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

export const saveDocumentMutation = `#graphql
  mutation($document: DocumentInput!) {
    saveDocument(document: $document) {
      ${documentFields}
    }
  }
`;
