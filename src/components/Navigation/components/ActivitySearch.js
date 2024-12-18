import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { Grid, InputAdornment, TextField, Tooltip, IconButton } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import debounce from 'lodash/debounce';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import List from '@material-ui/icons/List';
import EventIcon from '@material-ui/icons/Event';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { GETALLACTIVITIES } from 'graphQL/useQueryGetAllActivities';
import { AppContext } from 'AppContext';
import { slidoutState } from 'hookstate/initialStates';

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
	const [nameAutInputValue, setNameAutInputValue] = useState('');

	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	const [getAllActivitiesForSearch, { data: activitiesData, loading }] = useLazyQuery(GETALLACTIVITIES, {
		fetchPolicy: `network-only`,
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
			slidoutState.selectedActivityId.set(id);
			slidoutState.show.set(true);
			slidoutState.selectedActivity.set(activitiesData?.activities?.find(act => act._id === id));
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

	const onInputChange = React.useMemo(
		() =>
			debounce((event, value, reason) => {
				setNameAutInputValue(value);
			}, 500),
		[]
	);

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
			style={{ marginLeft: quickActionsPanelState ? '425px' : '0px', width: '55%', marginTop: '15px' }}
			ref={childRef}
		>
			<Grid item className={classes.barTitle}>
				<EventIcon />
				<Typography variant="h5">{activeModule.title}</Typography>
			</Grid>
			<Grid item>
				<Autocomplete
					className={classes.search}
					style={{
						margin: 0,
					}}
					defaultValue={nameAutValue}
					value={nameAutValue}
					disableListWrap
					options={activities}
					noOptionsText={loading ? 'Loading' : 'No options'}
					getOptionLabel={option => option?.name || ''}
					getOptionSelected={(option, value) => {
						return option === value;
					}}
					renderOption={option => {
						return (
							<Grid container spacing={0}>
								<Grid container item xs={12} alignItems="center">
									<Grid item xs>
										<span style={{ fontWeight: 400 }}>{option?.name || ''}</span>

										<Typography variant="body2" color="textSecondary">
											{option?.type || ''}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						);
					}}
					onInputChange={onInputChange}
					onChange={(e, act) => {
						handleSelectActivity(act?._id);
						setNameAutValue(act);
					}}
					renderInput={params => (
						<TextField
							margin="dense"
							{...params}
							style={{
								margin: 0,
							}}
							className={classes.activitySearchField}
							placeholder={`Search for ${activeModule?.title?.toLowerCase()}`}
							variant="outlined"
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<InputAdornment>
										<IconButton size="small">
											<SearchIcon htmlColor="grey" />
										</IconButton>
									</InputAdornment>
								),
								endAdornment: (
									<>
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
									</>
								),
							}}
							size="small"
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
};

export default ActivitySearch;
