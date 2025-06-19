import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import { Grid, InputAdornment, IconButton, Tooltip } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { fade, makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import List from '@material-ui/icons/List';
import SearchIcon from '@material-ui/icons/Search';
import TableChartIcon from '@material-ui/icons/TableChart';

import { AppContext } from '../../../AppContext';
import CustomAutoComplete from '../../Shared/components/Fields/CustomAutoComplete';


const useStyles = makeStyles(theme => ({
	search: () => ({
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		marginRight: theme.spacing(2),
		marginLeft: '425px !important',
		width: '34%',
		transition: 'width 0.5s',
		[theme.breakpoints.up('sm')]: {
			marginLeft: 5,
		},
	}),

	toggleBtn: {
		borderRadius: 5,
		color: '#grey',
		transition: '200ms all',
		'&:hover': {
			backgroundColor: '#1CB6DA44',
		},
	},

	activeBtn: {
		color: '#1CB6DA !important',
		// "&:hover": {
		//   backgroundColor: "#1CB6DAdd",
		// },
	},

	activitySearchField: {
		color: 'grey',

		'& .MuiInputBase-root': {
			paddingRight: '6px !important',
		},

		'& .MuiOutlinedInput-input': {
			color: '#grey',
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

const DealSearch = () => {
	const [stateApp, setStateApp] = useContext(AppContext);
	const classes = useStyles();
	const [allDeals, setAllDeals] = useState([]);
	const [searchInputValue, setSearchInputValue] = useState('');
	const { pipeToShowTab } = useSelector(({ Flow }) => Flow);

	useEffect(() => {
		if (pipeToShowTab) {
			setAllDeals(pipeToShowTab);
		} else {
			setAllDeals([]);
		}
	}, [pipeToShowTab]);

	const handleSelectDeal = deal => {
		setSearchInputValue(deal.name);
		setStateApp(stateApp => ({
			...stateApp,
			dealDialog: true,
			activeDeal: deal,
		}));
	};

	const setDealDisplayType = dealDisplayType => {
		setStateApp(stateApp => ({
			...stateApp,
			dealDisplayType,
		}));
	};

	const renderOptionComp = ({ option }) => {
		return (
			<Grid container item xs={12} alignItems="center">
				<Grid item xs>
					<span style={{ fontWeight: 400 }}>{option.name}</span>
				</Grid>
			</Grid>
		);
	};

	return (
		<>
			<CustomAutoComplete
				className={classes.search}
				popupIcon={<ArrowDropDownIcon htmlColor="#fff" />}
				fieldConfig={{
					margin: 'dense',
					variant: 'outlined',
					renderOptionComp,
					textfieldRestProps: {
						style: { margin: 0 },
						className: classes.activitySearchField,
					},
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
								{searchInputValue && searchInputValue !== '' && (
									<Tooltip title="Clear" placement="top">
										<IconButton size="small" onClick={() => setSearchInputValue('')}>
											<ClearIcon htmlColor="#fff" />
										</IconButton>
									</Tooltip>
								)}
								<Tooltip title="List View">
									<IconButton
										size="small"
										htmlColor="#fff"
										className={`${classes.toggleBtn} ${stateApp.dealDisplayType === 'table' && classes.activeBtn}`}
										onClick={() => setDealDisplayType('table')}
									>
										<List />
									</IconButton>
								</Tooltip>
								<Tooltip title="Board View">
									<IconButton
										size="small"
										htmlColor="#fff"
										className={`${classes.toggleBtn} ${stateApp.dealDisplayType === 'board' && classes.activeBtn}`}
										onClick={() => setDealDisplayType('board')}
									>
										<TableChartIcon />
									</IconButton>
								</Tooltip>
							</ButtonGroup>
						),
					},
				}}
				fieldAttributes={{
					optionArray: allDeals,
					placeholder: 'Search for deals',
					inputSearchText: searchInputValue,
				}}
				fieldEvents={{
					onChange: ({ valueObj }) => {
						valueObj && handleSelectDeal(valueObj);
					},
					onTextFieldChange: value => {
						setSearchInputValue(value);
					},
				}}
			/>
		</>
	);
};

export default DealSearch;
