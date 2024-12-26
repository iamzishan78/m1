import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { InputAdornment, TextField, IconButton, Tooltip, Grid, Typography, Button } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { debounce } from 'lodash';

import { FEATURES } from 'components/Shared/FeatureFlag/common';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		marginRight: theme.spacing(2),
		width: '35%',
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
	contactSearchField: {
		color: 'grey',

		'& .MuiInputBase-root': {
			paddingRight: '6px !important',
			paddingLeft: '6px !important',
		},

		'& .MuiOutlinedInput-input': {
			color: '#grey',
			paddingLeft: '7px !important',
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
}));

const ContactSearch = () => {
	const classes = useStyles();
	const history = useHistory();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [search, setSearch] = useState(stateApp.contactSearchQuery);
	const { quickActionsPanelState, activeModule } = useSelector(({ common }) => common);

	// Reset the state when path changes
	useEffect(() => {
		setSearch('');
		setStateApp(stateApp => ({
			...stateApp,
			contactSearchQuery: '',
			isContactSearching: true,
		}));
	}, [history.location.pathname]);

	// Create a debounced function
	const debouncedSearch = useCallback(
		debounce(value => {
			setStateApp(stateApp => ({
				...stateApp,
				contactSearchQuery: value,
				isContactSearching: true,
			}));
		}, 1000),
		[setStateApp]
	);

	// Handle search input change
	const handleInputChange = e => {
		const { value } = e.target;
		setSearch(value);
		debouncedSearch(value); // Call the debounced function
	};

	// Clear search input
	const handleClearSearch = () => {
		setSearch('');
		setStateApp(stateApp => ({
			...stateApp,
			contactSearchQuery: '',
			isContactSearching: true,
		}));
	};

	const isAllowed = stateApp?.user?.features?.find(f => f.name === FEATURES.CONTACTSUBMENU);

	return (
		<Grid
			container
			direction="row"
			display="flex"
			justify="space-between"
			alignItems="center"
			style={{
				marginLeft: isAllowed && quickActionsPanelState ? '433px' : '7px',
			}}
		>
			<Grid item md={8}>
				<Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
					{isAllowed && (
						<Grid item md={2.5}>
							<Typography variant="h5" style={{ color: 'black', fontWeight: 'bold', marginRight: '20px' }}>
								{activeModule.title ? activeModule.title : 'Contacts'}
							</Typography>
						</Grid>
					)}
					<Grid item md={6}>
						<TextField
							value={search}
							onChange={handleInputChange}
							style={{
								margin: 0,
								width: '100%',
							}}
							className={classes.contactSearchField}
							margin="dense"
							variant="outlined"
							placeholder={
								activeModule.title === 'Campaigns'
									? 'Search by campaign name or attribute'
									: `Search for ${activeModule.title ? 'lead, contact or prospect' : 'contact'}`
							}
							InputProps={{
								startAdornment: (
									<InputAdornment>
										<IconButton size="small">
											<SearchIcon htmlColor="grey" />
										</IconButton>
									</InputAdornment>
								),
								endAdornment: (
									<>
										<Tooltip title="Clear">
											<IconButton
												id="crossButton"
												size="small"
												htmlColor="#fff"
												className={`${classes.toggleBtn} ${
													stateApp.activityDisplayType === 'table' && classes.activeBtn
												}`}
												onClick={handleClearSearch}
											>
												<ClearIcon />
											</IconButton>
										</Tooltip>
									</>
								),
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
			{activeModule.title === 'Campaigns' && (
				<Grid item md={4}>
					<div className={classes.filterTabs} style={{ float: 'right' }}>
						<Button
							id="addCampaignButton"
							color="primary"
							variant="contained"
							startIcon={<Add />}
							onClick={() => {
								history.push('/contacts/campaign/details/new');
							}}
						>
							Add CAMPAIGN
						</Button>
					</div>
				</Grid>
			)}
		</Grid>
	);
};

export default ContactSearch;
