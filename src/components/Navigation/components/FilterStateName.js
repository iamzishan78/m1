import React, { useContext, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

import { navController } from 'stateManagement/navStateController';

import CustomAutoComplete from '../../Shared/components/Fields/CustomAutoComplete';
import { NavigationContext } from '../NavigationContext';
import { statesAbbNames, statesNames } from './Utils/USAStates&Abb';

const useStyles = makeStyles(() => ({
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

	const handleStateNameChange = (value = null) => {
		if (!value) {
			setStateNav(stateNav => ({
				...stateNav,
				...nullDesc_Obj,
			}));
			navController.handleGeographyFilters(nullDesc);
		} else {
			const AbbName = statesAbbNames[statesNames.indexOf(value)];
			setStateNav(stateNav => ({
				...stateNav,
				...nullDesc_Obj,
				stateName: AbbName,
				displayStateName: value,
			}));
			navController.handleGeographyFilters([...nullDesc, { field: 'state', value: AbbName }]);
		}
	};

	useEffect(() => {
		if (!stateNav.stateName && stateNav.displayStateName) {
			handleStateNameChange();
		}
	}, [stateNav.stateName]);

	const onEnterKey = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
		}
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<CustomAutoComplete
				className={classes.autoC}
				fieldConfig={{
					size: 'medium',
					variant: 'outlined',
				}}
				fieldAttributes={{
					label: 'State',
					optionArray: statesNames,
					value: stateNav.displayStateName,
				}}
				fieldEvents={{
					onChange: ({ valueObj }) => handleStateNameChange(valueObj),
					onBlur: onEnterKey,
				}}
			/>
		</FormControl>
	);
}
