import { gql } from "@apollo/client";

export const GET_USER_DETAILS = gql`
  query getUserDetails($where: users_users_bool_exp!) {
    users: users_users(where: $where) {
      email
      id
      password
      name
    }
  }
`;

export const GET_AUTH_PROVIDER_DETAILS = gql`
  query GET_AUTH_PROVIDER_DETAILS($where: users_authProvider_bool_exp!) {
    users_authProvider(where: $where) {
      id
      provider
      providerAccountId
      providerType
      userId
      user {
        id
        name
        email
      }
    }
  }
`;
