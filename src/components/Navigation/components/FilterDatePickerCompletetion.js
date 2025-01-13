import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';

import { layerFiltersController } from 'hookstate/layerFiltersController';
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

export default function FilterDatePickerCompletetion({ labelDates }) {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { control } = useForm();

	useEffect(() => {
		const { completetionDateFrom, completetionDateTo } = stateNav;

		const value = {
			min: completetionDateFrom && new Date(completetionDateFrom).toISOString(),
			max: completetionDateTo && new Date(completetionDateTo).toISOString(),
		};

		if (!completetionDateFrom) {
			delete value.min;
		}
		if (!completetionDateTo) {
			delete value.max;
		}

		const type = 'date';

		navController.handleWellsFilters({ field: 'completionDate', value, type });
	}, [stateNav.completetionDateFrom, stateNav.completetionDateTo, setStateNav]);

	const handleStartDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			completetionDateFrom: date,
		}));
	};

	const handleEndDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			completetionDateTo: date,
		}));
	};

	return (
		<div className={classes.root}>
			<div className={classes.datesRow}>
				<Controller
					control={control}
					name="completetionDateFrom"
					defaultValue=""
					render={({ value, onChange }) => (
						<TextField
							type="date"
							label={`${labelDates} From`}
							className={`${classes.datePicker} ${stateNav.completetionDateFrom ? classes.blue : ''}`}
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
					name="completetionDateTo"
					defaultValue=""
					render={({ value, onChange }) => (
						<TextField
							type="date"
							label={`${labelDates} To`}
							className={`${classes.datePicker} ${stateNav.completetionDateTo ? classes.blue : ''}`}
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
