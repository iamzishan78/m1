import React, { useState, useContext } from 'react';
import { Grid, InputAdornment, TextField, Tooltip, IconButton } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { FEATURES } from 'components/Shared/FeatureFlag/common';

import { AppContext } from '../../../AppContext';

const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		marginRight: theme.spacing(2),
		marginLeft: '-7px !important',
		width: '100%',
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
}));

const ActivitySearch = ({ showLabel }) => {
	const classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const { quickActionsPanelState } = useSelector(({ contact }) => contact);

	const [search, setSearch] = useState('');

	const isAllowed = stateApp?.user?.features?.find(f => f.name === FEATURES.CONTACTSUBMENU);

	return (
		<>
			<Grid
				container
				direction="row"
				display="flex"
				justify="space-between"
				alignItems="center"
				style={{
					marginLeft: isAllowed && quickActionsPanelState ? '433px' : '7px',
					width: '85%',
				}}
			>
				<Grid item md={8}>
					<Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
						<Grid item md={2.5}>
							<Typography
								variant="h5"
								style={{
									color: 'black',
									fontWeight: 'bold',
									marginRight: '20px',
								}}
							>
								Activity Dashboard
							</Typography>
						</Grid>

						<Grid item md={6}>
							<TextField
								value={search}
								onChange={e => {
									setSearch(e.target.value);
									setTimeout(() => {
										setStateApp(stateApp => ({
											...stateApp,
											activitySearchQuery: e.target.value,
										}));
									}, 500);
								}}
								style={{
									margin: 0,
									width: '100%',
								}}
								className={classes.contactSearchField}
								margin="dense"
								variant="outlined"
								placeholder="Search for activities by name or attribute"
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
													size="small"
													htmlColor="#fff"
													className={`${classes.toggleBtn} ${
														stateApp.activityDisplayType === 'table' && classes.activeBtn
													}`}
													onClick={() => {
														setSearch('');
														setStateApp(stateApp => ({
															...stateApp,
															activitySearchQuery: '',
														}));
													}}
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
			</Grid>
		</>
	);
};

export default ActivitySearch;
