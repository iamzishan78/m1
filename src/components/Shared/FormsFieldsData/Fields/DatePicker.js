import React from 'react';
import { Controller } from 'react-hook-form';

import { KeyboardDatePicker } from '@material-ui/pickers';

import { Grid } from '@mui/material';

const classes = {
	marginNormal: {
		marginTop: '0px',
		marginBottom: '0px',
		'& .MuiIconButton-label': {
			'& .MuiSvgIcon-root': {
				color: '#7f7f7f !important',
				fill: '#7f7f7f !important',
			},
		},
	},
};

function DatePicker({ control, item }) {
	const {
		// field props
		name,
		label,
		onBlur,
		onChange,
		disabled = false,
	} = item || {};

	return (
		<Grid item xs={12}>
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<KeyboardDatePicker
						className={classes.marginNormal}
						disableToolbar
						fullWidth
						disabled={disabled}
						label={label}
						inputVariant="outlined"
						variant="inline"
						format="MM/DD/YYYY"
						margin="normal"
						id={name}
						ref={field.ref}
						value={field.value || null}
						onChange={date => {
							onChange ? onChange(date) : field.onChange(date);
						}}
						onBlur={onBlur}
						KeyboardButtonProps={{ 'aria-label': 'change date' }}
					/>
				)}
			/>
		</Grid>
	);
}

export default DatePicker;
