import React from 'react';
import { Grid } from '@mui/material';

import { Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';

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

function StartEndDate({ control, item }) {
	const {
		// field props
		onBlur,
		onStartDateChange,
		onEndDateChange,
		disabled = false,
	} = item || {};

	return (
		<Grid container alignItems="center" spacing={2}>
			<Grid item xs={6}>
				<Controller
					control={control}
					name={'startDate'}
					render={props => (
						<KeyboardDatePicker
							className={classes.marginNormal}
							disableToolbar
							fullWidth
							disabled={disabled}
							label={'Start Date'}
							inputVariant="outlined"
							variant="inline"
							format="MM/DD/YYYY"
							margin="normal"
							id={'startDate'}
							ref={props.ref}
							value={props.value || null}
							onChange={date => {
								onStartDateChange ? onStartDateChange(date) : props.onChange(date);
							}}
							onBlur={onBlur}
							KeyboardButtonProps={{ 'aria-label': 'change date' }}
						/>
					)}
				/>
			</Grid>
			<Grid item xs={6}>
				<Controller
					control={control}
					name={'endDate'}
					render={props => (
						<KeyboardDatePicker
							className={classes.marginNormal}
							disableToolbar
							fullWidth
							disabled={disabled}
							label={'End Date'}
							inputVariant="outlined"
							variant="inline"
							format="MM/DD/YYYY"
							margin="normal"
							id={'endDate'}
							ref={props.ref}
							value={props.value || null}
							onChange={date => {
								onEndDateChange ? onEndDateChange(date) : props.onChange(date);
							}}
							onBlur={onBlur}
							KeyboardButtonProps={{ 'aria-label': 'change date' }}
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
}

export default StartEndDate;
