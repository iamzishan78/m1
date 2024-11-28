import React, { useContext, useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import get from 'lodash/get';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../../../AppContext';
import AutocompEntityNamesVirtualizeList from '../../Shared/M1nTable/components/SubComponents/AutocompEntityNamesVirtualizeList';
import { setStateIfDeepEqual } from '../../Shared/functions';
import { PAGINATEDCONTACTSQUERY } from '../../../graphQL/useQueryPaginatedContacts';
import { ADDCONTACT } from '../../../graphQL/useMutationAddContact';
import { OPENDEALS } from '../../../graphQL/useQueryOpenDeals';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { GETMONGOUSERS } from '../../../graphQL/useQueryGetUsers';
import { ADDACTIVITY, DELETEACTIVITY, UPDATEACTIVITY } from '../../../graphQL/useMutationActivity';
import { outcomeOptions } from 'components/ContactDetailCard/components/FieldContent/helper';
import SimpleTextField from 'components/Shared/Slideout/FieldComponents/SimpleTextfield';
import SingleSelectField from 'components/Shared/Slideout/FieldComponents/singleSelectField';
import DateField from 'components/Shared/Slideout/FieldComponents/DateField';
import OwnerField from 'components/Shared/Slideout/FieldComponents/OwnerField';
import SearchableSelectField from 'components/Shared/Slideout/FieldComponents/searchableSelectField';
import DescriptionField from 'components/Shared/Slideout/FieldComponents/DescriptionField';
import { slidoutStateController } from 'hookstate/slidoutStateController';
import { slidoutState } from 'hookstate/initialStates';
import { useHookstate } from '@hookstate/core';
import { activityFormState } from './activityFormStateController';
import { globalState } from 'hookstate/initialStates';
import { tableGlobalController } from 'hookstate/tableController';
import AutoCompleteAddNewField from 'components/ContactDetailCard/components/FieldContent/AutoCompleteAddNewField';

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

const mergeDateAndTime = (d, t) => {
	return `${d}T${t}`;
};

const activityStatusOptions = [
	{ label: 'Open', value: false },
	{ label: 'Complete', value: true },
];

export default function ActivityForm({ setSelectedActivityId }) {
	const outcomeFieldRef = useRef();
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);
	const history = useHistory();
	const [users, setUsers] = useState([]);
	const { selectedActivity } = slidoutState;

	const activityName = useHookstate(slidoutState.title).get({ noproxy: true });
	const formMode = useHookstate(slidoutState.formMode);
	const { activityType, outcome, startDate, endDate, owner, dealId, status, notes, startTime, endTime } =
		useHookstate(activityFormState);
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

	const [addActivityMutation] = useMutation(ADDACTIVITY, {
		onCompleted: () => {
			onModalClose();
			globalState.universalLoader.set(false);
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const [updateActivityMutation] = useMutation(UPDATEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			globalState.universalLoader.set(false);
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const [deleteActivityMutation] = useMutation(DELETEACTIVITY, {
		onCompleted: () => {
			onModalClose();
			slidoutStateController.updateEntityLoading(false);
			tableGlobalController.refetch();
		},
		refetchQueries: ['getAllActivities', 'getESSimpleSearch'],
		awaitRefetchQueries: true,
	});

	const [getPaginatedContacts, { data: allContacts, fetchMore: fetchMorePaginatedContacts }] = useLazyQuery(
		PAGINATEDCONTACTSQUERY,
		{
			fetchPolicy: 'cache-and-network',
			nextFetchPolicy: 'cache-first',
		}
	);
	const [addContact, { data: addContactData }] = useMutation(ADDCONTACT);
	const [nameAutInputValue, NameAutInputValue] = useState('');
	const setNameAutInputValue = newState => {
		setStateIfDeepEqual(NameAutInputValue, newState);
	};
	const [hasNextPage, setHasNextPage] = useState(true);
	const [isNextPageLoading, setIsNextPageLoading] = useState(false);

	const [openDeals, setOpenDeals] = useState([]);
	const [getOpenDeals, { data: dealsData }] = useLazyQuery(OPENDEALS, {
		fetchPolicy: 'cache-and-network',
	});
	const dealValue = openDeals.find(deal => deal._id === dealId.get()) || null;

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
			setMongoEntitiesArray([...allContacts?.paginatedContacts?.edges?.map(el => el.node)]);
			setHasNextPage(allContacts?.paginatedContacts?.pageInfo?.hasNextPage);
		}
		setIsNextPageLoading(false);
	}, [allContacts]);

	useEffect(() => {
		const activity = selectedActivity.get();
		if (activity) {
			slidoutStateController.updateNewEntity(false);
			notes.set(activity.notes);
			owner.set({
				name: activity?.ownerName,
				id: activity?.ownerId,
			});
			dealId.set(activity.dealId);
			activityType.set(activity.type);
			slidoutStateController.updateParent('Activity');
			slidoutStateController.updateTitle(activity.name);
			if (!activityName) slidoutStateController.updateTitle(activity.name);

			status.set(activity.isClosed);
			setNameAutValue({
				name: activity.contactName,
				_id: activity.contactId,
			});
			outcomeFieldRef.current?.updateDefaultValue(activity.outcome);
			outcome.set(activity.outcome);
			startTime.set(moment.parseZone(activity.start).format('HH:mm'));
			endDate.set(moment.parseZone(activity.end).format('yyyy-MM-DD'));
			startDate.set(moment.parseZone(activity.start).format('yyyy-MM-DD'));
			endTime.set(moment.parseZone(activity.end).format('HH:mm'));
		} else {
			slidoutStateController.updateNewEntity(true);
			setNameAutValue({ name: activityName, _id: null });
			status.set(status.get() || false);
			notes.set(notes.get());
			owner.set({
				name: owner.get()?.name || stateApp.user.fullname || stateApp.user.email,
				id: owner.get()?.id || stateApp.user.mongoId,
			});
			dealId.set(dealId.get());
			activityType.set(activityType.get());
			slidoutStateController.updateParent('Activity');
			slidoutStateController.updateTitle(activityName);
			startDate.set(startDate.get() || getCurrentDate());
			endDate.set(endDate.get() || getCurrentDate());
			startTime.set('08:00');
			endTime.set('08:00');
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

	useEffect(() => {
		if (formMode.get()) {
			if (formMode.get() === 'update') {
				if (!selectedActivity.get()) addActivity();
				else updateActivity();
			} else if (formMode.get() === 'delete') {
				deleteActivity();
			}
			formMode.set('');
			slidoutStateController.hideSlideout();
		}
	}, [formMode.get()]);

	const onModalClose = () => {
		if (history.location.pathname !== '/contacts/activityDashboard') {
			window.history.pushState('', '', `/calendar/activities`);
		}

		clearFields();
		setSelectedActivityId(null);
		slidoutState.selectedActivity.set(null);
		slidoutStateController.hideSlideout();
		slidoutState.newComments.set([]);
	};

	const clearFields = () => {
		slidoutStateController.updateNewEntity(true);
		notes.set('');
		owner.set({
			name: stateApp.user.fullname || stateApp.user.email,
			id: stateApp.user.mongoId,
		});
		setNameAutValue({ name: '', _id: null });
		dealId.set(null);
		activityType.set('');
		slidoutStateController.updateTitle('');
		status.set(false);
		startDate.set(getCurrentDate());
		endDate.set(getCurrentDate());
		startTime.set('08:00');
		endTime.set('08:00');
		setNameAutInputValue('');
		outcome.set('');
	};

	const addActivity = async () => {
		if (!activityName || activityName.trim().length === 0) {
			onModalClose();
			return;
		}

		globalState.universalLoader.set(true);
		const dateTime = mergeDateAndTime(startDate.get(), startTime.get());
		const endDateTime = mergeDateAndTime(endDate.get(), endTime.get());

		await addActivityMutation({
			variables: {
				activity: {
					type: activityType.get(),
					name: activityName,
					notes: notes.get(),
					outcome: outcome.get(),
					ownerId: owner.get()?.id,
					ownerName: owner.get()?.name,
					contactId: nameAutValue._id,
					contactName: nameAutValue.name,
					dealId: dealId.get(),
					dateTime: new Date(dateTime).toUTCString(),
					endDateTime: new Date(endDateTime).toUTCString(),
					isClosed: status.get(),
					user: stateApp.user._id,
					createdBy: stateApp?.user?._id,
					comments: slidoutState.newComments.get(),
				},
			},
		});
	};

	const updateActivity = async () => {
		globalState.universalLoader.set(true);
		const dateTime = mergeDateAndTime(startDate.get(), startTime.get());
		const endDateTime = mergeDateAndTime(endDate.get(), endTime.get());

		updateActivityMutation({
			variables: {
				activity: {
					_id: selectedActivity.get()?._id,
					type: activityType.get(),
					name: activityName,
					dateTime: new Date(dateTime).toUTCString(),
					endDateTime: new Date(endDateTime).toUTCString(),
					notes: notes.get(),
					outcome: outcome.get(),
					ownerId: owner.get()?.id,
					ownerName: owner.get()?.name,
					contactId: nameAutValue?._id,
					contactName: nameAutValue?.name,
					dealId: dealId.get(),
					isClosed: status.get(),
					user: stateApp.user._id,
				},
			},
		});
	};

	const deleteActivity = async () => {
		slidoutStateController.updateEntityLoading(true);
		await deleteActivityMutation({
			variables: {
				id: selectedActivity.get()._id,
			},
		});
	};

	return (
		<div className={classes.inputFieldRoot}>
			<SimpleTextField
				title="Description"
				value={activityName}
				setValue={value => slidoutStateController.updateTitle(value)}
			/>
			<SingleSelectField
				title="Type"
				value={activityType.get()}
				options={typeOptions}
				onChange={value => activityType.set(value)}
			/>

			<FormControl variant="outlined" fullWidth size="small" style={{ marginTop: '10px' }}>
				<Grid container className={classes.gridStyle}>
					<Grid item xs={3}>
						<div>Outcome</div>
					</Grid>

					<Grid item xs={9}>
						<AutoCompleteAddNewField
							ref={outcomeFieldRef}
							queryParams={{
								esIndex: 'activities_flat', // Set the correct index to get outcome options
								filterKey: 'outcome.keyword',
								size: 50,
							}}
							onChange={data => {
								outcome.set(data.name);
							}}
							defaultOptions={outcomeOptions}
							value={outcome.get()}
							inputProps={{ variant: 'outlined', size: 'small' }}
						/>
					</Grid>
				</Grid>
			</FormControl>
			<FormControl variant="outlined" fullWidth size="small">
				<Grid container className={classes.gridStyle} style={{ marginTop: '10px' }}>
					<DateField
						title="Start Date"
						date={startDate.get()}
						time={startTime.get()}
						setDate={value => {
							startDate.set(value);
							endDate.set(value);
						}}
						setTime={value => {
							startTime.set(value);
							endTime.set(value);
						}}
						isTime={true}
					/>
				</Grid>
				<Grid container className={classes.gridStyle} style={{ marginTop: '10px' }}>
					<DateField
						title="End Date"
						date={endDate.get()}
						time={endTime.get()}
						setDate={value => endDate.set(value)}
						setTime={value => endTime.set(value)}
						isTime={true}
					/>
				</Grid>
			</FormControl>

			<OwnerField
				title="Owner"
				users={users}
				setOwnerId={value => {
					const foundText = users.find(item => item.value === value)?.text || '';
					owner.set({ id: value, name: foundText });
				}}
				ownerId={owner.get()?.id}
			/>

			<SearchableSelectField
				title="Associated Deal"
				options={openDeals}
				value={dealValue}
				selectedFieldId={dealId.get()}
				onChange={value => {
					dealId.set(value?._id);
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
						<Autocomplete
							id="activity-status"
							disableClearable
							className={classes.fieldWidth}
							options={activityStatusOptions}
							onChange={(e, option) => status.set(option.value)}
							value={activityStatusOptions.find(option => option.value === status.get())}
							getOptionLabel={option => option.label}
							renderInput={params => (
								<TextField {...params} margin="dense" variant="outlined" label="Activity Status" />
							)}
						/>
					</Grid>
				</Grid>
			</FormControl>

			<DescriptionField description={notes.get()} setDescription={value => notes.set(value)} />
		</div>
	);
}
