import { IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';
import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { navController } from 'hookstate/navStateController';

import { NavigationContext } from '../NavigationContext';

const useStyles = makeStyles(() => ({
	root: {},
	datesRow: {
		display: 'flex',
		flexDirection: 'row',
		margin: '12px 0',
	},
	datePicker: {
		margin: '5px',
		'&& span': {
			pointerEvents: 'none',
		},
		'& .MuiIconButton-root': {
			padding: '10px 0px',
		},
		'& input::-webkit-calendar-picker-indicator': {
			filter: 'invert(1)',
		},
	},
	blue: {
		'& .MuiInputBase-input': { color: '#17AADD' },
	},
	dateRoot: {
		color: '#ffffff',
		'& input': {
			marginLeft: 12,
		},
	},
}));

export default function FilterDatePickerFirstProd({ labelDates }) {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { control } = useForm();

	useEffect(() => {
		const { firstProdDateFrom, firstProdDateTo } = stateNav;

		const value = {
			min: firstProdDateFrom && new Date(firstProdDateFrom).toISOString(),
			max: firstProdDateTo && new Date(firstProdDateTo).toISOString(),
		};

		if (!firstProdDateFrom) {
			delete value.min;
		}
		if (!firstProdDateTo) {
			delete value.max;
		}

		const type = 'date';

		navController.handleWellsFilters({ field: 'firstProductionDate', value, type });
	}, [stateNav.firstProdDateFrom, stateNav.firstProdDateTo, setStateNav]);

	const handleStartDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			firstProdDateFrom: date,
		}));
	};

	const handleEndDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			firstProdDateTo: date,
		}));
	};

	return (
		<div className={classes.root}>
			<div className={classes.datesRow}>
				<Controller
					control={control}
					name="prodDateFrom"
					defaultValue=""
					render={({ value, onChange }) => (
						<TextField
							type="date"
							label={`${labelDates} From`}
							className={`${classes.datePicker} ${stateNav.prodDateFrom ? classes.blue : ''}`}
							margin="dense"
							fullWidth
							value={value}
							onChange={date => {
								handleStartDate(date.target.value);
								onChange(date.target.value);
								return { value: date };
							}}
							InputLabelProps={{
								shrink: true,
							}}
							InputProps={{
								endAdornment: (
									<IconButton
										onClick={event => {
											handleStartDate(null);
											onChange(event);
										}}
									>
										<Clear style={{ height: 22, width: 22 }} />
									</IconButton>
								),
								classes: {
									root: classes.dateRoot,
								},
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="prodDateTo"
					defaultValue=""
					render={({ value, onChange }) => (
						<TextField
							type="date"
							label={`${labelDates} To`}
							className={`${classes.datePicker} ${stateNav.prodDateTo ? classes.blue : ''}`}
							margin="dense"
							fullWidth
							value={value}
							onChange={date => {
								handleEndDate(date.target.value);
								onChange(date.target.value);
								return { value: date };
							}}
							InputLabelProps={{
								shrink: true,
							}}
							InputProps={{
								endAdornment: (
									<IconButton
										onClick={event => {
											handleEndDate(null);
											onChange(event);
										}}
									>
										<Clear style={{ height: 22, width: 22 }} />
									</IconButton>
								),
								classes: {
									root: classes.dateRoot,
								},
							}}
						/>
					)}
				/>
			</div>
		</div>
	);
}
