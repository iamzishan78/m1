import React from "react";
import gql from "graphql-tag";

export const USERBYEMAIL = gql`
  query getUserByEmail($userEmail: String) {
    userByEmail(userEmail: $userEmail) {
      _id
      name
      email
    }
  }
`;
