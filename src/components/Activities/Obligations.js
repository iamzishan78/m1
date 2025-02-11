import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { useHistory } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery } from '@apollo/client';
import { uniqueId } from 'lodash';
import moment from 'moment';

import MRTTable from 'components/MRTTable';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';
import { GET_CONTACTS_FOR_ACTIVITY } from 'graphQL/useQueryGetContactsForActivity';
import { GETMONGOUSERS } from 'graphQL/useQueryGetUsers';

import { slidoutStateController } from 'hookstate/slidoutStateController';
import { tableController } from 'hookstate/tableController';

import ActivitiesEvent from './components/ActivitiesEvent';
import ActivitiesToolbar from './components/ActivitiesToolbar';
import { AppContext } from '../../AppContext';
import ActivitiesSlideout from './components/ActivitiesSlideout';
import { GETALLACTIVITIES } from '../../graphQL/useQueryGetAllActivities';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

const localizer = momentLocalizer(moment);

Date.prototype.addHours = function (h) {
	this.setHours(this.getHours() + h * 60 * 60 * 1000);
	return this;
};

const ActivitiesCalendar = props => {
	const [selectedDate, setSelectedDate] = useState(new Date());

	return (
		<div>
			<Calendar
				drilldownView="month"
				popup={true}
				localizer={localizer}
				events={props.events}
				endAccessor={'end'}
				startAccessor={'start'}
				view={props.view}
				date={selectedDate || new Date()}
				style={{ height: 'calc(100vh - 67px)', position: 'relative' }}
				step={60}
				onSelectEvent={e => props.onEventClick(e)}
				showMultiDayTimes
				components={{
					toolbar: params => (
						<ActivitiesToolbar selectedDate={selectedDate} setSelectedDate={setSelectedDate} {...params} {...props} />
					),
					event: props => <ActivitiesEvent isObligation={true} {...props} />,
				}}
			/>
		</div>
	);
};

const useStyles = makeStyles(theme => ({
	progress: {
		marginLeft: '30px',
		verticalAlign: 'middle',
	},
	root: {
		marginTop: '65px',
	},
	table: {
		borderTop: 'solid 1px#E0E0E0',
		maxHeight: 'calc(100vh - 147px) !important',
		overflowY: 'auto',
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 10,
		},
	},
}));

const getFilterCondition = (
	e,
	activityFilterByType,
	activityFilterByTime,
	activityFilterByOwner,
	activityFilterByResponsibleParty
) => {
	const filterByTypeCondition = e.type === activityFilterByType || activityFilterByType === 'all';
	const filterByOwnerCondition = e.ownerId === activityFilterByOwner || activityFilterByOwner === 'all';
	const filterByResponsiblePartyCondition =
		e.responsibleParty === activityFilterByResponsibleParty || activityFilterByResponsibleParty === 'all';
	let filterByTimeCondition;
	const today = new Date();
	// const tomorrow = moment().add(1, "d");
	// const nextWeekDay = moment().add(7, "d");

	switch (activityFilterByTime) {
		case 'all':
			filterByTimeCondition = true;
			break;
		case 'upcoming':
			filterByTimeCondition = moment(e.start).isSameOrAfter(today, 'day');
			break;
		case 'overdue':
			filterByTimeCondition = moment(e.end).isBefore(today, 'day');
			break;
		case 'open':
			filterByTimeCondition = !e.isClosed;
			break;
		case 'closed':
			filterByTimeCondition = e.isClosed;
			break;
		default:
			filterByTimeCondition = true;
	}

	return filterByTypeCondition && filterByTimeCondition && filterByOwnerCondition && filterByResponsiblePartyCondition;
};

const Activities = () => {
	const classes = useStyles();
	let history = useHistory();
	const [getAllActivities, { data: activitiesData, loading: activitiesLoading }] = useLazyQuery(GETALLACTIVITIES, {
		fetchPolicy: 'network-only',
	});
	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'network-only',
	});

	const [getOperatorList, { data: operatorList }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });

	const [getContactsForActivity, { data: getContactsForActivityResult }] = useLazyQuery(GET_CONTACTS_FOR_ACTIVITY, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			slidoutStateController.updateState({ loader: false });
		},
	});

	const [stateApp, setStateApp] = useContext(AppContext);

	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [activityFilterByType, setActivityFilterByType] = useState('all');
	const [activityFilterByOwner, setActivityFilterByOwner] = useState('all');
	const [activityFilterByResponsibleParty, setActivityFilterByResponsibleParty] = useState('all');
	const [activityFilterByTime, setActivityFilterByTime] = useState('all');
	const activitiesGridState = tableController('ObligationsTable').useState(['filters']).stateValues;
	const [view, setView] = React.useState(Views.MONTH);

	const { selectedActivityId } = slidoutStateController.useState(['selectedActivityId']);

	const obligationOptions = React.useMemo(() => {
		if (activitiesData?.activities) {
			let obligationTypes = activitiesData?.activities.map(activity => activity.type);
			obligationTypes = Array.from(new Set(obligationTypes));

			let obligations = obligationTypes.filter(Boolean).map(type => ({
				label: type,
				value: type,
			}));
			obligations.unshift({ label: 'All', value: 'all' });
			return obligations;
		} else {
			return [];
		}
	}, [activitiesData]);

	useEffect(() => {
		getAllActivities({
			variables: {
				category: 'Obligation',
			},
		});
		getAllMongoUsers();
	}, []);

	useEffect(() => {
		const contacts = getContactsForActivityResult?.getContactsForActivity?.contacts;
		setStateApp(stateApp => ({
			...stateApp,
			activityContacts: { contacts },
		}));
	}, [getContactsForActivityResult]);

	useEffect(() => {
		if (events.length > 0) {
			const eventId = history.location.pathname.split('/')[3];
			if (eventId) {
				setSelectedActivityId(eventId);
				onModalOpen();
			}
		}
	}, [events]);

	useEffect(() => {
		if (activitiesData) {
			setEvents(
				activitiesData?.activities?.map(act => {
					const start = new Date(Number(act.dateTime));
					const end = act.endDateTime ? new Date(Number(act.endDateTime)) : start;
					return {
						id: uniqueId(),
						...act,
						start,
						end,
						title: act.fullname,
						notes: act.notes,
						ownerId: act.ownerId,
						type: act.type,
						name: act.name,
						// isContact: act.contactId,
					};
				})
			);
		}
	}, [activitiesData]);

	useEffect(() => {
		setFilteredEvents(
			events.filter(e =>
				getFilterCondition(
					e,
					activityFilterByType,
					activityFilterByTime,
					activityFilterByOwner,
					activityFilterByResponsibleParty
				)
			)
		);
	}, [
		events,
		activityFilterByType,
		activityFilterByTime,
		activityFilterByOwner,
		activityFilterByResponsibleParty,
		view,
	]);

	useEffect(() => {
		if (selectedActivityId) {
			slidoutStateController.updateState({ selectedActivity: events.find(act => act._id === selectedActivityId) });
		} else {
			slidoutStateController.updateState({ selectedActivity: null });
		}
	}, [selectedActivityId]);

	useEffect(() => {
		if (activitiesGridState) {
			tableController('ObligationsTable').clearFilters();
			const filters = [];

			if (activityFilterByType && activityFilterByType !== 'all') {
				filters.push({ field: 'type.keyword', value: activityFilterByType });
			} else {
				tableController('ObligationsTable').clearFilter('type.keyword');
			}
			if (activityFilterByType && activityFilterByOwner !== 'all') {
				filters.push({ field: 'ownerId.keyword', value: activityFilterByOwner });
			} else {
				tableController('ObligationsTable').clearFilter('ownerId.keyword');
			}

			if (activityFilterByResponsibleParty && activityFilterByResponsibleParty !== 'all') {
				filters.push({ field: 'responsibleParty.keyword', value: activityFilterByResponsibleParty });
			} else {
				tableController('ObligationsTable').clearFilter('responsibleParty.keyword');
			}
			const today = moment().format('yyyy-MM-DD');
			switch (activityFilterByTime) {
				case 'upcoming':
					filters.push({
						field: 'dateTime',
						value: {
							gte: `${today}T00:00:00.000Z`,
						},
						type: 'range',
					});
					break;
				case 'overdue':
					filters.push({
						field: 'endDateTime',
						value: {
							lte: `${today}T00:00:00.000Z`,
						},
						type: 'range',
					});
					filters.push({ field: 'isClosed', value: 'false' });
					break;
				case 'open':
					filters.push({
						field: 'isClosed',
						value: 'false',
					});
					break;
				case 'closed':
					filters.push({
						field: 'isClosed',
						value: 'true',
					});
					break;

				default:
					break;
			}
			tableController('ObligationsTable').setFilters(filters);
		}
	}, [activityFilterByType, activityFilterByOwner, activityFilterByTime, activityFilterByResponsibleParty]);

	useEffect(() => {
		getContactsForActivity({
			variables: { activityId: selectedActivityId },
		});
	}, [selectedActivityId]);

	const onEventClick = event => {
		window.history.pushState('', '', `/calendar/obligations/${event._id}`);
		setSelectedActivityId(event._id);
		onModalOpen();
	};

	const onModalOpen = () => {
		slidoutStateController.updateState({ loader: true });
		getContactsForActivity({
			variables: { activityId: selectedActivityId },
		}).then(() => {
			slidoutStateController.showSlideout();
		});
	};

	const setSelectedActivityId = id => {
		slidoutStateController.updateState({ selectedActivityId: id });
	};

	useEffect(() => {
		getAllMongoUsers();
		getOperatorList({
			variables: {
				search: '*',
				filterKey: 'operator.name.keyword',
				esIndex: 'properties_flat',
				size: 50,
			},
		});

		return () => {
			slidoutStateController.updateState({
				selectedActivityId: '',
				selectedActivity: null,
			});
			slidoutStateController.hideSlideout();
		};
	}, []);

	const overrideMeta = {
		defaultFilters: [{ field: 'category.keyword', value: 'Obligation' }],
	};

	return (
		<div className={classes.root}>
			{activitiesLoading ? (
				<CircularProgress className={classes.progress} size={80} disableShrink color="secondary" />
			) : (
				<>
					{/* create a line break to avoid overlapping */}
					<hr style={{ backgroundColor: 'transparent', border: 0, marginTop: '7vh' }} size={'4'} />
					{stateApp.activityDisplayType === 'calendar' ? (
						<ActivitiesCalendar
							activityFilterByType={activityFilterByType}
							setActivityFilterByType={setActivityFilterByType}
							activityFilterByTime={activityFilterByTime}
							setActivityFilterByTime={setActivityFilterByTime}
							activityFilterByOwner={activityFilterByOwner}
							setActivityFilterByOwner={setActivityFilterByOwner}
							activityFilterByResponsibleParty={activityFilterByResponsibleParty}
							setActivityFilterByResponsibleParty={setActivityFilterByResponsibleParty}
							view={view}
							obligationOptions={obligationOptions}
							events={filteredEvents}
							setView={setView}
							onEventClick={onEventClick}
							mongoUsers={userLists?.allMongoUsers}
							activities={activitiesData?.activities}
							operatorList={operatorList}
							type="Obligation"
						/>
					) : (
						<div>
							<div
								style={{
									padding: '8px 0',
								}}
							>
								<ActivitiesToolbar
									activityFilterByType={activityFilterByType}
									setActivityFilterByType={setActivityFilterByType}
									activityFilterByTime={activityFilterByTime}
									setActivityFilterByTime={setActivityFilterByTime}
									activityFilterByOwner={activityFilterByOwner}
									setActivityFilterByOwner={setActivityFilterByOwner}
									activityFilterByResponsibleParty={activityFilterByResponsibleParty}
									setActivityFilterByResponsibleParty={setActivityFilterByResponsibleParty}
									view={view}
									obligationOptions={obligationOptions}
									setView={setView}
									events={filteredEvents}
									onEventClick={onEventClick}
									mongoUsers={userLists?.allMongoUsers}
									activities={activitiesData?.activities}
									operatorList={operatorList}
									type="Obligation"
								/>
							</div>
							<div className={classes.table}>
								<MRTTable name="ObligationsTable" overrideMeta={overrideMeta} />
							</div>
						</div>
					)}
					{/* <ActivitiesModal setSelectedActivityId={setSelectedActivityId} events={events} /> */}

					<ActivitiesSlideout
						activityId={selectedActivityId}
						setSelectedActivityId={setSelectedActivityId}
						events={events}
						getContactsForActivity={getContactsForActivity}
						type="obligations"
					/>
				</>
			)}
		</div>
	);
};

export default Activities;
