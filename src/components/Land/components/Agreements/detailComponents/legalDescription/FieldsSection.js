import { Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { makeStyles } from '@material-ui/styles';
import { get } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Components
const useStyles = makeStyles(theme => ({
	numberField: {
		'& .MuiOutlinedInput-root': {
			opacity: '0.7',
			borderRadius: '10px',
		},
		'& input[type=number]': {
			'-moz-appearance': 'textfield',
		},
		'& input[type=number]::-webkit-outer-spin-button': {
			'-webkit-appearance': 'none',
			margin: 0,
		},
		'& input[type=number]::-webkit-inner-spin-button': {
			'-webkit-appearance': 'none',
			margin: 0,
		},
	},
	fieldContainer: { opacity: 0.7 },
	fieldText: {
		fontSize: '15px',
		fontWeight: 'bold',
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			opacity: '0.7',
			color: 'dodgerblue',
			fontWeight: 'bold',
		},
	},
}));

const ChangeDetectionNumberField = ({
	name,
	label,
	control,
	offClickHandler,
	handleKeyDown,
	calculatedValues,
	isOverridden,
}) => {
	const classes = useStyles();
	return (
		<Controller
			control={control}
			name={name}
			defaultValue={0}
			render={params => {
				const isChanged =
					(calculatedValues[name] && params.value && parseFloat(params.value) !== parseFloat(calculatedValues[name])) ||
					isOverridden;
				return (
					<TextField
						type="number"
						label={label}
						variant="outlined"
						defaultValue={get(params, 'value', 0) || 0}
						value={get(params, 'value', 0)}
						onWheel={e => e.target.blur()}
						onBlur={event => offClickHandler(name, event.target.value)}
						onKeyDown={handleKeyDown}
						onChange={e => {
							params.onChange(e.target.value);
						}}
						className={isChanged ? classes.baseValueChanged : classes.numberField}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{isChanged && (
										<IconButton
											aria-label={`toggle ${name}`}
											onClick={() => {
												params.onChange(calculatedValues[name]);
												offClickHandler(name, calculatedValues[name]);
											}}
										>
											<AutorenewIcon fontSize="small" />
										</IconButton>
									)}
								</InputAdornment>
							),
						}}
						fullWidth
					/>
				);
			}}
		/>
	);
};

export default function LagalDescription({ agreementDetails = {}, updateAgreement, tractOwners }) {
	const classes = useStyles();
	const { reset, control } = useForm();

	const calculatedValues = useMemo(
		() => (agreementDetails.calculated ? agreementDetails.calculated : agreementDetails),
		[agreementDetails]
	);

	useEffect(() => {
		reset(agreementDetails);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agreementDetails]);

	const offClickHandler = (key, value) => {
		if (agreementDetails[key] === value) {
			return;
		}
		const fieldValue = {
			overridden: parseFloat(value) !== parseFloat(calculatedValues[key]),
			value,
		};
		if (tractOwners) {
			updateAgreement(key, fieldValue, key);
		} else {
			updateAgreement(key, value);
		}
	};

	const handleKeyDown = e => {
		if (e.keyCode === 38 || e.keyCode === 40) {
			e.preventDefault();
		}
	};

	return (
		<Grid container spacing={2} display="flex" direction="row" alignItems="center" justify="space-between">
			<Grid item xs={4}>
				<Controller
					control={control}
					name="legalDesctiption"
					defaultValue={agreementDetails?.legalDescription ?? ''}
					render={params => (
						<TextField
							{...params}
							label="Full Legal Description"
							variant="outlined"
							multiline
							rows={24}
							fullWidth
							className={classes.numberField}
							onBlur={event => offClickHandler('legalDesctiption', event.target.value)}
						/>
					)}
				/>
			</Grid>
			<Grid item xs={8}>
				<Grid container display="row" alignItems="center" justify="center" spacing={3}>
					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3}></Grid>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Total
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Developed
								</Typography>
							</Grid>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Undeveloped
								</Typography>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Report Gross
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="reportGrossAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.reportGrossAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="devReportGrossAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.devReportGrossAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="undevReportGrossAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.undevReportGrossAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Gross
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="grossAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.grossAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="devGrossAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.devGrossAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="undevGrossAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.undevGrossAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Report Net
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="reportNet"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.reportNet}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="devReportNet"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.devReportNet}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="undevReportNet"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.undevReportNet}
									calculatedValues={calculatedValues}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Net
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="netAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.netAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="devNetAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.devNetAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="undevNetAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.undevNetAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Company Net
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="companyNetAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.companyNetAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="devCompanyNetAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.devCompanyNetAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="undevCompanyNetAcres"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.undevCompanyNetAcres}
									calculatedValues={calculatedValues}
								/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={12}>
						<Grid container display="row" alignItems="center" justify="space-between" spacing={3}>
							<Grid item xs={3} className={classes.fieldContainer}>
								<Typography variant="h5" className={classes.fieldText}>
									Net Royalty Acres
								</Typography>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="netRoyalty"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.netRoyalty}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="devNetRoyalty"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.devNetRoyalty}
									calculatedValues={calculatedValues}
								/>
							</Grid>
							<Grid item xs={3}>
								<ChangeDetectionNumberField
									name="undevNetRoyalty"
									control={control}
									offClickHandler={offClickHandler}
									handleKeyDown={handleKeyDown}
									isOverridden={agreementDetails?.overridden?.undevNetRoyalty}
									calculatedValues={calculatedValues}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
