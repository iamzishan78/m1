import gql from 'graphql-tag';

export const ARCHIVE_ALL_MUTATIONS = gql`
	mutation archiveAllMentions {
		archiveAllMentions {
			success
			message
			error
		}
	}
`;
