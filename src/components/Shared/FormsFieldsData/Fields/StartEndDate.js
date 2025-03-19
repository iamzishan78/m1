import React from 'react';

import { Grid } from '@mui/material';

import PropTypes from 'prop-types';

import CustomDatePicker from '../../components/Fields/CustomDatePicker';

function StartEndDate({ control, item, watch, error }) {
	const { onStartDateChange, onEndDateChange, disabled = false, required = false } = item || {};

	return (
		<Grid container alignItems="center" spacing={2} sx={{ pt: 3, pb: 1 }}>
			<Grid item xs={6}>
				<CustomDatePicker
					control={control}
					fieldAttributes={{
						name: 'startDate',
						label: 'Start Date',
					}}
					fieldConfig={{
						variant: 'standard',
						disabled,
						required,
					}}
					fieldEvents={{
						onChange: value => onStartDateChange(value.toDate()),
					}}
					error={required && !watch('startDate') && error}
				/>
			</Grid>
			<Grid item xs={6}>
				<CustomDatePicker
					control={control}
					fieldAttributes={{
						name: 'endDate',
						label: 'End Date',
					}}
					fieldConfig={{
						variant: 'standard',
						disabled,
						required,
					}}
					fieldEvents={{
						onChange: value => onEndDateChange(value.toDate()),
					}}
					error={required && !watch('endDate') && error}
				/>
			</Grid>
		</Grid>
	);
}

StartEndDate.propTypes = {
	control: PropTypes.object.isRequired,
	item: PropTypes.shape({
		onStartDateChange: PropTypes.func.isRequired,
		onEndDateChange: PropTypes.func.isRequired,
		disabled: PropTypes.bool,
		required: PropTypes.bool,
	}).isRequired,
	watch: PropTypes.func.isRequired,
	error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default StartEndDate;
