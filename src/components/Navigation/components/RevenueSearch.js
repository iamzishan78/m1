import { InputAdornment, TextField, IconButton, Tooltip } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import React, { useContext, useState, useMemo, useEffect } from 'react';

import { SIDE_PANEL_MENU_ITEMS_LIST } from 'components/Revenue/Revenue';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		marginRight: theme.spacing(2),
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

const LandSearch = ({ activeModule }) => {
	const classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [search, setSearch] = useState('');

	const searchPlaceholder = useMemo(() => {
		switch (activeModule?.title) {
			case SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS?.title:
				return 'Search by check number or attribute';
			case SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES?.title:
				return 'Search by property number or attribute';
			default:
				return '';
		}
	}, [activeModule]);

	useEffect(() => {
		const newSearch = stateApp.revenueSearchQuery.replace('*', '');
		if (newSearch !== search) {
			setSearch(newSearch);
		}
	}, [stateApp.revenueSearchQuery]);

	useEffect(() => {
		return () => {
			setStateApp(stateApp => ({
				...stateApp,
				revenueSearchQuery: '',
			}));
		};
	}, []);

	return (
		<div className={classes.search}>
			<TextField
				value={search}
				onChange={e => {
					setSearch(e.target.value?.trim());
					setTimeout(() => {
						setStateApp(stateApp => ({
							...stateApp,
							revenueSearchQuery: `${e.target.value?.trim()}*`,
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
				placeholder={searchPlaceholder}
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
									className={`${classes.toggleBtn} ${stateApp.activityDisplayType === 'table' && classes.activeBtn}`}
									onClick={() => {
										setSearch('');
										setStateApp(stateApp => ({
											...stateApp,
											revenueSearchQuery: '*',
											// isLandSearching: true,
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
		</div>
	);
};

export default LandSearch;
