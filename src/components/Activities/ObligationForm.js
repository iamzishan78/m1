/* eslint-disable react-hooks/exhaustive-deps */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useHookstate } from '@hookstate/core';
import { FormControl, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import React, { useContext, useState, useEffect, useRef } from 'react';

import DateField from 'components/Shared/Slideout/FieldComponents/DateField';
import DescriptionField from 'components/Shared/Slideout/FieldComponents/DescriptionField';
import OwnerField from 'components/Shared/Slideout/FieldComponents/OwnerField';
import SimpleTextField from 'components/Shared/Slideout/FieldComponents/SimpleTextfield';
import SingleSelectField from 'components/Shared/Slideout/FieldComponents/singleSelectField';

import { DELETEACTIVITY, UPDATEACTIVITY } from 'graphQL/useMutationActivity';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { slidoutState } from 'hookstate/initialStates';
import { globalState } from 'hookstate/initialStates';
import { slidoutStateController } from 'hookstate/slidoutStateController';
import { tableGlobalController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

import { obligationFormState } from './obligationFormStateController';

const useStyles = makeStyles(theme => ({
	dialogExpCard: {
		'& .MuiDialog-paperScrollPaper': {
			height: '100%',
		},
		'& *': {
			margin: 0,
		},
	},
	addAct: {
		width: '100%',
		backgroundColor: '#fff',
		minHeight: '100%',
		display: 'flex',
	},
	inputFieldRoot: {
		padding: '15px 25px 0px',
	},
	left: {
		width: '50%',
		borderRight: '2px solid #d9d9d9',
		padding: '20px 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flexstart',
		justifyContent: 'flexstart',
	},
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	row: {
		display: 'flex',
		alignItems: 'flexstart',
		justifyContent: 'flexstart',
		marginBottom: 16,
	},
	rowIcon: {
		minWidth: 120,
		color: '#B9C5D1',
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingTop: 16,
	},
	typeDisplay: {
		border: '1px solid #d9d9d9',
		borderRadius: 3,
		display: 'flex',
		alignItems: 'center',
	},
	filterDisplay: {
		color: '#999',
		backgroundColor: '#f9f9f9',
		display: 'flex',
		alignItems: 'center',
		padding: '0px 8px',
		border: '1px solid #fff',
		borderRadius: 3,
		cursor: 'pointer',
		userSelect: 'none',
		height: 40,
		fontSize: 14,

		'& .MuiSvgIcon-root': {
			fontSize: 16,
		},

		'& span': {
			marginLeft: 8,
		},
	},
	dateTimeRow: {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	dateTimeField: {
		height: 41,
		width: 172,
		marginBottom: 8,

		'& .MuiInputBase-root': {
			height: '100%',
		},
	},
	marginLeft: {
		marginLeft: 6,
	},
	marginBottom: {
		marginBottom: 20,
	},
	line: {
		height: 2,
		width: 16,
		margin: '0 8px',
		backgroundColor: '#B9C5D1',
	},
	notes: {
		backgroundColor: '#FFFCDC',
		display: 'block',
		width: '100%',

		'& .MuiOutlinedInput-root': {
			width: '100%',
		},
	},
	fieldWidth: {
		width: '100%',
		maxWidth: 400,
	},
	inputField: {
		height: 41,

		'& .MuiOutlinedInput-root': {
			height: 41,
		},
	},
	btnGroup: {
		width: 400,
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	active: {
		backgroundColor: '#D0F1FC',
		color: '#259AED !important',
	},
	right: {
		width: '40%',
	},
	error: {
		border: '2px solid red !important',
	},
}));

const getCurrentDate = () => {
	const d = new Date().toISOString();
	return d.slice(0, d.indexOf('T'));
};

export default function ObligationForm({ setSelectedActivityId }) {
	const outcomeFieldRef = useRef();
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const [users, setUsers] = useState([]);
	const { selectedActivity } = slidoutState;

	const activityName = useHookstate(slidoutState.title).get({ noproxy: true });
	const formMode = useHookstate(slidoutState.formMode);
	const {
		activityType,
		startDate,
		endDate,
		frequency,
		applicable,
		obligationValue,
		responsibleParty,
		owner,
		assignedOwner,
		status,
		notes,
	} = useHookstate(obligationFormState);

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});

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

	const [updateActivityMutation] = useMutation(UPDATEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const [deleteActivityMutation] = useMutation(DELETEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			globalState.universalLoader.set(false);
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const statusOptions = [
		{ value: 'notYetReviewed', label: 'Not Yet Reviewed' },
		{ value: 'inProgress', label: 'In Progress' },
		{ value: 'reviewCompleted', label: 'Review Completed' },
	];

	const deleteActivity = async () => {
		globalState.universalLoader.set(true);
		await deleteActivityMutation({
			variables: {
				id: selectedActivity.get()._id,
			},
		});
	};

	useEffect(() => {
		const activity = selectedActivity.get();
		if (activity) {
			activityType.set(activity.type);
			frequency.set(activity.frequency);
			applicable.set(activity.applicable);
			obligationValue.set(activity.value);
			responsibleParty.set(activity.responsibleParty);
			assignedOwner.set(activity.assignedOwner);
			status.set(activity.status);
			notes.set(activity.notes);

			owner.set({
				name: activity?.ownerName,
				id: activity?.ownerId,
			});

			slidoutStateController.updateTitle(activity.name);
			if (!activityName) {
				slidoutStateController.updateTitle(activity.name);
			}

			outcomeFieldRef.current?.updateDefaultValue(activity.outcome);
			endDate.set(moment.parseZone(activity.end).format('yyyy-MM-DD'));
			startDate.set(moment.parseZone(activity.start).format('yyyy-MM-DD'));
			slidoutStateController.updateParent('Obligation');
		}
	}, []);

	useEffect(() => {
		if (formMode.get()) {
			if (formMode.get() === 'update') {
				updateActivity();
			} else if (formMode.get() === 'delete') {
				deleteActivity();
			}

			formMode.set('');
			slidoutStateController.hideSlideout();
		}
	}, [formMode.get()]);

	const onModalClose = () => {
		window.history.pushState('', '', '/calendar/obligations');

		clearFields();
		setSelectedActivityId(null);
		slidoutState.selectedActivity.set(null);
		slidoutStateController.hideSlideout();
	};

	const clearFields = () => {
		notes.set('');

		activityType.set('');
		slidoutStateController.updateTitle('');
		status.set(false);
		startDate.set(getCurrentDate());
		endDate.set(getCurrentDate());
		applicable.set('');
	};

	const updateActivity = async () => {
		globalState.universalLoader.set(true);

		updateActivityMutation({
			variables: {
				activity: {
					_id: selectedActivity.get()?._id,
					...(status.get() ? { status: status.get() } : {}),
					notes: notes.get(),
					user: stateApp.user._id,
				},
			},
		}).then(result => {
			globalState.universalLoader.set(false);
		});
	};

	return (
		<div>
			<div className={classes.inputFieldRoot}>
				<SimpleTextField disabled title="Obligation Type" value={activityType.get()} setValue={() => {}} />

				<FormControl variant="outlined" fullWidth size="small">
					<Grid container className={classes.gridStyle}>
						<DateField disabled={true} title="Start Date" date={startDate.get()} setDate={() => {}} />
						<DateField disabled={true} title="End Date" date={endDate.get()} setDate={() => {}} />
					</Grid>
				</FormControl>

				<SimpleTextField disabled title="Frequecy" value={frequency.get()} setValue={() => {}} />
				{activityType.get() !== 'Payment' && (
					<SimpleTextField disabled title="Applicable" value={applicable.get()} setValue={() => {}} />
				)}
				<SimpleTextField disabled title="Value" value={obligationValue.get()} setValue={() => {}} />
				<SimpleTextField disabled title="Responsible Party" value={responsibleParty.get()} setValue={() => {}} />

				<OwnerField
					disabled={true}
					title="Assigned To"
					users={users}
					setOwnerId={value => {
						const foundText = users.find(item => item.value === value)?.text || '';
						owner.set({ id: value, name: foundText });
					}}
					ownerId={owner.get()?.id}
				/>

				<SingleSelectField
					title="Status"
					value={status.get()}
					options={statusOptions}
					onChange={value => status.set(value)}
				/>

				<DescriptionField description={notes.get()} setDescription={value => notes.set(value)} />
			</div>
		</div>
	);
}
