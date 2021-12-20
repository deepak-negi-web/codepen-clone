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
