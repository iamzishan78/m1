import React, { useEffect } from 'react';

import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import moment from 'moment';
import PropTypes from 'prop-types';

import MRTFilterComponent from 'components/MRTTable/Common/MRTFilterComponent';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { CUSTOM_DATES } from 'utils/data';
import { handleCustomDateTypeChange } from 'utils/helper';

const useStyles = makeStyles(() => ({
	actionBar: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginBottom: 10,

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
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
		'& .MuiOutlinedInput-input': {
			// paddingLeft: "0px",
		},
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
	},
}));

const filterColumnsHeader = [
	{
		label: 'Campaign Stage',
		name: 'status',
	},
	{
		label: 'Supervisor',
		name: 'owner.name',
	},
];

export default function CustomDatesActivities({ setFromDate, setToDate, minDate, appliedDateFilters }) {
	const classes = useStyles();

	const getFlaggedMoment = moment => {
		return moment >= 10 ? moment : `0${moment}`;
	};

	const handleDateTypeChange = date => {
		handleCustomDateTypeChange(date, null, CUSTOM_DATES, setFromDate, setToDate, minDate, true);
	};

	useEffect(() => {
		if (minDate) {
			handleDateTypeChange(CUSTOM_DATES.ALL_DATES);
		}
	}, [minDate]);

	return (
		<div className={classes.actionBar}>
			<Grid container direction="row" display="flex" alignItems="center" spacing={3} style={{ padding: '0px 36px' }}>
				<Grid container alignItems="center" spacing={2}>
					<label className={classes.label}>Created Date</label>
					<Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
						<CustomAutoComplete
							fieldAttributes={{
								label: 'Date Range',
								value: CUSTOM_DATES.ALL_DATES,
								optionArray: Object.values(CUSTOM_DATES),
							}}
							fieldEvents={{
								onChange: ({ value }) => {
									if (value === null) {
										handleDateTypeChange('This Month');
									} else {
										handleDateTypeChange(value);
									}
								},
							}}
							fieldConfig={{
								variant: 'outlined',
								size: 'small',
								textfieldRestProps: {
									placeholder: '',
									style: { backgroundColor: 'white' },
								},
							}}
							id="custom-date-dropdown"
						/>
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
						<TextField
							style={{ marginTop: 0 }}
							size="small"
							margin="dense"
							type="date"
							variant="outlined"
							placeholder="from"
							fullWidth
							value={moment(appliedDateFilters.fromDate).format('yyyy-MM-DD')}
							className={classes.inputFieldDate}
							onChange={event => {
								if (event.target.value === '') {
									setFromDate(
										`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
									);
								} else {
									setFromDate(event.target.value);
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
					<Grid style={{ display: 'flex', alignItems: 'center', paddingBottom: '3px' }}>
						<label>to</label>
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
						<TextField
							style={{ marginTop: 0 }}
							size="small"
							margin="dense"
							type="date"
							variant="outlined"
							placeholder="to"
							fullWidth
							value={moment(appliedDateFilters.toDate).format('yyyy-MM-DD')}
							className={classes.inputFieldDate}
							onChange={event => {
								if (event.target.value === '') {
									setToDate(
										`${Math.round(new Date().getFullYear())}-${getFlaggedMoment(Math.ceil(new Date().getMonth()) + 1)}`
									);
								} else {
									setToDate(event.target.value);
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

					{filterColumnsHeader.map(filterColumn => (
						<Grid key={filterColumn.name} item xs={12} md={2}>
							<MRTFilterComponent tableKey="CampaignTable" filterColumn={filterColumn} />
						</Grid>
					))}
				</Grid>
			</Grid>
		</div>
	);
}

CustomDatesActivities.propTypes = {
	setFromDate: PropTypes.func.isRequired,
	setToDate: PropTypes.func.isRequired,
	minDate: PropTypes.string,
	appliedDateFilters: PropTypes.object.isRequired,
};
