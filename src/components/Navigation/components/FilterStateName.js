import React, { useContext, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { navController } from 'stateManagement/navStateController';

import { NavigationContext } from '../NavigationContext';
import { statesAbbNames, statesNames } from './Utils/USAStates&Abb';

const useStyles = makeStyles(theme => ({
	formControl: {
		minWidth: 249,
		color: 'black',
	},
	autoC: { '& input': { color: '#17AADD' } },
}));

const nullDesc = [
	{ field: 'GrId1', value: null },
	{ field: 'GrId2', value: null },
	{ field: 'GrId3', value: null },
	{ field: 'GrId4', value: null },
	{ field: 'GrId5', value: null },
	{ field: 'filterGeography', value: null },
	{ field: 'state', value: null },
	{ field: 'stateName', value: null },
	{ field: 'displayStateName', value: null },
	{ field: 'county', value: null },
	{ field: 'countyName', value: null },
];
const nullDesc_Obj = {};
nullDesc.forEach(filter => {
	nullDesc_Obj[filter.field] = filter.value;
});

export default function FilterStateName() {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);

	useEffect(() => {
		if (!stateNav.stateName && stateNav.displayStateName) {
			handleStateNameChange();
		}
	}, [stateNav.stateName]);

	const handleStateNameChange = (event, newValue) => {
		if (newValue === null) {
			setStateNav(stateNav => ({
				...stateNav,
				...nullDesc_Obj,
			}));
			navController.handleGeographyFilters(nullDesc);
		} else {
			const AbbName = statesAbbNames[statesNames.indexOf(newValue)];
			setStateNav(stateNav => ({
				...stateNav,
				...nullDesc_Obj,
				stateName: AbbName,
				displayStateName: newValue,
			}));
			navController.handleGeographyFilters([...nullDesc, { field: 'state', value: AbbName }]);
		}
	};

	const onEnterKey = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
		}
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<Autocomplete
				className={classes.autoC}
				options={statesNames}
				getOptionLabel={option => option}
				autoSelect
				disableListWrap
				includeInputInList
				value={stateNav.displayStateName}
				onChange={(event, newValue) => {
					handleStateNameChange(event, newValue);
				}}
				onKeyDown={event => onEnterKey(event)}
				renderInput={params => (
					<form autoComplete="off">
						<TextField {...params} fullWidth label="State" variant="outlined" />
					</form>
				)}
				renderOption={option => <Typography>{option}</Typography>}
			/>
		</FormControl>
	);
}
