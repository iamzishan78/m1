import React, { useContext, useState } from 'react';
import { Views } from 'react-big-calendar';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Autocomplete from '@material-ui/lab/Autocomplete';

import moment from 'moment';

import { AppContext } from 'AppContext';

const useToolbarStyles = makeStyles(theme => ({
	root: {
		padding: '16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	viewSwitcher: {
		height: 30,
		marginRight: 8,
	},
	filterByTypeDisplay: {
		borderRadius: 3,
		display: 'flex',
		alignItems: 'center',
		marginRight: '10px',
	},
	filterDisplay: {
		color: '#d9d9d9',
		display: 'flex',
		alignItems: 'center',
		padding: '2px 4px',
		border: '1px solid #fff',
		borderRadius: 3,
		cursor: 'pointer',

		'& span': {
			marginLeft: 4,
		},
	},
	datePicker: {
		overflow: 'hidden',
		position: 'absolute',
		width: '97px',
		marginLeft: '41px',
		opacity: '0',

		'& input::-webkit-calendar-picker-indicator': {
			display: 'block',
			top: 0,
			left: 0,
			background: '#0000',
			position: 'absolute',
			transform: ' scale(12)',
		},
	},
	active: {
		backgroundColor: '#d0f1fc',
		color: '#15a9d7 !important',
	},
	right: {
		display: 'flex',
	},
	left: {
		display: 'flex',
		alignItems: 'center',
	},
	marginLeft: {
		marginLeft: 8,
	},
	centerNav: {
		display: 'flex',
		alignItems: 'center',
	},
	filterToggleBtn: {
		borderRadius: 5,
		border: '1px solid #d9d9d9',
		color: '#333',
		transition: '200ms all',
		backgroundColor: '#f5f5f5',
	},
	activeBtn: {
		borderRadius: 5,
		border: '1px solid #1CB6DA',
		backgroundColor: '#1CB6DA',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#1CB6DAdd',
		},
	},
}));

const activitiesTypesOptions = [
	{ label: 'All', value: 'all' },
	{ label: 'Call', value: 'call' },
	{ label: 'Meeting', value: 'meeting' },
	{ label: 'Task', value: 'task' },
	{ label: 'Deadline', value: 'deadline' },
	{ label: 'Email', value: 'email' },
	{ label: 'Text Message', value: 'text_message' },
	{ label: 'Mailer', value: 'mailer' },
];

const ActivitiesToolbar = ({
	activityFilterByType,
	setActivityFilterByType,
	activityFilterByTime,
	setActivityFilterByTime,
	activityFilterByOwner,
	setActivityFilterByOwner,
	activityFilterByResponsibleParty,
	setActivityFilterByResponsibleParty,
	setSelectedDate,
	selectedDate,
	view,
	obligationOptions,
	setView,
	mongoUsers,
	activities,
	operatorList,
	type,
	...toolbar
}) => {
	const classes = useToolbarStyles();
	const [stateApp] = useContext(AppContext);
	const [selectedObligationType, setObligationType] = useState({ label: 'All', value: 'all' });

	const goToBack = () => {
		setSelectedDate(state => {
			return moment(state).subtract(1, view).toDate();
		});
	};
	const goToNext = () => {
		setSelectedDate(state => {
			return moment(state).add(1, view).toDate();
		});
	};
	const handleViewChange = event => {
		const view = event.target.value;
		setView(view);
		toolbar.onView(view);
	};

	const acitvityOwnerOptions = React.useMemo(() => {
		let ownerOptions = [{ label: 'All', value: 'all' }];
		if (activities) {
			const uniqueOwners = new Map();
			activities.forEach(activity => {
				const activityDate = moment(parseInt(activity.dateTime));
				const selectedMonth = moment(selectedDate);
				const weekStart = moment(selectedDate).startOf('week');
				const weekEnd = moment(selectedDate).endOf('week');
				if (
					activity.ownerId &&
					activity.ownerName &&
					!uniqueOwners.has(activity.ownerId) &&
					(activityFilterByType === 'all' || activity.type === activityFilterByType)
				) {
					if (
						(activityDate.isSame(selectedMonth, 'month') && view === Views.MONTH) ||
						(activityDate.isBetween(weekStart, weekEnd, undefined, '[]') && view === Views.WEEK) || // '[]' includes start and end dates
						stateApp.activityDisplayType !== 'calendar'
					) {
						uniqueOwners.set(activity.ownerId, activity.ownerName);
						ownerOptions.push({ value: activity.ownerId, label: activity.ownerName });
					}
				}
			});
		}
		return ownerOptions;
	}, [activities, activityFilterByType, selectedDate, view, stateApp.activityDisplayType]);

	const responsiblePartyOptions = React.useMemo(() => {
		let ownerOptions = [{ label: 'All', value: 'all' }];
		if (activities) {
			const uniqueOwners = new Map();

			activities.forEach(activity => {
				const activityDate = moment(parseInt(activity.dateTime));
				const selectedMonth = moment(selectedDate);
				const weekStart = moment(selectedDate).startOf('week');
				const weekEnd = moment(selectedDate).endOf('week');
				if (
					activity.responsibleParty &&
					!uniqueOwners.has(activity.responsibleParty) &&
					(activityFilterByType === 'all' || activity.type === activityFilterByType)
				) {
					if (
						(activityDate.isSame(selectedMonth, 'month') && view === Views.MONTH) ||
						(activityDate.isBetween(weekStart, weekEnd, undefined, '[]') && view === Views.WEEK) || // '[]' includes start and end dates
						stateApp.activityDisplayType !== 'calendar'
					) {
						uniqueOwners.set(activity.responsibleParty, activity.responsibleParty);
						ownerOptions.push({ value: activity.responsibleParty, label: activity.responsibleParty });
					}
				}
			});
		}
		return ownerOptions;
	}, [activities, activityFilterByType, selectedDate, view, stateApp.activityDisplayType]);

	return (
		<div className={classes.root}>
			<div className={classes.left}>
				<div className={classes.filterByTypeDisplay}>
					{type === 'Activity' && (
						<Autocomplete
							id="activityFilterByType"
							options={activitiesTypesOptions}
							getOptionLabel={option => option.label}
							style={{ width: 220 }}
							size="small"
							defaultValue={activitiesTypesOptions.find(o => o.value === activityFilterByType)}
							value={activitiesTypesOptions.find(o => o.value === activityFilterByType)}
							onChange={(_, value) => {
								setActivityFilterByType(value?.value ?? 'all');
							}}
							renderInput={params => (
								<TextField {...params} label="Activity Type" variant="outlined" value={activityFilterByType} />
							)}
						/>
					)}
					{type === 'Obligation' && (
						<Autocomplete
							id="obligationType"
							options={obligationOptions}
							getOptionLabel={option => option.label}
							style={{ width: 220 }}
							size="small"
							defaultValue={obligationOptions.find(o => o.value === activityFilterByType)}
							value={obligationOptions.find(o => o.value === activityFilterByType)}
							onChange={(_, value) => {
								setActivityFilterByType(value?.value ?? 'all');
							}}
							renderInput={params => <TextField {...params} label="Obligation Type" variant="outlined" />}
						/>
					)}
				</div>
				<div className={classes.filterByTypeDisplay}>
					<Autocomplete
						id="activityFilterByOwner"
						options={acitvityOwnerOptions}
						getOptionLabel={option => option.label}
						style={{ width: 220 }}
						size="small"
						defaultValue={acitvityOwnerOptions.find(u => u.value === activityFilterByOwner)}
						value={acitvityOwnerOptions.find(u => u.value === activityFilterByOwner)}
						onChange={(_, value) => {
							setActivityFilterByOwner(value?.value ?? 'all');
						}}
						renderInput={params => (
							<TextField
								{...params}
								label={type === 'Obligation' ? 'Assigned To' : 'Owner'}
								variant="outlined"
								value={activityFilterByOwner}
							/>
						)}
					/>
				</div>

				{type === 'Obligation' && (
					<div className={classes.filterByTypeDisplay}>
						<Autocomplete
							id="activityFilterByResponsibleParty"
							options={responsiblePartyOptions}
							getOptionLabel={option => option.label}
							style={{ width: 220 }}
							size="small"
							defaultValue={responsiblePartyOptions.find(u => u.value === activityFilterByResponsibleParty)}
							value={responsiblePartyOptions.find(u => u.value === activityFilterByResponsibleParty)}
							onChange={(_, value) => {
								setActivityFilterByResponsibleParty(value?.value ?? 'all');
							}}
							renderInput={params => (
								<TextField
									{...params}
									label="Responsible Party"
									variant="outlined"
									value={activityFilterByResponsibleParty}
								/>
							)}
						/>
					</div>
				)}
			</div>
			{stateApp.activityDisplayType === 'calendar' && (
				<div className={classes.centerNav}>
					<IconButton size="small" className={classes.marginLeft} onClick={() => goToBack()}>
						<NavigateBeforeIcon />
					</IconButton>
					<p className={classes.marginLeft}>{toolbar.label}</p>
					<IconButton size="small" className={classes.marginLeft} onClick={() => goToNext()}>
						<NavigateNextIcon />
					</IconButton>

					<TextField
						id="date"
						label="Birthday"
						type="date"
						format="MM/DD/YYYY"
						value={selectedDate}
						className={classes.datePicker}
						onChange={event => setSelectedDate(new Date(event.target.value))}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
			)}
			<div className={classes.right}>
				{stateApp.activityDisplayType === 'calendar' ? (
					<Select className={classes.viewSwitcher} variant="outlined" value={view} onChange={handleViewChange}>
						<MenuItem value={Views.WEEK}>Week</MenuItem>
						<MenuItem value={Views.MONTH}>Month</MenuItem>
					</Select>
				) : null}

				<div>
					<ButtonGroup>
						<Button
							size="small"
							className={`${classes.filterToggleBtn} ${activityFilterByTime === 'all' && classes.activeBtn}`}
							onClick={() => setActivityFilterByTime('all')}
						>
							All
						</Button>
						<Button
							size="small"
							className={`${classes.filterToggleBtn} ${activityFilterByTime === 'upcoming' && classes.activeBtn}`}
							onClick={() => setActivityFilterByTime('upcoming')}
						>
							Upcoming
						</Button>
						<Button
							size="small"
							className={`${classes.filterToggleBtn} ${activityFilterByTime === 'overdue' && classes.activeBtn}`}
							onClick={() => setActivityFilterByTime('overdue')}
						>
							Overdue
						</Button>
						<Button
							size="small"
							className={`${classes.filterToggleBtn} ${activityFilterByTime === 'open' && classes.activeBtn}`}
							onClick={() => setActivityFilterByTime('open')}
						>
							Open
						</Button>
						<Button
							size="small"
							className={`${classes.filterToggleBtn} ${activityFilterByTime === 'closed' && classes.activeBtn}`}
							onClick={() => setActivityFilterByTime('closed')}
						>
							Closed
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
	);
};

export default ActivitiesToolbar;
