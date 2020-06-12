import React from "react";
import gql from "graphql-tag";

export const SENDEMAILBUG = gql`
  mutation SendEmail($email: SendEmailBugInput) {
    sendEmailBug(email: $email) {
      success
      message
    }
  }
`;
