/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect } from 'react';
import ActivitiesSlideout from 'components/Activities/components/ActivitiesSlideout';
import { useHookstate } from '@hookstate/core';
import { slidoutState } from 'hookstate/initialStates';
import { GET_CONTACTS_FOR_ACTIVITY } from 'graphQL/useQueryGetContactsForActivity';
import { useLazyQuery } from '@apollo/client';
import { AppContext } from 'AppContext';

function ActivitiesToolbar() {
	const selectedActivityId = useHookstate(slidoutState.selectedActivityId).get({ noproxy: true });
	const [, setStateApp] = useContext(AppContext);

	const [getContactsForActivity, { data: getContactsForActivityResult }] = useLazyQuery(GET_CONTACTS_FOR_ACTIVITY, {
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		const contacts = getContactsForActivityResult?.getContactsForActivity?.contacts;
		setStateApp(stateApp => ({
			...stateApp,
			activityContacts: { contacts },
		}));
	}, [getContactsForActivityResult]);

	useEffect(() => {
		getContactsForActivity({
			variables: { activityId: selectedActivityId },
		});
	}, [selectedActivityId]);

	return (
		<>
			<ActivitiesSlideout
				activityId={selectedActivityId}
				setSelectedActivityId={slidoutState.selectedActivityId.set}
				getContactsForActivity={getContactsForActivity}
			/>
		</>
	);
}

export default memo(ActivitiesToolbar);
