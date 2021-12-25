import { gql } from "@apollo/client";

export const CREATE_AUTH_PROVIDER_USER = gql`
  mutation CREATE_AUTH_PROVIDER_USER(
    $object: users_authProvider_insert_input!
  ) {
    insert_users_authProvider_one(object: $object) {
      id
      provider
    }
  }
`;

export const CREATE_USER = gql`
  mutation CREATE_USER($object: users_users_insert_input!) {
    createdUser: insert_users_users_one(object: $object) {
      id
      name
      email
    }
  }
`;
