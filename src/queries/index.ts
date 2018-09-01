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
      id
      name
      width
      height
      shapes {
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
