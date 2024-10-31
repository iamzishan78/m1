import React, { useState, Fragment, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography } from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { wellParams } from './helpers';
import { addMyWellStyles as useStyles } from './styles';

import _ from "underscore";

import { UPSERT_MY_WELL } from "graphQL/useMutationUpsertMyWell";
import { useMutation } from "@apollo/client";
import { tableGlobalController } from "hookstate/tableController";
import { UPSERT_MY_WELL } from 'graphQL/useMutationUpsertMyWell';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

function NumberFormatCustom(props) {
	const { inputRef, onChange, name, ...other } = props;

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
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
function CurrencyFormatCustom(props) {
	const { inputRef, onChange, name, ...other } = props;

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
	const [getESSimpleSearch] = useLazyQuery(GET_ES_SIMPLE_SEARCH, {
		fetchPolicy: 'no-cache',
		onCompleted: wellsData => {
			if (wellsData?.getESSimpleSearch?.hits) setFoundWells(wellsData.getESSimpleSearch.hits);
		},
	});

	const { control, reset } = useForm();
	useEffect(() => {
		if (platformWell) reset(platformWell);
	}, [platformWell, reset]);

	useEffect(() => {
		if (myWellData) {
			const globalWellId = myWellData?.upsertMyWell?.myWell?.wellData?.Id;
			if (globalWellId) {
				handleWellDetail({ Id: globalWellId });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myWellData]);

	const handleSave = (key, value) => {
		upsertMyWell({
			variables: {
				myWell: { ...platformWell, _id: platformWell.id, [key]: value },
			},
			refetchQueries: ['getESSimpleSearch'],
			awaitRefetchQueries: true,
		});
	};

	return (
		<div style={{ padding: '10px 30px' }}>
			<div style={{ marginTop: '15px' }}>
				{showSearch && (
					<FormControl variant="outlined" fullWidth size="small">
						<Autocomplete
							options={foundWells || []}
							onChange={async (e, well) => {
								const myWell = await handleWellDetail(well);
								upsertMyWell({
									variables: { myWell },
									refetchQueries: ['getESSimpleSearch'],
									awaitRefetchQueries: true,
								});
							}}
							disabled={!!upsertWellLoading}
							value={platformWell}
							getOptionLabel={(option, value) => option.WellName}
							filterOptions={x => x}
							renderOption={option => {
								const parts = parse(option.WellName, []);

								return (
									<Grid container spacing={0}>
										<Grid container item xs={11} alignItems="center">
											<Grid item xs>
												{parts.map((part, index) => (
													<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
														{part.text}
													</span>
												))}

												{option && option.ApiNumber && (
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
								);
							}}
							renderInput={params => (
								<TextField
									margin="dense"
									{...params}
									required
									variant="outlined"
									data-testid={'well-search-field'}
									label="Search for a well by name or API"
									InputLabelProps={{ shrink: true }}
									onChange={event => {
										getESSimpleSearch({
											variables: {
												index: 'platformData:wells',
												pagination: {
													first: 50,
													after: null,
												},
												search: {
													query: `*${event.target.value}*`,
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
									}}
								/>
							)}
						/>
					</FormControl>
				)}

				<h4>Selected well and lease information</h4>
				{wellParams.map((param, index) => (
					<Fragment key={index}>
						<Controller
							control={control}
							name={param.esKey ?? param.key}
							render={params => (
								<TextField
									{...params}
									label={param.label}
									variant="outlined"
									margin="dense"
									InputLabelProps={{ shrink: true }}
									InputProps={{ 'data-testid': param.label }}
									fullWidth
									defaultValue=""
									value={
										param.type === 'text'
											? params.value
											: params.value
												? moment(new Date(params.value)).format('MM/DD/YYYY') === 'Invalid date'
													? ''
													: moment(new Date(params.value)).format('MM/DD/YYYY')
												: ''
									}
									onChange={event => {
										const value = event.target.value;
										params.onChange(value);
									}}
									onBlur={event => {
										const value = event.target.value;
										handleSave(param.esKey ?? param.key, param.type === 'date' ? new Date(value) : value);
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

export default AddWellInterestDialog;
