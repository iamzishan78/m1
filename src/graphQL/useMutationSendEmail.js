import React from "react";
import gql from "graphql-tag";

export const SENDEMAIL = gql`
  mutation SendEmail($email: SendEmailInput) {
    sendEmail(email: $email) {
      success
      message
    }
  }
`;
