import gql from 'graphql-tag';
import React from 'react';

export const SENDEMAILCONTACT = gql`
	mutation SendEmail($email: SendEmailContactInput) {
		sendEmailContact(email: $email) {
			success
			message
		}
	}
`;
