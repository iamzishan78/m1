import React from 'react';
import { useFieldArray, Controller, useWatch } from 'react-hook-form';

import {
	TextField,
	MenuItem,
	Button,
	Grid,
	IconButton,
	Checkbox,
	FormControlLabel,
	FormHelperText,
} from '@material-ui/core';

import DeleteIcon from '@mui/icons-material/Delete';

import PropTypes from 'prop-types';

import { entityKeyTypes } from 'components/MRTTable/utils/data';
import { removeSpaces } from 'components/MRTTable/utils/helper';

import { tableGlobalController } from 'hookstate/tableController';

const DynamicForm = ({ control, setValue, errors, clearErrors }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'fields',
	});

	// Use watch to observe the isControlColumn values for all fields
	const isControlColumns = useWatch({
		control,
		name: 'fields', // Watch the entire fields array
	});

	const { stateValues } = tableGlobalController.useState(['AssetCustomEntityDialog']);
	const { type, isAddEditAsset } = stateValues.AssetCustomEntityDialog || {};

	const isCreateAssetMode = type === 'addCustomAsset';

	// Check if any field has isControlColumn set to true
	const hasControlColumnSelected = isControlColumns.some(field => field.isControlColumn === true);

	return (
		<>
			{fields.map((field, index) => {
				return (
					<div key={field.id} style={{ marginBottom: '10px' }}>
						<Grid container spacing={2} alignItems="center" wrap="wrap">
							{field?._id && (
								<Controller
									name={`fields[${index}]._id`} // Track _id in form
									control={control}
									defaultValue={field._id || ''}
									render={({ field }) => <input type="hidden" {...field} />}
								/>
							)}
							<Grid item xs={3}>
								<Controller
									control={control}
									name={`fields[${index}].label`}
									render={({ field }) => (
										<>
											<TextField
												size="small"
												type="text"
												variant="outlined"
												value={field.value}
												inputRef={field.ref}
												onWheel={e => e.target.blur()}
												onChange={e => {
													field.onChange(e.target.value);
													const mappedKey = removeSpaces(e.target.value);
													setValue(`fields[${index}].mappingKey`, mappedKey);

													clearErrors(`fields.${index}.mappingKey`);
												}}
												label="Label"
												placeholder="Label"
												fullWidth
												defaultValue=""
												error={errors?.[index]?.['label']}
												disabled={!isCreateAssetMode}
											/>
											<FormHelperText error>{errors?.[index]?.['label']?.message || ' '}</FormHelperText>
										</>
									)}
								/>
							</Grid>
							<Grid item xs={3}>
								<Controller
									control={control}
									name={`fields[${index}].mappingKey`}
									render={({ field }) => (
										<>
											<TextField
												size="small"
												type="text"
												variant="outlined"
												value={field.value}
												inputRef={field.ref}
												onWheel={e => e.target.blur()}
												InputLabelProps={{ shrink: !!field.value }} // Ensure the label shrinks when there's a value
												onChange={e => {
													const mappedKey = removeSpaces(e.target.value);
													field.onChange(mappedKey);
												}}
												label="Key"
												placeholder="Key"
												fullWidth
												defaultValue=""
												error={errors?.[index]?.['mappingKey']}
												disabled={!isCreateAssetMode}
											/>
											<FormHelperText error>{errors?.[index]?.['mappingKey']?.message || ' '}</FormHelperText>
										</>
									)}
								/>
							</Grid>
							<Grid item xs={3}>
								<Controller
									control={control}
									name={`fields[${index}].keyType`}
									render={({ field }) => (
										<>
											<TextField
												select
												size="small"
												type="text"
												variant="outlined"
												value={field.value}
												inputRef={field.ref}
												onWheel={e => e.target.blur()}
												onChange={e => {
													field.onChange(e.target.value);
												}}
												label="Key type"
												placeholder="Key type"
												fullWidth
												defaultValue=""
												error={errors?.[index]?.['keyType']}
												disabled={!isCreateAssetMode}
											>
												{entityKeyTypes.map(option => (
													<MenuItem key={option.value} value={option.value}>
														{option.label}
													</MenuItem>
												))}
											</TextField>
											<FormHelperText error>{errors?.[index]?.['keyType']?.message || ' '}</FormHelperText>
										</>
									)}
								/>
							</Grid>
							{isCreateAssetMode && fields.length > 1 && (
								<Grid item xs={1}>
									<IconButton size="small" onClick={() => remove(index)} disabled={!isCreateAssetMode}>
										<DeleteIcon />
									</IconButton>
								</Grid>
							)}
						</Grid>
						<Grid container spacing={2} alignItems="center" wrap="wrap">
							{isAddEditAsset && (
								<Grid item xs={2}>
									<Controller
										control={control}
										name={`fields[${index}].isSummaryField`}
										render={({ field }) => (
											<FormControlLabel
												control={
													<Checkbox
														checked={!!field.value}
														onChange={e => field.onChange(e.target.checked)}
														color="primary"
													/>
												}
												label="Summary Field"
											/>
										)}
									/>
								</Grid>
							)}

							<Grid item xs={2}>
								<Controller
									control={control}
									name={`fields[${index}].isControlColumn`}
									render={({ field }) => (
										<FormControlLabel
											control={
												<Checkbox
													checked={!!field.value}
													onChange={e => {
														field.onChange(e.target.checked);
														setValue(`fields[${index}].isRequired`, e.target.checked);
													}}
													color="primary"
													disabled={hasControlColumnSelected && !field.value} // Disable if another control column is selected
												/>
											}
											label="Control Column"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={2}>
								<Controller
									control={control}
									name={`fields[${index}].isGridDisplayed`}
									defaultValue={field.isGridDisplayed ?? true}
									render={({ field }) => (
										<FormControlLabel
											control={
												<Checkbox
													checked={!!field.value}
													onChange={e => field.onChange(e.target.checked)}
													color="primary"
												/>
											}
											label="Grid Column"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={2}>
								<Controller
									control={control}
									name={`fields[${index}].isDialogDisplayed`}
									defaultValue={field.isDialogDisplayed ?? true}
									render={({ field }) => {
										return (
											<FormControlLabel
												control={
													<Checkbox
														checked={!!field.value}
														onChange={e => field.onChange(e.target.checked)}
														color="primary"
													/>
												}
												label="Dialog Field"
											/>
										);
									}}
								/>
							</Grid>
							<Grid item xs={2}>
								<Controller
									control={control}
									name={`fields[${index}].isRequired`}
									defaultValue={field.isRequired ?? false}
									render={({ field }) => (
										<FormControlLabel
											control={
												<Checkbox
													checked={!!field.value}
													onChange={e => field.onChange(e.target.checked)}
													color="primary"
													disabled={isControlColumns[index]?.isControlColumn} // Disable when Control Column is selected
												/>
											}
											label="Required"
										/>
									)}
								/>
							</Grid>
						</Grid>
					</div>
				);
			})}
			{!!isCreateAssetMode && (
				<Button
					variant="contained"
					color="secondary"
					onClick={() =>
						append({
							_id: '',
							mappingKey: '',
							keyType: '',
							label: '',
							isSummaryField: false,
							isControlColumn: false,
							isGridDisplayed: true,
							isDialogDisplayed: true,
							isRequired: false,
						})
					}
					disabled={!isCreateAssetMode}
				>
					Add Field
				</Button>
			)}
		</>
	);
};

DynamicForm.propTypes = {
	control: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
};

export default DynamicForm;
