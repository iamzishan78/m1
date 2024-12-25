import { useLazyQuery } from '@apollo/client';
import { Checkbox, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { CONTACT } from 'graphQL/useQueryContact';

import { AppContext } from '../../AppContext';
import ActivitiesList from './components/ActivitiesList';
import AddActivityDialog from '../ContactDetailCard/components/AddActivityDialog';
import RightDialog from '../ContactDetailCard/components/RightDialog';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	addNew: {
		margin: 0,
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	activitiesList: {
		padding: '20px',
	},
	groupContent: {
		display: 'flex',
	},
	viewAllCard: {
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: '#ffffff',
		height: 'calc(100vh - 72px)',
	},
	textBtn: {
		margin: '0 0 8px 0',
		float: 'right',
		color: theme.palette.secondary.main,
		cursor: 'pointer',
		fontWeight: 'normal',
		'&:hover': { color: '#757575' },
		transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
	},
	activitiesFilter: {
		padding: '20px 30px',
		backgroundColor: 'rgb(240, 246, 248)',
		minWidth: '250px',
		height: '100%',
	},
	checkBox: {
		minHeight: '35px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	activityCardRight: {
		display: 'flex',
	},
}));

function ActivitiesFilter({ activitiesFilter, setActivitiesFilter }) {
	const classes = useStyles();

	const handleChange = (e, type) => {
		if (activitiesFilter) {
			let newActivitiesFilter = [...activitiesFilter];
			if (e.target.checked) {
				newActivitiesFilter.push(type);
			} else {
				const filterIndex = newActivitiesFilter.findIndex(act => act === type);
				if (filterIndex !== -1) {
					newActivitiesFilter.splice(filterIndex, 1);
				}
			}
			setActivitiesFilter(newActivitiesFilter);
		}
	};

	const getCheckboxItem = type => {
		let name = '';
		switch (type) {
			case 'deadline':
				name = 'Deadlines';
				break;
			case 'call':
				name = 'Calls';
				break;
			case 'text_message':
				name = 'Text Messages';
				break;
			case 'email':
				name = 'Emails';
				break;
			case 'meeting':
				name = 'Meetings';
				break;
			case 'task':
				name = 'Tasks';
				break;
			case 'mailer':
				name = 'Mailers';
				break;
			default:
				name = 'Calls';
		}

		return (
			<Grid item xs={12} className={classes.checkBox}>
				<h4 style={{ color: '#9A9A9A', margin: 0 }}>{name}</h4>
				<Checkbox checked={activitiesFilter.includes(type)} onChange={e => handleChange(e, type)} color="secondary" />
			</Grid>
		);
	};

	return (
		<div className={classes.activitiesFilter}>
			<h4 style={{ margin: '0 0 8px 0' }}>Filter</h4>
			<div className={classes.activityTypeCheckboxes}>
				<Grid item xs={12} style={{ minHeight: '35px' }}>
					<h4 style={{ margin: '0 0 20px 0', float: 'left' }}>Activity Type</h4>

					<h4
						className={classes.textBtn}
						onClick={() => {
							setActivitiesFilter([]);
						}}
					>
						Clear
					</h4>
				</Grid>

				{getCheckboxItem('call')}
				{getCheckboxItem('text_message')}
				{getCheckboxItem('email')}
				{getCheckboxItem('mailer')}
				{getCheckboxItem('meeting')}
				{getCheckboxItem('task')}
				{getCheckboxItem('deadline')}
			</div>
		</div>
	);
}

export default function ViewActivities() {
	const classes = useStyles();
	let history = useHistory();
	const [stateApp] = useContext(AppContext);

	const id = history.location.pathname.split('/')[history.location.pathname.split('/').length - 2];

	const [activitiesFilter, setActivitiesFilter] = useState([
		'call',
		'text_message',
		'meeting',
		'email',
		'task',
		'deadline',
		'mailer',
	]);
	const [contactData, setContactData] = useState(null);
	const [activityModalOpen, setActivityModalOpen] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState(null);

	const [getContact, { data }] = useLazyQuery(CONTACT);

	useEffect(() => {
		if (id) {
			getContact({
				variables: {
					contactId: id,
				},
			});
		}
	}, [id, getContact]);

	useEffect(() => {
		if (data && data.contact) {
			setContactData(data.contact);
		}
	}, [data]);

	const updateActivity = activity => {
		setSelectedActivity(activity);
		setActivityModalOpen(true);
	};

	const addActivity = () => {
		setSelectedActivity(null);
		setActivityModalOpen(true);
	};

	const filteredActivities = stateApp.currentContatcAtivities.filter(act => activitiesFilter.includes(act.type));

	return (
		<div style={{ marginTop: '65px' }}>
			<div
				style={{
					backgroundColor: '#F2F2F2',
					minHeight: '7px',
					display: 'flex',
					position: 'relative',
					alignItems: 'center',
				}}
			/>

			<RightDialog
				open={activityModalOpen ? true : false}
				handleClickDialogClose={() => setActivityModalOpen(false)}
				width="450px"
			>
				<AddActivityDialog
					onClose={() => setActivityModalOpen(false)}
					id={id}
					contactData={contactData}
					selectedActivity={selectedActivity}
				/>
			</RightDialog>

			<div className={classes.viewAllCard}>
				<div className={classes.activitiesList}>
					<div className={classes.groupContent}>
						<h4 style={{ margin: '0px 12px 8px 0px' }}>Recent Activities</h4>
						<h4 className={classes.addNew} onClick={addActivity}>
							Add New
						</h4>
					</div>
					<ActivitiesList
						id={id}
						user_id={stateApp.user.email}
						activityLog={filteredActivities}
						updateActivity={updateActivity}
						viewAll={true}
					/>
				</div>
				<div className={classes.activityCardRight}>
					<ActivitiesFilter activitiesFilter={activitiesFilter} setActivitiesFilter={setActivitiesFilter} />
				</div>
			</div>
		</div>
	);
}
