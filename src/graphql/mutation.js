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

export const CREATE_WORK = gql`
  mutation CREATE_WORK($object: workspace_works_insert_input!) {
    createdWork: insert_workspace_works_one(object: $object) {
      id
      label
      files {
        content
        id
        type
      }
    }
  }
`;

export const UPDATE_WORK_FILE = gql`
  mutation UPDATE_WORK_FILE(
    $where: workspace_files_bool_exp!
    $_set: workspace_files_set_input!
  ) {
    update_workspace_files(where: $where, _set: $_set) {
      returning {
        content
        id
        type
        cdnUrl
      }
    }
  }
`;
