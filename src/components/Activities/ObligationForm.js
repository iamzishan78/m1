import React, { useContext, useState, useEffect, useRef } from 'react';

import { FormControl, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import PropTypes from 'prop-types';

import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import DescriptionField from 'components/Shared/Slideout/FieldComponents/DescriptionField';
import OwnerField from 'components/Shared/Slideout/FieldComponents/OwnerField';
import SingleSelectField from 'components/Shared/Slideout/FieldComponents/singleSelectField';

import { DELETEACTIVITY, UPDATEACTIVITY } from 'graphQL/useMutationActivity';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { formStateController } from 'stateManagement/formStateController';
import { globalStateController } from 'stateManagement/globalStateController';
import { slidoutStateController } from 'stateManagement/slidoutStateController';
import { tableGlobalController } from 'stateManagement/tableController';

import { AppContext } from 'AppContext';

const commonTextFieldProps = {
	fieldConfig: {
		margin: 'dense',
		variant: 'outlined',
		size: 'small',
		disabled: true,
	},
	fieldAttributes: {
		titleComponent: 'div',
		layout: 'horizontal',
	},
	sx: {
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
	},
};

const useStyles = makeStyles(() => ({
	fieldGridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
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

	const { title, formMode, selectedActivity } = slidoutStateController.useState([
		'title',
		'formMode',
		'selectedActivity',
	]);
	const activityName = title;
	const {
		activityType,
		startDate,
		endDate,
		frequency,
		applicable,
		obligationValue,
		responsibleParty,
		owner,
		status,
		notes,
	} = formStateController.useState([
		'activityType',
		'startDate',
		'endDate',
		'frequency',
		'applicable',
		'obligationValue',
		'responsibleParty',
		'owner',
		'status',
		'notes',
	]);

	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'cache-and-network',
	});

	const clearFields = () => {
		formStateController.updateState({
			notes: '',
			activityType: '',
			status: false,
			startDate: getCurrentDate(),
			endDate: getCurrentDate(),
			applicable: '',
		});

		slidoutStateController.updateTitle('');
	};

	const onModalClose = () => {
		window.history.pushState('', '', '/calendar/obligations');

		clearFields();
		setSelectedActivityId(null);
		slidoutStateController.updateState({ selectedActivity: null });
		slidoutStateController.hideSlideout();
	};

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
		refetchQueries: ['getAllActivities', 'getDbData'],
		awaitRefetchQueries: true,
	});

	const [deleteActivityMutation] = useMutation(DELETEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			globalStateController.updateState({ universalLoader: false });
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getDbData'],
		awaitRefetchQueries: true,
	});

	const statusOptions = [
		{ value: 'notYetReviewed', label: 'Not Yet Reviewed' },
		{ value: 'inProgress', label: 'In Progress' },
		{ value: 'reviewCompleted', label: 'Review Completed' },
	];

	const deleteActivity = async () => {
		globalStateController.updateState({ universalLoader: true });
		await deleteActivityMutation({
			variables: {
				id: selectedActivity._id,
			},
		});
	};

	const updateActivity = async () => {
		globalStateController.updateState({ universalLoader: true });

		updateActivityMutation({
			variables: {
				activity: {
					_id: selectedActivity?._id,
					...(status ? { status: status } : {}),
					notes: notes,
					user: stateApp.user._id,
				},
			},
		}).then(() => {
			globalStateController.updateState({ universalLoader: false });
		});
	};

	useEffect(() => {
		const activity = selectedActivity;
		if (activity) {
			formStateController.updateState({
				activityType: activity.type,
				frequency: activity.frequency,
				applicable: activity.applicable,
				obligationValue: activity.value,
				responsibleParty: activity.responsibleParty,
				assignedOwner: activity.assignedOwner,
				status: activity.status,
				notes: activity.notes,
				owner: {
					name: activity?.ownerName,
					id: activity?.ownerId,
				},
				startDate: moment.parseZone(activity.start).format('YYYY-MM-DD'),
				endDate: moment.parseZone(activity.end).format('YYYY-MM-DD'),
			});

			slidoutStateController.updateTitle(activity.name);
			if (!activityName) {
				slidoutStateController.updateTitle(activity.name);
			}

			outcomeFieldRef.current?.updateDefaultValue(activity.outcome);
			slidoutStateController.updateParent('Obligation');
		}
	}, []);

	useEffect(() => {
		if (formMode) {
			if (formMode === 'update') {
				updateActivity();
			} else if (formMode === 'delete') {
				deleteActivity();
			}
			slidoutStateController.updateState({ formMode: '' });
			slidoutStateController.hideSlideout();
		}
	}, [formMode]);

	return (
		<div>
			<div className={classes.inputFieldRoot}>
				<CustomTextField
					{...commonTextFieldProps}
					fieldAttributes={{
						...commonTextFieldProps.fieldAttributes,
						value: activityType,
						title: 'Obligation Type',
					}}
				/>

				<FormControl variant="outlined" fullWidth size="small">
					<Grid container className={classes.gridStyle}>
						<CustomDatePicker
							{...commonTextFieldProps}
							fieldAttributes={{
								...commonTextFieldProps.fieldAttributes,
								name: 'startDate',
								title: 'Start Date',
								value: startDate,
							}}
						/>
						<CustomDatePicker
							{...commonTextFieldProps}
							fieldAttributes={{
								...commonTextFieldProps.fieldAttributes,
								name: 'endDate',
								title: 'End Date',
								value: endDate,
							}}
						/>
					</Grid>
				</FormControl>

				<CustomTextField
					{...commonTextFieldProps}
					fieldAttributes={{
						...commonTextFieldProps.fieldAttributes,
						value: frequency,
						title: 'Frequecy',
					}}
				/>
				{activityType !== 'Payment' && (
					<CustomTextField
						{...commonTextFieldProps}
						fieldAttributes={{
							...commonTextFieldProps.fieldAttributes,
							value: applicable === true ? 'Yes' : 'No',
							title: 'Applicable',
						}}
					/>
				)}
				<CustomTextField
					{...commonTextFieldProps}
					fieldAttributes={{
						...commonTextFieldProps.fieldAttributes,
						value: obligationValue,
						title: 'Value',
					}}
				/>
				<CustomTextField
					{...commonTextFieldProps}
					fieldAttributes={{
						...commonTextFieldProps.fieldAttributes,
						value: responsibleParty,
						title: 'Responsible Party',
					}}
				/>

				<OwnerField
					disabled={true}
					title="Assigned To"
					users={users}
					setOwnerId={value => {
						const foundText = users.find(item => item.value === value)?.text || '';
						formStateController.updateState({ owner: { id: value, name: foundText } });
					}}
					ownerId={owner?.id}
				/>

				<SingleSelectField
					title="Status"
					value={status}
					options={statusOptions}
					onChange={value => formStateController.updateState({ status: value })}
				/>

				<DescriptionField
					description={notes}
					setDescription={value => formStateController.updateState({ notes: value })}
				/>
			</div>
		</div>
	);
}

ObligationForm.propTypes = {
	setSelectedActivityId: PropTypes.func.isRequired,
};
