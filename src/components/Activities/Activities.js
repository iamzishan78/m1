import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery } from '@apollo/client';
import { uniqueId } from 'lodash';
import moment from 'moment';

import MRTTable from 'components/MRTTable';

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
	const { quickActionsPanelState } = useSelector(({ common }) => common);

	useEffect(() => {
		const handleShowMoreClick = event => {
			setTimeout(() => {
				const overlays = document.querySelectorAll('.rbc-overlay');
				overlays.forEach(overlay => {
					const header = overlay.querySelector('.rbc-overlay-header');
					if (header) {
						const dateText = header.textContent.split(' ');
						if (dateText[0] === 'Sunday') {
							overlay.style.marginLeft = quickActionsPanelState ? '25%' : '3%';
						} else if (dateText[0] === 'Saturday') {
							overlay.style.marginLeft = quickActionsPanelState ? '0%' : '0%';
						} else {
							overlay.style.marginLeft = '3%';
						}
					}
				});
			}, 0);
		};

		document.addEventListener('click', handleShowMoreClick);
		return () => {
			document.removeEventListener('click', handleShowMoreClick);
		};
	}, [quickActionsPanelState]);
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
				date={selectedDate}
				style={{ height: 'calc(100vh - 67px)', position: 'relative' }}
				step={60}
				onSelectEvent={e => props.onEventClick(e)}
				showMultiDayTimes
				components={{
					toolbar: params => (
						<ActivitiesToolbar selectedDate={selectedDate} setSelectedDate={setSelectedDate} {...params} {...props} />
					),
					event: props => <ActivitiesEvent {...props} />,
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
		marginTop: '54px',
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

const getFilterCondition = (e, activityFilterByType, activityFilterByTime, activityFilterByOwner) => {
	const filterByTypeCondition = e.type === activityFilterByType || activityFilterByType === 'all';
	const filterByOwnerCondition = e.ownerId === activityFilterByOwner || activityFilterByOwner === 'all';
	let filterByTimeCondition;
	const today = new Date();

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

	return filterByTypeCondition && filterByTimeCondition && filterByOwnerCondition;
};

const Activities = () => {
	const classes = useStyles();
	const { isLoading, selectedActivityId } = slidoutStateController.useState(['isLoading', 'selectedActivityId']);

	let history = useHistory();
	const [getAllActivities, { data: activitiesData, loading: activitiesLoading }] = useLazyQuery(GETALLACTIVITIES, {
		fetchPolicy: 'network-only',
	});
	const [getContactsForActivity, { data: getContactsForActivityResult }] = useLazyQuery(GET_CONTACTS_FOR_ACTIVITY, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			slidoutStateController.updateState({ loader: false });
		},
	});
	const [getAllMongoUsers, { data: userLists }] = useLazyQuery(GETMONGOUSERS, {
		fetchPolicy: 'network-only',
	});

	const [stateApp, setStateApp] = useContext(AppContext);

	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [activityFilterByType, setActivityFilterByType] = useState('all');
	const [activityFilterByOwner, setActivityFilterByOwner] = useState('all');
	const [activityFilterByTime, setActivityFilterByTime] = useState('all');
	const activitiesGridState = tableController('ActivitiesTable').useState(['filters']).stateValues;
	const [view, setView] = React.useState(Views.MONTH);
	useEffect(() => {
		const contacts = getContactsForActivityResult?.getContactsForActivity?.contacts;
		setStateApp(stateApp => ({
			...stateApp,
			activityContacts: { contacts },
		}));
	}, [getContactsForActivityResult]);

	useEffect(() => {
		getAllActivities({
			variables: {
				category: 'CRM',
			},
		});
		getAllMongoUsers();

		return () => {
			slidoutStateController.updateState({
				selectedActivityId: '',
				selectedActivity: null,
			});
			slidoutStateController.hideSlideout();
		};
	}, []);

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
						creator: { name: act?.createdBy?.name },
						// isContact: act.contactId,
					};
				})
			);
		}
	}, [activitiesData]);

	useEffect(() => {
		setFilteredEvents(
			events.filter(e => getFilterCondition(e, activityFilterByType, activityFilterByTime, activityFilterByOwner))
		);
	}, [events, activityFilterByType, activityFilterByTime, activityFilterByOwner, view]);

	useEffect(() => {
		if (selectedActivityId) {
			slidoutStateController.updateState({ selectedActivity: events.find(act => act._id === selectedActivityId) });
		} else {
			slidoutStateController.updateState({ selectedActivity: null });
		}
	}, [selectedActivityId]);

	useEffect(() => {
		if (activitiesGridState) {
			tableController('ActivitiesTable').clearFilters();
			const filters = [];

			if (activityFilterByType && activityFilterByType !== 'all') {
				filters.push({ field: 'type.keyword', value: activityFilterByType });
			}
			if (activityFilterByType && activityFilterByOwner !== 'all') {
				filters.push({ field: 'ownerId.keyword', value: activityFilterByOwner });
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
			tableController('ActivitiesTable').setFilters(filters);
		}
	}, [activityFilterByType, activityFilterByOwner, activityFilterByTime]);

	useEffect(() => {
		getContactsForActivity({
			variables: { activityId: selectedActivityId },
		});
	}, [selectedActivityId]);

	const onEventClick = event => {
		window.history.pushState('', '', `/calendar/activities/${event._id}`);
		setSelectedActivityId(event._id);
		onModalOpen();
		slidoutStateController.showSlideout();
	};

	const onModalOpen = () => {
		slidoutStateController.updateState({ loader: true });
		getContactsForActivity({
			variables: { activityId: slidoutStateController.getValue('selectedActivityId') },
		}).then(() => {
			slidoutStateController.showSlideout();
		});
	};

	const setSelectedActivityId = id => {
		slidoutStateController.updateState({ selectedActivityId: id });
	};

	const overrideMeta = {
		defaultFilters: [
			{ field: 'category.keyword', value: 'CRM' },
			{ field: 'type.keyword', value: 'Expiration', type: 'advanced', searchType: 'notEquals' },
		],
	};

	return (
		<div className={classes.root}>
			{activitiesLoading || isLoading ? (
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
							view={view}
							setView={setView}
							events={filteredEvents}
							onEventClick={onEventClick}
							mongoUsers={userLists?.allMongoUsers}
							activities={activitiesData?.activities}
							type="Activity"
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
									view={view}
									setView={setView}
									events={filteredEvents}
									onEventClick={onEventClick}
									mongoUsers={userLists?.allMongoUsers}
									activities={activitiesData?.activities}
									type="Activity"
								/>
							</div>

							<div className={classes.table}>
								<MRTTable name="ActivitiesTable" overrideMeta={overrideMeta} />
							</div>
						</div>
					)}
					<ActivitiesSlideout
						activityId={selectedActivityId}
						setSelectedActivityId={setSelectedActivityId}
						events={events}
						getContactsForActivity={getContactsForActivity}
					/>
				</>
			)}
		</div>
	);
};

export default Activities;
