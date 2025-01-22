/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';

import ActivitiesSlideout from 'components/Activities/components/ActivitiesSlideout';

import { GET_CONTACTS_FOR_ACTIVITY } from 'graphQL/useQueryGetContactsForActivity';

import { slidoutStateController } from 'hookstate/slidoutStateController';

import { AppContext } from 'AppContext';

function ActivitiesToolbar() {
	const { selectedActivityId } = slidoutStateController.useState(['selectedActivityId']);
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
				setSelectedActivityId={id => slidoutStateController.updateState({ selectedActivityId: id })}
				getContactsForActivity={getContactsForActivity}
			/>
		</>
	);
}

export default memo(ActivitiesToolbar);
