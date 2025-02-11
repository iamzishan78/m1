import React, { useEffect, useState } from 'react';

import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/styles';

import moment from 'moment';
import PropTypes from 'prop-types';

import { CUSTOM_DATES } from 'utils/data';
import { handleCustomDateTypeChange } from 'utils/helper';

const useStyles = makeStyles(() => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginTop: '100px',
	},
	actionsGrid: {
		marginTop: '6px',
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	dateRoot: {
		border: '1px solid #EBEBEB',
		backgroundColor: '#fff',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#fff',
		},
	},
	inputFieldDate: {
		'&.MuiFormControl-marginDense': {
			marginBottom: 8,
		},
		'& .MuiOutlinedInput-input': {
			// paddingLeft: "0px",
		},
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
	},
}));

// fromDate and toDate should be passed from the parent
export default function Portfolio({
	onChangeDates,
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	label,
	isProperties,
	lastCheckMinDate,
	onChange,
	defaultRange,
	setNull,
	datesInputWidth = 1,
	setAllDateToNull = true,
}) {
	const classes = useStyles();
	const [value, setValue] = useState(defaultRange ? defaultRange : CUSTOM_DATES.ALL_DATES);

	const handleDateTypeChange = date => {
		handleCustomDateTypeChange(
			date,
			onChange,
			CUSTOM_DATES,
			setFromDate,
			setToDate,
			lastCheckMinDate,
			setAllDateToNull
		);
	};

	useEffect(() => {
		if (!defaultRange) {
			handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
		}

		delete CUSTOM_DATES.THIS_WEEK;
		delete CUSTOM_DATES.LAST_WEEK;
	}, []);

	useEffect(() => {
		if (onChangeDates) {
			onChangeDates(fromDate, toDate);
		}
	}, [fromDate, toDate]);

	const getFlaggedMoment = moment => {
		return moment >= 10 ? moment : `0${moment}`;
	};

	// const getLastMonthStartDate = () => {
	//   return new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
	// }
	// const getLastMonthEndDate = () => {
	//   return new Date(new Date().getFullYear(), new Date().getMonth(), 0);
	// }

	useEffect(() => {
		if (lastCheckMinDate && !defaultRange) {
			handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
			setNull && setNull(false);
		}
	}, [lastCheckMinDate]);

	return (
		<>
			{label && (
				<Grid style={{ marginTop: '2px', padding: 0 }}>
					<label className={classes.label}>{label}</label>
				</Grid>
			)}
			<Grid item xs md={datesInputWidth} style={{ marginTop: '2px', maxWidth: '30%' }}>
				<Autocomplete
					size="small"
					value={value}
					onChange={(event, newValue) => {
						const newVal = newValue ? newValue : defaultRange ? defaultRange : CUSTOM_DATES.ALL_DATES;
						handleDateTypeChange(newVal);
						setValue(newVal);
					}}
					options={Object.values(CUSTOM_DATES).filter(value => {
						if (!isProperties && value === 'All Dates') {
							return false;
						} else {
							return true;
						}
					})}
					renderInput={params => (
						<TextField
							{...params}
							label="Check Date Range"
							variant="outlined"
							placeholder=""
							style={{ backgroundColor: 'white' }}
						/>
					)}
					defaultValue={defaultRange ? defaultRange : CUSTOM_DATES.ALL_DATES}
					disableListWrap
					id="custom-date-dropdown"
				/>
			</Grid>
			<Grid item xs md={datesInputWidth}>
				<TextField
					size="small"
					margin="dense"
					type="date"
					variant="outlined"
					placeholder="from"
					fullWidth
					value={moment(fromDate).format('yyyy-MM-DD')}
					className={classes.inputFieldDate}
					InputLabelProps={{
						shrink: true,
					}}
					InputProps={{
						classes: {
							root: classes.dateRoot,
							focused: classes.focused,
							notchedOutline: classes.notchedOutline,
						},
					}}
					onChange={event => {
						if (event.target.value === '') {
							setFromDate(
								`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
							);
						} else {
							const values = event.target.value.split('-');

							values[0] = +values[0] > 3000 ? values[0].substring(0, 4) : values[0];

							setFromDate(values.join('-'));
						}
					}}
				/>
			</Grid>
			<Grid>
				<label>to</label>
			</Grid>
			<Grid item xs md={datesInputWidth}>
				<TextField
					size="small"
					margin="dense"
					type="date"
					variant="outlined"
					placeholder="to"
					fullWidth
					value={moment(toDate).format('yyyy-MM-DD')}
					className={classes.inputFieldDate}
					onChange={event => {
						if (event.target.value === '') {
							setToDate(
								`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
							);
						} else {
							const values = event.target.value.split('-');

							values[0] = +values[0] > 3000 ? values[0].substring(0, 4) : values[0];

							setToDate(values.join('-'));
						}
					}}
					InputLabelProps={{
						shrink: true,
					}}
					InputProps={{
						classes: {
							root: classes.dateRoot,
							focused: classes.focused,
							notchedOutline: classes.notchedOutline,
						},
					}}
				/>
			</Grid>
		</>
	);
}

Portfolio.propTypes = {
	onChangeDates: PropTypes.func,
	fromDate: PropTypes.string.isRequired,
	setFromDate: PropTypes.func.isRequired,
	toDate: PropTypes.string.isRequired,
	setToDate: PropTypes.func.isRequired,
	label: PropTypes.string,
	isProperties: PropTypes.bool,
	lastCheckMinDate: PropTypes.string,
	onChange: PropTypes.func,
	defaultRange: PropTypes.string,
	setNull: PropTypes.func,
	datesInputWidth: PropTypes.number,
	setAllDateToNull: PropTypes.bool,
};
