import gql from "graphql-tag";

export const UPLOADRECIPIENTS = gql`
  mutation UploadStorefrontRecipientsList(
    $campaign: String,
    $email: String,
    $recipients: [ID]
  ) {
    uploadStorefrontRecipientsList(
      campaign: $campaign,
      email: $email,
      recipients: $recipients
    )
  }
`;
