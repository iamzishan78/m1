import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Grid, makeStyles, Typography, TextField, IconButton, FormControl, InputLabel } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import _ from 'lodash';
import moment from 'moment';

import { StyledTextField } from '../style';

const useStyles = makeStyles(() => ({
	fieldContainer: {
		opacity: 0.7,
		maxWidth: '30%',
		'flex-basis': '30%',
		'& .MuiTextField-root': {
			marginTop: '18px !important',
		},
		'& .MuiInputBase-root': {
			border: '1px solid black',
		},
		'& .MuiOutlinedInput-root': {
			borderRadius: '6px',
		},
	},
	secondaryFieldContainer: {
		maxWidth: '23%',
		'flex-basis': '23%',
	},
	fieldText: {
		fontSize: '15px',
		fontWeight: 'bold',
	},
	acreageCard: {
		backgroundColor: '#F6F8F9',
		// paddingTop: "10px",
		marginTop: '8px',
		marginBottom: '8px',
		'& .heading': {
			fontWeight: 'bold',
			fontSize: 'larger',
		},
		'& .MuiGrid-item': {
			padding: '0px 5px',
			marginTop: '20px',
			'& .MuiInputBase-root': {
				height: '41px !important',
				backgroundColor: '#fff',
			},
		},
	},
	mainCard: {
		paddingLeft: '5px',
	},
	lastChild: {
		marginBottom: '40px',
	},
}));

const Acreage = ({ properties, updateAgreement }) => {
	const { control, reset, watch } = useForm();
	const classes = useStyles();

	useEffect(() => {
		if (!_.isEmpty(properties)) {
			reset(properties);
		}
	}, [properties, reset]);

	const offClickHandler = (key, value) => {
		updateAgreement(key, value);
	};

	return (
		<Grid item md={12} className={classes.acreageCard}>
			<Grid className={classes.mainCard} container display="row" alignItems="center">
				<Grid item xs={11} style={{ marginTop: 0 }}>
					<Grid container display="row" alignItems="center" justifyContent="space-between" spacing={3}>
						<Grid item xs={12}>
							<Typography className="heading">Recording Information</Typography>
						</Grid>
					</Grid>
				</Grid>

				<Grid item xs={11} style={{ marginTop: 0 }}>
					<Grid container display="row" alignItems="center" justifyContent="space-between">
						<Grid item xs={3} className={classes.fieldContainer}>
							<Controller
								control={control}
								name="recordedDate"
								defaultValue=""
								render={({ field }) => (
									<FormControl variant="standard" fullWidth>
										<InputLabel shrink>Recorded Date</InputLabel>
										<TextField
											autoOk
											type="date"
											variant="outlined"
											margin="dense"
											fullWidth
											value={field.value ? moment(watch('recordedDate')).utc(true).format('yyyy-MM-DD') : ''}
											InputLabelProps={{
												shrink: true,
											}}
											onBlur={event => {
												offClickHandler('recordedDate', event?.target?.value || null);
											}}
											onChange={field.onChange}
											disableToolbar
											KeyboardButtonProps={{ 'aria-label': 'change date' }}
											format="MM/DD/YYYY"
											PopoverProps={{ disablePortal: false }}
											InputProps={{
												endAdornment: (
													<IconButton>
														<Clear
															style={{ height: 22, width: 22 }}
															onClick={() => {
																field.onChange(null);
																// reset({ ...getValues(), recordedDate: null });
																offClickHandler('recordedDate', null);
															}}
														/>
													</IconButton>
												),
												classes: {
													root: classes.dateRoot,
												},
											}}
										/>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid item xs={3} className={classes.secondaryFieldContainer}>
							<Controller
								control={control}
								name="recordedBook"
								defaultValue=""
								render={({ field }) => (
									<StyledTextField
										{...field}
										label="Book"
										onBlur={event => {
											offClickHandler('recordedBook', event?.target?.value || null);
										}}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={3} className={classes.secondaryFieldContainer}>
							<Controller
								control={control}
								name="recordedPage"
								defaultValue=""
								render={({ field }) => (
									<StyledTextField
										{...field}
										label="Page"
										onBlur={event => {
											offClickHandler('recordedPage', event?.target?.value || null);
										}}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={3} className={classes.secondaryFieldContainer}>
							<Controller
								control={control}
								name="recordedInstrumentNumber"
								defaultValue=""
								render={({ field }) => (
									<StyledTextField
										{...field}
										label="Instrument #"
										onBlur={event => {
											offClickHandler('recordedInstrumentNumber', event?.target?.value || null);
										}}
									/>
								)}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Acreage;
