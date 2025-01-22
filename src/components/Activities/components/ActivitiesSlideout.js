import React, { useContext, useState, useEffect, useMemo } from 'react';

import Badge from '@material-ui/core/Badge';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import IdentityIcon from '@material-ui/icons/PermIdentity';

import { useLazyQuery, useMutation } from '@apollo/client';

import Slideout from 'components/Shared/Slideout';

import { REMOVECOMMONDESCRIPTOR } from 'graphQL/useMutationRemoveCommonDescriptor';
import { UPSERTCOMMONDESCRIPTOR } from 'graphQL/useMutationUpsertCommonDescriptor';

import { slidoutStateController } from 'hookstate/slidoutStateController';

import ActivityForm from './ActivityForm';
import { AppContext } from '../../../AppContext';
import { GETMONGOUSERS } from '../../../graphQL/useQueryGetUsers';
import ObligationForm from '../ObligationForm';

export default function ActivitiesSlideout({ activityId, setSelectedActivityId, getContactsForActivity, type = '' }) {
	const [stateApp] = useContext(AppContext);

	const [users, setUsers] = useState([]);
	const { selectedActivity } = stateApp;

	const { view, show } = slidoutStateController.useState(['show', 'view'])

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});
	const [upsertCommonDescriptor] = useMutation(UPSERTCOMMONDESCRIPTOR, {
		onCompleted: () => {
			slidoutStateController.updateState({ loader: false })
		},
	});
	const [removeCommonDescriptor] = useMutation(REMOVECOMMONDESCRIPTOR, {
		onCompleted: () => {
			slidoutStateController.updateState({ loader: false })
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
				onClick: () => { },
			},
			{
				name: 'Contacts',
				type: 'contact',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={stateApp?.activityContacts?.contacts?.length}
					>
						<IdentityIcon {...props} />
					</Badge>
				),
				props: {
					consts: {
						loading: false,
						stateAppKey: 'activityContacts',
					},
					functions: {
						gotoContact: () => { },
						getRemoveDescriptorResponse: async descriptorId => {
							slidoutStateController.updateState({ loader: true })
							let result = await removeCommonDescriptor({
								variables: { id: descriptorId, relatedObjectType: 'Contact' },
								refetchQueries: ['getContactsForActivity'],
								awaitRefetchQueries: true,
							});

							let response = await result.data.removeCommonDescriptor.success;

							return response;
						},

						addSelectedContact: contact => {
							slidoutStateController.updateState({ loader: true })
							upsertCommonDescriptor({
								variables: {
									descriptorId: activityId,
									relatedObject: contact._id,
									relatedObjectType: 'Contact',
									descriptorType: 'Activity',
									userId: stateApp.user.mongoId,
								},
								refetchQueries: ['getContactsForActivity'],
								awaitRefetchQueries: true,
							}).then(result => { });
						},
						refetchData: () => {
							getContactsForActivity({ activityId });
						},
					},
				},
				onClick: () => { },
			},
		],
		[selectedActivity, activityId, stateApp.user.mongoId, stateApp?.activityContacts?.contacts?.length]
	);

	useEffect(() => {
		slidoutStateController.updateState({ parentId: activityId, views, view: views.find(v => v.name === view?.name) || views[0] })
	}, [views, view, show]);
	useEffect(() => {
		slidoutStateController.updateState({ parentId: activityId, views, view: views[0] })
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
