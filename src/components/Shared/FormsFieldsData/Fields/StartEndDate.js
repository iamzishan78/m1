import { KeyboardDatePicker } from '@material-ui/pickers';
import { Grid } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

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

function StartEndDate({ control, item, watch, error }) {
	const {
		// field props
		onBlur,
		onStartDateChange,
		onEndDateChange,
		disabled = false,
		required = false,
	} = item || {};

	const watchStartDate = watch('startDate');
	const watchEndDate = watch('endDate');

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
							error={required && !watchStartDate && error}
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
							error={required && !watchEndDate && error}
						/>
					)}
				/>
			</Grid>
		</Grid>
	);
}

export default StartEndDate;
