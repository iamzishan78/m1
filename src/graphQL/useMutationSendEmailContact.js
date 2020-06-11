import React from "react";
import gql from "graphql-tag";

export const SENDEMAILCONTACT = gql`
  mutation SendEmail($email: SendEmailContactInput) {
    sendEmailContact(email: $email) {
      success
      message
    }
  }
`;
