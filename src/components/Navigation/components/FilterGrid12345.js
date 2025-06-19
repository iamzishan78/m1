import React, { useState, useContext, useEffect } from 'react';


import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';


import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import { navController } from 'stateManagement/navStateController';

import { WELLGRID } from '../../../graphQL/useQueryWellGrId12345';
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

///////props: -gridNumber//////////
///////       -label     //////////
export default function FilterGrid12345({ gridNumber, label }) {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);

	const [gridList, setGridList] = useState([]);
	const [getWellGrId12345, { loading, data }] = useLazyQuery(WELLGRID);

	let useEffectDependenciesArray = [stateNav.stateName, stateNav.countyName];

	for (let i = 1; i < gridNumber; i++) {
		useEffectDependenciesArray.push(stateNav[`GrId${i}`]);
	}

	useEffect(() => {
		if (!stateNav.stateName || !stateNav.countyName) {
			setGridList([]);
			setStateNav(stateNav => ({
				...stateNav,
				[`GrId${gridNumber}`]: null,
			}));
		} else {
			let whereFields = {
				State: stateNav.stateName,
				County: stateNav.countyName,
			};

			for (let i = 1; i < gridNumber; i++) {
				if (stateNav[`GrId${i}`]) {
					whereFields[`GrId${i}`] = stateNav[`GrId${i}`];
				}
			}

			getWellGrId12345({
				variables: {
					gridNumber,
					whereFields,
				},
			});
		}
	}, useEffectDependenciesArray);

	useEffect(() => {
		if (data) {
			if (data.WellGrId12345) {
				setGridList(data.WellGrId12345);
			} else {
				setGridList([]);
				setStateNav(stateNav => ({
					...stateNav,
					[`GrId${gridNumber}`]: null,
				}));
			}
		}
	}, [data]);

	const nullDesc = () => {
		let stateNavObj = { ...stateNav, filterGeography: null };
		let wellFiltersNull = [];
		for (let i = gridNumber + 1; i <= 5; i++) {
			stateNavObj[`GrId${i}`] = null;
			wellFiltersNull.push({ field: `GrId${i}`, value: null });
		}
		return { wellFiltersNull, stateNavObj };
	};

	const handleChange = ({ valueObj }) => {
		const { wellFiltersNull, stateNavObj } = nullDesc();
		if (valueObj === null) {
			navController.handleWellsFilters([...wellFiltersNull, { field: `GrId${gridNumber}`, value: null }]);
			setStateNav({
				...stateNavObj,
				[`GrId${gridNumber}`]: null,
			});
		} else {
			if (valueObj && valueObj[`GrId${gridNumber}`]) {
				navController.handleWellsFilters([
					...wellFiltersNull,
					{ field: `GrId${gridNumber}`, value: valueObj[`GrId${gridNumber}`] },
				]);
				setStateNav({
					...stateNavObj,
					[`GrId${gridNumber}`]: valueObj[`GrId${gridNumber}`],
				});
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
						variant: 'outlined',
						size: 'medium',
						disabled: !stateNav.countyName || gridList.length === 0,
						getCustomOptionLabel: option =>
							option && option[`GrId${gridNumber}`] ? option[`GrId${gridNumber}`] : option ? option : '',
					}}
					fieldAttributes={{
						label,
						optionArray: gridList,
						value: gridList.length === 0 ? '' : stateNav[`GrId${gridNumber}`],
					}}
					fieldEvents={{
						onChange: handleChange,
						onBlur: onEnterKey,
					}}
				/>
			)}
		</FormControl>
	);
}

FilterGrid12345.propTypes = {
	gridNumber: PropTypes.number.isRequired,
	label: PropTypes.string.isRequired,
};
