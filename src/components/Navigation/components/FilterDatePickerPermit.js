import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';

import moment from 'moment';

import { navController } from 'controllers/navStateController';

import { NavigationContext } from '../NavigationContext';

const useStyles = makeStyles(() => ({
	datesRow: {
		display: 'flex',
		flexDirection: 'row',
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

export default function FilterDatePickerPermit({ labelDates }) {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const { control } = useForm();

	useEffect(() => {
		const { permitDateFrom, permitDateTo } = stateNav;

		const value = {
			min: permitDateFrom && new Date(permitDateFrom).toISOString(),
			max: permitDateTo && new Date(permitDateTo).toISOString(),
		};

		if (!permitDateFrom) {
			delete value.min;
		}
		if (!permitDateTo) {
			delete value.max;
		}

		const type = 'date';

		navController.handleWellsFilters({ field: 'permitApprovedDate', value, type });
	}, [stateNav.permitDateFrom, stateNav.permitDateTo, setStateNav]);

	const handleStartDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			permitDateFrom: date,
		}));
	};

	const handleEndDate = date => {
		setStateNav(stateNav => ({
			...stateNav,
			permitDateTo: date,
		}));
	};

	return (
		<div className={classes.root}>
			<div className={classes.datesRow}>
				<Controller
					control={control}
					name="permitDateFrom"
					defaultValue=""
					render={({ field: { value, onChange } }) => (
						<TextField
							type="date"
							label={`${labelDates} From`}
							className={`${classes.datePicker} ${stateNav.permitDateFrom ? classes.blue : ''}`}
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
								inputProps: { max: moment().subtract(1, 'day').format('yyyy-MM-DD') },
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
					name="permitDateTo"
					defaultValue=""
					render={({ field: { value, onChange } }) => (
						<TextField
							type="date"
							label={`${labelDates} To`}
							className={`${classes.datePicker} ${stateNav.permitDateTo ? classes.blue : ''}`}
							margin="dense"
							fullWidth
							value={value}
							onChange={date => {
								handleEndDate(date.target.value);
								onChange(date.target.value);
							}}
							InputLabelProps={{
								shrink: true,
							}}
							disableToolbar
							KeyboardButtonProps={{ 'aria-label': 'change date' }}
							autoOk="true"
							format="MM/DD/YYYY"
							PopoverProps={{ disablePortal: false }}
							InputProps={{
								inputProps: { max: moment().format('yyyy-MM-DD') },
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
