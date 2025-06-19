import React, { useState, useContext, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';


import { useLazyQuery } from '@apollo/client';

import { navController } from 'stateManagement/navStateController';

import { COUNTIES } from '../../../graphQL/useQueryCountiesBySta';
import CustomAutoComplete from '../../Shared/components/Fields/CustomAutoComplete';
import { NavigationContext } from '../NavigationContext';

const useStyles = makeStyles(() => ({
	formControl: {
		minWidth: 249,
		color: 'black',
	},
	loader: {
		marginLeft: '50%',
	},
	autoC: { '& input': { color: '#17AADD' } },
}));

export default function FilterCountyName() {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const [countyList, setCountyList] = useState([]);
	const [getCounties, { loading, data }] = useLazyQuery(COUNTIES, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		if (stateNav.stateName) {
			getCounties({
				variables: {
					state: stateNav.stateName,
				},
			});
		} else {
			setCountyList([]);
		}
	}, [stateNav.stateName]);

	const nullDesc = [
		{ field: 'GrId1', value: null },
		{ field: 'GrId2', value: null },
		{ field: 'GrId3', value: null },
		{ field: 'GrId4', value: null },
		{ field: 'GrId5', value: null },
		{ field: 'countyName', value: null },
		{ field: 'county', value: null },
		{ field: 'filterGeography', value: null },
	];
	const nullDesc_Obj = {};
	nullDesc.forEach(filter => {
		nullDesc_Obj[filter.field] = filter.value;
	});

	useEffect(() => {
		if (data) {
			if (data.counties) {
				setCountyList(data.counties);
			} else {
				setCountyList([]);
				setStateNav(stateNav => ({
					...stateNav,
					countyName: null,
					...nullDesc,
				}));
			}
		}
	}, [data]);

	const handleCountyNameChange = ({ valueObj }) => {
		if (valueObj == null) {
			setStateNav(stateNav => ({
				...stateNav,
				...nullDesc_Obj,
			}));
			navController.handleGeographyFilters(nullDesc);
		} else {
			if (valueObj && valueObj.county) {
				setStateNav(stateNav => ({
					...stateNav,
					...nullDesc_Obj,
					countyName: valueObj.county,
				}));
				navController.handleGeographyFilters([...nullDesc, { field: 'county', value: valueObj.county }]);
			}
		}
	};

	const onEnterKey = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
		}
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			{loading ? (
				<div style={{ height: '56px' }}>
					<CircularProgress color="secondary" className={classes.loader} size={28} />
				</div>
			) : (
				<CustomAutoComplete
					className={classes.autoC}
					fieldConfig={{
						size: 'medium',
						disabled: !stateNav.stateName || countyList.length === 0,
						variant: 'outlined',
						getCustomOptionLabel: option => (option && option.county ? option.county : option ? option : ''),
					}}
					fieldAttributes={{
						label: 'County',
						optionArray: countyList,
						value: countyList.length === 0 ? '' : stateNav.countyName,
					}}
					fieldEvents={{
						onChange: handleCountyNameChange,
						onBlur: onEnterKey,
					}}
				/>
			)}
		</FormControl>
	);
}
