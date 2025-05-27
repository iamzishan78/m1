import React, { useContext, useState, useEffect, useMemo } from 'react';

import Badge from '@material-ui/core/Badge';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import IdentityIcon from '@material-ui/icons/PermIdentity';

import { useLazyQuery, useMutation } from '@apollo/client';
import { useHookstate } from '@hookstate/core';

import Slideout from 'components/Shared/Slideout';

import { REMOVECOMMONDESCRIPTOR } from 'graphQL/useMutationRemoveCommonDescriptor';
import { UPSERTCOMMONDESCRIPTOR } from 'graphQL/useMutationUpsertCommonDescriptor';

import { slidoutState } from 'stateManagement/initialStates';

import ActivityForm from './ActivityForm';
import { AppContext } from '../../../AppContext';
import { GETMONGOUSERS } from '../../../graphQL/useQueryGetUsers';
import ObligationForm from '../ObligationForm';

export default function ActivitiesSlideout({ activityId, setSelectedActivityId, getContactsForActivity, type = '' }) {
	const [stateApp] = useContext(AppContext);

	const [users, setUsers] = useState([]);
	const { selectedActivity } = stateApp;

	const show = useHookstate(slidoutState.show).get({ noproxy: true });
	const view = useHookstate(slidoutState.view).get({ noproxy: true });

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});
	const [upsertCommonDescriptor] = useMutation(UPSERTCOMMONDESCRIPTOR, {
		onCompleted: () => {
			slidoutState.loader.set(false);
		},
	});
	const [removeCommonDescriptor] = useMutation(REMOVECOMMONDESCRIPTOR, {
		onCompleted: () => {
			slidoutState.loader.set(false);
		},
	});

	const views = useMemo(
		() => [
			{
				name: 'Home',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
					>
						<HomeIcon {...props} />
					</Badge>
				),
				Component: () =>
					type === 'obligations' ? (
						<ObligationForm setSelectedActivityId={setSelectedActivityId} />
					) : (
						<ActivityForm setSelectedActivityId={setSelectedActivityId} />
					),
				props: {},
				onClick: () => {},
			},
		],
		[selectedActivity, activityId, stateApp.user.mongoId, stateApp?.activityContacts?.contacts?.length]
	);

	useEffect(() => {
		slidoutState.parentId.set(activityId);
		slidoutState.views.set(views);
		slidoutState.view.set(views.find(v => v.name === view?.name) || views[0]);
	}, [views, view, show]);
	useEffect(() => {
		slidoutState.parentId.set(activityId);
		slidoutState.views.set(views);
		slidoutState.view.set(views[0]);
	}, [activityId]);

	useEffect(() => {
		getAllMongoUsers();
	}, []);

	useEffect(() => {
		if (userLists && userLists.allMongoUsers) {
			setUsers(
				userLists.allMongoUsers.map(user => ({
					value: user._id,
					text: user.name,
				}))
			);
		}
	}, [userLists]);

	return <Slideout show={show} />;
}
