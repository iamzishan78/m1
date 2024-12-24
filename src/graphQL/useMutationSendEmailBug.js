import gql from 'graphql-tag';
import React from 'react';

export const SENDEMAILBUG = gql`
	mutation SendEmail($email: SendEmailBugInput) {
		sendEmailBug(email: $email) {
			success
			message
		}
	}
`;
