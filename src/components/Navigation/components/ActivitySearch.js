import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Grid, InputAdornment, Tooltip, IconButton } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { fade, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import EventIcon from '@material-ui/icons/Event';
import List from '@material-ui/icons/List';
import SearchIcon from '@material-ui/icons/Search';


import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GETALLACTIVITIES } from 'graphQL/useQueryGetAllActivities';

import { slidoutStateController } from 'stateManagement/slidoutStateController';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	barTitle: {
		alignItems: 'center',
		marginRight: '45px',
		display: 'flex',
		'& svg': {
			fill: 'black !important',
			fontSize: '2rem',
			marginLeft: '10px',
		},
		'& .MuiTypography-root': {
			fontSize: '1.7rem',
			fontWeight: 'bold',
			color: 'black',
			marginLeft: '10px',
		},
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		marginRight: theme.spacing(2),
		marginLeft: '-7px !important',
		width: '555px',
		transition: 'width 0.5s',
		[theme.breakpoints.up('sm')]: {
			marginLeft: 5,
		},
	},

	toggleBtn: {
		borderRadius: 5,
		color: 'grey',
		transition: '200ms all',
		'&:hover': {
			backgroundColor: '#1CB6DA44',
		},
	},

	activeBtn: {
		color: '#1CB6DA',
	},

	activitySearchField: {
		color: '#fff',

		'& .MuiInputBase-root': {
			paddingRight: '6px !important',
		},

		'& .MuiOutlinedInput-input': {
			color: 'grey',
			'&::placeholder': {
				color: '##ffffffc9',
				textDecoration: 'bold',
			},
			'&:-ms-input-placeholder': {
				color: '##ffffffc9',
			},
			'&::-ms-input-placeholder': {
				color: '##ffffffc9',
			},
		},
	},
	// New class to apply to the parent
	backgroundHighlight: {
		backgroundColor: '#ffffff !important',
	},
}));

const ActivitySearch = () => {
	const classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const childRef = useRef(null);

	const [activities, setActivities] = useState([]);
	const [nameAutValue, setNameAutValue] = useState({ name: '', _id: null });

	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	const [getAllActivitiesForSearch, { data: activitiesData, loading }] = useLazyQuery(GETALLACTIVITIES, {
		fetchPolicy: 'network-only',
	});

	const handleSelectActivity = id => {
		if (activeModule.title === 'Expirations') {
			setStateApp(stateApp => ({
				...stateApp,
				activityDialog: id ? true : false,
				selectedActivityId: id || null,
			}));
		} else if (id) {
			window.history.pushState('', '', `/calendar/activities/${id}`);
			slidoutStateController.updateState({
				selectedActivityId: id,
				show: true,
				selectedActivity: activitiesData?.activities?.find(act => act._id === id),
			});
		}
	};

	useEffect(() => {
		setActivities([]); // reset data if activityModule is changed
		setNameAutValue({ name: '', _id: null }); // reset search text if activityModule is changed
		let category = null;
		switch (activeModule.title) {
			case 'Activities':
				category = 'CRM';
				break;
			case 'Obligations':
				category = 'Obligation';
				break;
			case 'Expirations':
				category = 'Expiration';
				break;
			default:
		}
		getAllActivitiesForSearch({
			variables: { category },
		});
	}, [activeModule]);

	useEffect(() => {
		if (activitiesData) {
			setActivities(activitiesData?.activities);
		}
	}, [activitiesData]);

	const setActivityDisplayType = activityDisplayType => {
		setStateApp(stateApp => ({
			...stateApp,
			activityDisplayType,
		}));
	};

	useEffect(() => {
		if (childRef.current) {
			// Access the parent element of the component referenced by childRef
			const parent = childRef.current.parentElement;
			if (parent) {
				// Add the backgroundHighlight class to the parent element
				parent.classList.add(classes.backgroundHighlight);
			}
		}
	}, [classes]); // Run this effect whenever the classes object changes

	return (
		<Grid
			container
			display="flex"
			direction="row"
			alignItems="center"
			style={{ marginLeft: quickActionsPanelState ? '425px' : '0px', marginTop: '15px' }}
			ref={childRef}
		>
			<Grid item className={classes.barTitle}>
				<EventIcon />
				<Typography variant="h5">{activeModule.title}</Typography>
			</Grid>
			<Grid item>
				<CustomAutoComplete
					className={classes.search}
					fieldConfig={{
						margin: 'dense',
						size: 'small',
						variant: 'outlined',
						inputClassName: classes.activitySearchField,
						loading: loading,
						renderOptionComp: ({ option }) => (
							<Grid container item xs={12} alignItems="center">
								<Grid item xs>
									<span style={{ fontWeight: 400 }}>{option?.name || ''}</span>

									<Typography variant="body2" color="textSecondary">
										{option?.type || ''}
									</Typography>
								</Grid>
							</Grid>
						),
						textFieldInputProps: {
							startAdornment: (
								<InputAdornment>
									<IconButton size="small">
										<SearchIcon htmlColor="grey" />
									</IconButton>
								</InputAdornment>
							),
							endAdornment: (
								<ButtonGroup variant="text">
									<Tooltip title="Clear">
										<IconButton
											size="small"
											htmlColor="#fff"
											className={`${classes.toggleBtn} ${stateApp.activityDisplayType === 'table' && classes.activeBtn}`}
											onClick={() => {
												setNameAutValue({ name: '', _id: null });
											}}
										>
											<ClearIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="List View">
										<IconButton
											id="listView"
											size="small"
											htmlColor="#fff"
											className={`${classes.toggleBtn} ${stateApp.activityDisplayType === 'table' && classes.activeBtn}`}
											onClick={() => setActivityDisplayType('table')}
										>
											<List />
										</IconButton>
									</Tooltip>
									<Tooltip title="Calendar">
										<IconButton
											size="small"
											htmlColor="#fff"
											className={`${classes.toggleBtn} ${stateApp.activityDisplayType === 'calendar' && classes.activeBtn}`}
											onClick={() => setActivityDisplayType('calendar')}
										>
											<EventIcon />
										</IconButton>
									</Tooltip>
								</ButtonGroup>
							),
						},
					}}
					fieldAttributes={{
						value: nameAutValue,
						defaultValue: nameAutValue,
						optionArray: activities.filter(option => option?.name),
						placeholder: `Search for ${activeModule?.title?.toLowerCase()}`,
					}}
					fieldEvents={{
						onChange: ({ valueObj: activity }) => {
							handleSelectActivity(activity?._id);
							setNameAutValue(activity);
						},
					}}
				/>
			</Grid>
		</Grid>
	);
};

ActivitySearch.propTypes = {
	activeModule: PropTypes.shape({
		title: PropTypes.string,
	}),
	quickActionsPanelState: PropTypes.bool,
};

export default ActivitySearch;
