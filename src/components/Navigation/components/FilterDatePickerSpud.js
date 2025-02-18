import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';

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

export default function FilterDatePickerSpud({ labelDates }) {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { control } = useForm();

	useEffect(() => {
		const { spudDateFrom, spudDateTo } = stateNav;

		const value = {
			min: spudDateFrom && new Date(spudDateFrom).toISOString(),
			max: spudDateTo && new Date(spudDateTo).toISOString(),
		};

		if (!spudDateFrom) {
			delete value.min;
		}
		if (!spudDateTo) {
			delete value.max;
		}

		const type = 'date';

		navController.handleWellsFilters({ field: 'spudDate', value, type });
	}, [stateNav.spudDateFrom, stateNav.spudDateTo, setStateNav]);

	const handleStartDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			spudDateFrom: date,
		}));
	};

	const handleEndDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			spudDateTo: date,
		}));
	};

	return (
		<div className={classes.root}>
			<div className={classes.datesRow}>
				<Controller
					control={control}
					name="spudDateFrom"
					defaultValue=""
					render={({ field: { value, onChange } }) => (
						<TextField
							type="date"
							label={`${labelDates} From`}
							className={`${classes.datePicker} ${stateNav.spudDateFrom ? classes.blue : ''}`}
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
					name="spudDateTo"
					defaultValue=""
					render={({ field: { value, onChange } }) => (
						<TextField
							type="date"
							label={`${labelDates} To`}
							className={`${classes.datePicker} ${stateNav.spudDateTo ? classes.blue : ''}`}
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
