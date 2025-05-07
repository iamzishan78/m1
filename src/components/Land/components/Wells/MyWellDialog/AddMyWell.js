import React, { useState, Fragment, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';

import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


import { useLazyQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { UPSERT_MY_WELL } from 'graphQL/useMutationUpsertMyWell';
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { tableGlobalController } from 'stateManagement/tableController';

import { wellParams } from './helpers';
import { addMyWellStyles as useStyles } from './styles';

function CurrencyFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandSeparator
			isNumericString
			prefix="$"
		/>
	);
}

CurrencyFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

function AddWellInterestDialog({ handleWellDetail, platformWell, showSearch }) {
	const classes = useStyles();

	const [foundWells, setFoundWells] = useState([]);
	const [upsertMyWell, { loading: upsertWellLoading, data: myWellData }] = useMutation(UPSERT_MY_WELL, {
		onCompleted: () => {
			tableGlobalController.refetch();
		},
	});
	const [getDbData] = useLazyQuery(GET_DB_DATA, {
		fetchPolicy: 'no-cache',
		onCompleted: wellsData => {
			if (wellsData?.getDbData?.hits) {
				setFoundWells(wellsData.getDbData.hits);
			}
		},
	});

	const { control, reset, getValues } = useForm();
	useEffect(() => {
		if (platformWell) {
			reset(platformWell);
		}
	}, [platformWell, reset]);

	useEffect(() => {
		if (myWellData) {
			const { wellData } = myWellData?.upsertMyWell?.myWell ?? {};
			const globalWellId = wellData?.Id ?? wellData?.id;
			if (globalWellId) {
				handleWellDetail({ Id: globalWellId });
			}
		}
	}, [myWellData]);

	// Function to check if saving is allowed based on the 'wellName' value
	const isSaveAllowed = formData => {
		const wellName = formData.wellName;
		// Check if 'wellName' is defined and not just whitespace after trimming
		return wellName && wellName?.trim() !== '';
	};

	const handleSave = formData => {
		if (!isSaveAllowed(formData)) {
			return;
		} // Check if saving is allowed using the isSaveAllowed function.
		const processedValues = {};
		Object.entries(formData).forEach(([key, value]) => {
			const param = wellParams.find(p => (p.esKey ?? p.key) === key);
			if (param) {
				// Handle date conversion if needed
				processedValues[key] = param.type === 'date' ? new Date(value) : value;
			}
		});
		upsertMyWell({
			variables: {
				myWell: { ...platformWell, _id: platformWell.id, ...processedValues },
			},
			refetchQueries: ['getDbData'],
			awaitRefetchQueries: true,
		});
	};

	return (
		<div style={{ padding: '10px 30px' }}>
			<div style={{ marginTop: '15px' }}>
				{showSearch && (
					<FormControl variant="outlined" fullWidth size="small">
						<CustomAutoComplete
							filterOptions={options => options}
							fieldAttributes={{
								label: 'Search for a well by name or API',
								value: platformWell.wellName ?? '',
								optionArray: foundWells ?? [],
							}}
							fieldConfig={{
								size: 'small',
								variant: 'outlined',
								disabled: !!upsertWellLoading,
								required: true,
								renderOptionComp: ({ option }) => (
									<Grid container spacing={0}>
										<Grid container item xs={11} alignItems="center">
											<Grid item xs>
												<Typography variant="body2">{option.WellName}</Typography>
												{option.ApiNumber && (
													<Typography variant="body2" color="textSecondary">
														{option.ApiNumber}
													</Typography>
												)}
											</Grid>
										</Grid>
										<Grid container item xs={1} alignItems="center">
											<Grid item style={{ position: 'relative' }}>
												<div
													className={classes.score}
													style={{
														zIndex: '1300',
														backgroundColor: '#12ABE0',
													}}
												/>
												<div
													className={classes.score}
													style={{
														zIndex: '1301',
														backgroundImage: 'repeating-linear-gradient(135deg, #ffffff , #ffffffb7 4.5%, #ffffff 15%)',
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
								),
							}}
							fieldEvents={{
								onChange: async ({ value }) => {
									await handleWellDetail(value);
								},
								onTextFieldChange: value => {
									getDbData({
										variables: {
											index: 'platformData:wells',
											pagination: {
												first: 50,
												after: null,
											},
											search: {
												query: `*${value}*`,
												fields: [
													'api.keyword',
													'wellName.keyword',
													'state.keyword',
													'county.keyword',
													'wellType.keyword',
													'wellStatus.keyword',
													'operator.keyword',
													'wellBoreProfile.keyword',
												],
												advanceSearch: [],
											},
											filters: [],
										},
									});
								},
							}}
						/>
					</FormControl>
				)}

				<h4>Selected well and lease information</h4>
				{wellParams.map(param => (
					<Fragment key={param.esKey}>
						<Controller
							control={control}
							name={param.esKey ?? param.key}
							render={({ field }) => (
								<TextField
									className={classes.textField}
									{...field}
									label={param.label}
									variant="outlined"
									margin="dense"
									InputLabelProps={{ shrink: true }}
									InputProps={{ 'data-testid': param.label }}
									fullWidth
									placeholder={param.key === 'wellName' ? 'Click to enter Well Name' : ''}
									defaultValue=""
									error={param.key === 'wellName' ? !field.value : false} // Mark field as error if validation fails
									helperText={!field.value ? (param.key === 'wellName' ? 'Enter a Well name to get started' : '') : ''}
									value={
										param.type === 'text'
											? field.value
											: field.value
												? moment(new Date(field.value)).format('MM/DD/YYYY') === 'Invalid date'
													? ''
													: moment(new Date(field.value)).format('MM/DD/YYYY')
												: ''
									}
									onChange={event => {
										const value = event.target.value.replace(/^\s+/, ''); // Remove only the leading whitespace
										field.onChange(value);
									}}
									onBlur={() => {
										const values = getValues();
										handleSave(values);
									}}
									disabled={upsertWellLoading}
								/>
							)}
						></Controller>
					</Fragment>
				))}
			</div>
		</div>
	);
}

AddWellInterestDialog.propTypes = {
	handleWellDetail: PropTypes.func.isRequired,
	platformWell: PropTypes.object.isRequired,
	showSearch: PropTypes.bool,
};

export default AddWellInterestDialog;
