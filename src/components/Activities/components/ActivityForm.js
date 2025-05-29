import React, { useContext, useState, useEffect, useRef } from 'react';

import { FormControl, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery, useMutation } from '@apollo/client';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { outcomeOptions } from 'components/ContactDetailCard/components/FieldContent/helper';
import AutocompEntityNamesVirtualizeList from 'components/MRTTable/Common/Components/AutocompEntityNamesVirtualizeList';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import DescriptionField from 'components/Shared/Slideout/FieldComponents/DescriptionField';
import OwnerField from 'components/Shared/Slideout/FieldComponents/OwnerField';
import SearchableSelectField from 'components/Shared/Slideout/FieldComponents/searchableSelectField';
import SingleSelectField from 'components/Shared/Slideout/FieldComponents/singleSelectField';

import { formStateController } from 'stateManagement/formStateController';
import { globalStateController } from 'stateManagement/globalStateController';
import { slidoutStateController } from 'stateManagement/slidoutStateController';
import { tableGlobalController } from 'stateManagement/tableController';

import { AppContext } from '../../../AppContext';
import { ADDACTIVITY, DELETEACTIVITY, UPDATEACTIVITY } from '../../../graphQL/useMutationActivity';
import { ADDCONTACT } from '../../../graphQL/useMutationAddContact';
import { GETMONGOUSERS } from '../../../graphQL/useQueryGetUsers';
import { OPENDEALS } from '../../../graphQL/useQueryOpenDeals';
import { PAGINATEDCONTACTSQUERY } from '../../../graphQL/useQueryPaginatedContacts';
import { setStateIfDeepEqual } from '../../Shared/functions';

const useStyles = makeStyles(() => ({
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

const getCurrentDate = () => new Date().toISOString();

const activityStatusOptions = [
	{ label: 'Open', value: false },
	{ label: 'Complete', value: true },
];

export default function ActivityForm({ setSelectedActivityId }) {
	const outcomeFieldRef = useRef();
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const [users, setUsers] = useState([]);
	const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);
	const [nameAutInputValue, NameAutInputValue] = useState('');
	const setNameAutInputValue = newState => {
		setStateIfDeepEqual(NameAutInputValue, newState);
	};
	const [hasNextPage, setHasNextPage] = useState(true);
	const [isNextPageLoading, setIsNextPageLoading] = useState(false);

	const [openDeals, setOpenDeals] = useState([]);

	const { selectedActivity, title, formMode } = slidoutStateController.useState([
		'title',
		'formMode',
		'selectedActivity',
	]);
	const activityName = title;
	const { activityType, outcome, startDate, endDate, owner, dealId, status, notes } = formStateController.useState([
		'activityType',
		'outcome',
		'startDate',
		'endDate',
		'owner',
		'dealId',
		'status',
		'notes',
	]);
	const [nameAutValue, setNameAutValue] = useState({ name: '', _id: null });
	const [mongoEntitiesArray, setMongoEntitiesArray] = useState([]);

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

	const clearFields = () => {
		slidoutStateController.updateNewEntity(true);

		formStateController.updateState({
			notes: '',
			owner: {
				name: stateApp.user.fullname || stateApp.user.email,
				id: stateApp.user.mongoId,
			},
			dealId: null,
			activityType: '',
			outcome: '',
			status: false,
			startDate: getCurrentDate(),
			endDate: getCurrentDate(),
		});

		slidoutStateController.updateTitle('');
		setNameAutValue({ name: '', _id: null });
		setNameAutInputValue('');
	};

	const onModalClose = () => {
		if (window.location.pathname.startsWith('/calendar/activities')) {
			window.history.pushState('', '', '/calendar/activities');
		}

		clearFields();
		setSelectedActivityId(null);
		slidoutStateController.updateState({
			selectedActivity: null,
			newComments: [],
		});
		slidoutStateController.hideSlideout();
	};

	const [addActivityMutation] = useMutation(ADDACTIVITY, {
		onCompleted: () => {
			onModalClose();
			globalStateController.updateState({ universalLoader: false });
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getDbData', 'getContact'],
		awaitRefetchQueries: true,
	});

	const [updateActivityMutation] = useMutation(UPDATEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			globalStateController.updateState({ universalLoader: false });
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getDbData'],
		awaitRefetchQueries: true,
	});

	const [deleteActivityMutation] = useMutation(DELETEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			slidoutStateController.updateEntityLoading(false);
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getDbData', 'getContactSummary', 'getContact'],
		awaitRefetchQueries: true,
	});

	const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
		PAGINATEDCONTACTSQUERY,
		{
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
		}
	);

	const [getOpenDeals, { data: dealsData }] = useLazyQuery(OPENDEALS, {
		fetchPolicy: 'cache-and-network',
	});
	const dealValue = openDeals.find(deal => deal._id === dealId) || null;

	const typeOptions = [
		{ label: 'Call', value: 'call' },
		{ label: 'Meeting', value: 'meeting' },
		{ label: 'Task', value: 'task' },
		{ label: 'Deadline', value: 'deadline' },
		{ label: 'Email', value: 'email' },
		{ label: 'Text Message', value: 'text_message' },
		{ label: 'Mailer', value: 'mailer' },
	];

	useEffect(() => {
		//will also run during initial mount
		setIsNextPageLoading(true);
		getPaginatedContacts({
			variables: {
				search: nameAutInputValue,
			},
		});
	}, [nameAutInputValue]);

	useEffect(() => {
		if (get(addContactData, 'addContact.contact')) {
			setNameAutValue({ name: addContactData.addContact.contact.name, _id: addContactData.addContact.contact._id });
		}
	}, [addContactData]);

	const loadNextPage = async pageVariables => {
		setIsNextPageLoading(true);
		fetchMorePaginatedContacts(pageVariables);
		return null;
	};

	useEffect(() => {
		if (allContacts?.paginatedContacts) {
			setMongoEntitiesArray([...(allContacts?.paginatedContacts?.edges?.map(el => el.node) || [])]);
			setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
		}
		setIsNextPageLoading(false);
	}, [allContacts]);

	useEffect(() => {
		const activity = selectedActivity;

		if (activity) {
			slidoutStateController.updateNewEntity(false);
			slidoutStateController.updateParent('Activity');
			slidoutStateController.updateTitle(activity.name);
			if (!activityName) {
				slidoutStateController.updateTitle(activity.name);
			}
			formStateController.updateState({
				notes: activity.notes,
				owner: {
					name: activity?.ownerName,
					id: activity?.ownerId,
				},
				dealId: activity.dealId,
				activityType: activity.type,
				status: activity.isClosed,
				outcome: activity.outcome,
				startDate: activity.start,
				endDate: activity.end,
			});

			setNameAutValue({
				name: activity.contactName,
				_id: activity.contactId,
			});

			outcomeFieldRef.current?.updateDefaultValue(activity.outcome);
		} else {
			slidoutStateController.updateNewEntity(true);
			slidoutStateController.updateParent('Activity');
			slidoutStateController.updateTitle(activityName);

			formStateController.updateState({
				notes: notes || '',
				owner: {
					name: owner?.name || stateApp.user.fullname || stateApp.user.email,
					id: owner?.id || stateApp.user.mongoId,
				},
				dealId: dealId || null,
				activityType: activityType || '',
				status: status || false,
				startDate: startDate || getCurrentDate(),
				endDate: endDate || getCurrentDate(),
			});

			setNameAutValue({ name: activityName, _id: null });
		}
	}, []);

	useEffect(() => {
		if (stateApp.user && stateApp.user.mongoId) {
			getOpenDeals();
		}
	}, [stateApp.user]);

	useEffect(() => {
		if (dealsData) {
			setOpenDeals(dealsData?.openDeals?.deals);
		}
	}, [dealsData]);

	const addActivity = async () => {
		if (!activityName || activityName.trim().length === 0) {
			onModalClose();
			return;
		}
		globalStateController.updateState({ universalLoader: true });

		await addActivityMutation({
			variables: {
				activity: {
					type: activityType,
					name: activityName,
					notes: notes,
					outcome: outcome,
					ownerId: owner?.id,
					ownerName: owner?.name,
					contactId: nameAutValue._id,
					contactName: nameAutValue.name,
					dealId: dealId,
					dateTime: new Date(startDate).toUTCString(),
					endDateTime: new Date(endDate).toUTCString(),
					isClosed: status,
					user: stateApp.user._id,
					createdBy: stateApp?.user?._id,
					comments: slidoutStateController.getValue('newComments'),
				},
			},
		});
	};

	const updateActivity = async () => {
		globalStateController.updateState({ universalLoader: true });

		updateActivityMutation({
			variables: {
				activity: {
					_id: selectedActivity?._id,
					type: activityType,
					name: activityName,
					dateTime: new Date(startDate).toUTCString(),
					endDateTime: new Date(endDate).toUTCString(),
					notes: notes,
					outcome: outcome,
					ownerId: owner?.id,
					ownerName: owner?.name,
					contactId: nameAutValue?._id,
					contactName: nameAutValue?.name,
					dealId: dealId,
					isClosed: status,
					user: stateApp.user._id,
				},
			},
		});
	};

	const deleteActivity = async () => {
		slidoutStateController.updateEntityLoading(true);
		await deleteActivityMutation({
			variables: {
				id: selectedActivity._id,
			},
		});
	};

	useEffect(() => {
		if (formMode) {
			if (formMode === 'update') {
				if (!selectedActivity) {
					addActivity();
				} else {
					updateActivity();
				}
			} else if (formMode === 'delete') {
				deleteActivity();
			}
			slidoutStateController.updateState({ formMode: '' });
			slidoutStateController.hideSlideout();
		}
	}, [formMode]);

	return (
		<div className={classes.inputFieldRoot}>
			<CustomTextField
				fieldConfig={{
					margin: 'dense',
					variant: 'outlined',
					size: 'small',
				}}
				fieldAttributes={{
					value: activityName,
					title: 'Description',
					titleComponent: 'div',
					layout: 'horizontal',
				}}
			/>
			<SingleSelectField
				title="Type"
				value={activityType}
				options={typeOptions}
				onChange={value => formStateController.updateState({ activityType: value })}
			/>

			<FormControl variant="outlined" fullWidth size="small" style={{ marginTop: '10px' }}>
				<Grid container className={classes.gridStyle}>
					<Grid item xs={3}>
						<div>Outcome</div>
					</Grid>

					<Grid item xs={9}>
						<CustomAutoComplete
							ref={outcomeFieldRef}
							fieldAttributes={{
								value: outcome,
								optionArray: outcomeOptions,
								queryParams: {
									esIndex: 'activities_flat',
									filterKey: 'outcome.keyword',
									size: 50,
								},
							}}
							fieldConfig={{
								variant: 'outlined',
								size: 'small',
							}}
							fieldEvents={{
								onChange: ({ value }) => {
									formStateController.updateState({ outcome: value });
								},
							}}
						/>
					</Grid>
				</Grid>
			</FormControl>

			<CustomDatePicker
				fieldAttributes={{
					name: 'startDate',
					title: 'Start Date',
					value: startDate,
					titleComponent: 'div',
					layout: 'horizontal',
				}}
				fieldConfig={{
					hasTime: true,
					margin: 'dense',
					variant: 'outlined',
					size: 'small',
				}}
				fieldEvents={{
					onChange: value => {
						formStateController.updateState({ startDate: value.toDate() });
					},
				}}
			/>
			<CustomDatePicker
				fieldAttributes={{
					name: 'endDate',
					title: 'End Date',
					value: endDate,
					titleComponent: 'div',
					layout: 'horizontal',
				}}
				fieldConfig={{
					hasTime: true,
					margin: 'dense',
					variant: 'outlined',
					size: 'small',
				}}
				fieldEvents={{
					onChange: value => {
						formStateController.updateState({ endDate: value.toDate() });
					},
				}}
			/>

			<OwnerField
				title="Owner"
				users={users}
				setOwnerId={value => {
					const foundText = users.find(item => item.value === value)?.text || '';
					formStateController.updateState({ owner: { id: value, name: foundText } });
				}}
				ownerId={owner?.id}
			/>

			<SearchableSelectField
				title="Associated Deal"
				options={openDeals}
				value={dealValue}
				selectedFieldId={dealId}
				onChange={value => {
					formStateController.updateState({ dealId: value?._id });
				}}
			/>
			<FormControl variant="outlined" fullWidth size="small">
				<Grid container className={classes.gridStyle}>
					<Grid item xs={3}>
						<div>Associated Contact</div>
					</Grid>

					<Grid item xs={9}>
						<AutocompEntityNamesVirtualizeList
							mongoEntitiesArray={mongoEntitiesArray}
							setMongoEntitiesArray={setMongoEntitiesArray}
							nameAutValue={nameAutValue}
							setNameAutValue={setNameAutValue}
							nameAutInputValue={nameAutInputValue}
							setNameAutInputValue={setNameAutInputValue}
							variant="outlined"
							label="Associated Contact or Lead"
							hasNextPage={hasNextPage}
							isNextPageLoading={isNextPageLoading}
							loadNextPage={loadNextPage}
							addNew={true}
							addNewOnClick={value => {
								const contact = { name: value };
								addContact({
									variables: {
										contact: {
											...contact,
											createBy: stateApp.user.mongoId,
											lastUpdateBy: stateApp.user.mongoId,
										},
									},
									refetchQueries: ['getPaginatedContacts', 'getContact'],
									awaitRefetchQueries: true,
								});
							}}
						/>
					</Grid>
				</Grid>
			</FormControl>

			<FormControl variant="outlined" fullWidth size="small">
				<Grid container className={classes.gridStyle}>
					<Grid item xs={3}>
						<div>Status</div>
					</Grid>

					<Grid item xs={9}>
						<CustomAutoComplete
							fieldAttributes={{
								name: 'activityStatus',
								label: 'Activity Status',
								value: activityStatusOptions.find(option => option.value === status),
								optionArray: activityStatusOptions,
							}}
							fieldEvents={{
								onChange: ({ value }) => {
									formStateController.updateState({ status: value });
								},
							}}
							fieldConfig={{
								margin: 'dense',
								variant: 'outlined',
								textfieldRestProps: {
									className: classes.fieldWidth,
								},
							}}
							id="activity-status"
							disableClearable
						/>
					</Grid>
				</Grid>
			</FormControl>

			<DescriptionField
				description={notes}
				setDescription={value => formStateController.updateState({ notes: value })}
			/>
		</div>
	);
}

ActivityForm.propTypes = {
	setSelectedActivityId: PropTypes.func.isRequired,
};
