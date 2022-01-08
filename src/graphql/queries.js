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

export const GET_WORK_DETAILS = gql`
  query GET_WORK_DETAILS($id: uuid!) {
    workDetails: workspace_works_by_pk(id: $id) {
      id
      label
      isPublished
      files {
        cdnUrl
        content
        id
        type
      }
    }
  }
`;
export const GET_WORKS = gql`
  query GET_WORKS {
    works: workspace_works {
      id
      label
      isPublished
      files {
        cdnUrl
        content
        id
        type
      }
    }
  }
`;
