import React from 'react';
import { useFieldArray, Controller, useWatch } from 'react-hook-form';
import { TextField, MenuItem, Button, Grid, IconButton, Checkbox, FormControlLabel } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import { entityKeyTypes } from 'components/MRTTable/utils/data';
import { removeSpacesAndLowercase } from 'components/MRTTable/utils/helper';
import { tableGlobalController } from 'hookstate/tableController';

const DynamicForm = ({ control, setValue }) => {
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
									render={props => (
										<TextField
											size="small"
											type="text"
											variant="outlined"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
												const mappedKey = removeSpacesAndLowercase(e.target.value);
												setValue(`fields[${index}].mappingKey`, mappedKey);
											}}
											label="Label"
											placeholder="Label"
											fullWidth
											defaultValue=""
											disabled={!isCreateAssetMode}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={3}>
								<Controller
									control={control}
									name={`fields[${index}].mappingKey`}
									render={props => (
										<TextField
											size="small"
											type="text"
											variant="outlined"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											InputLabelProps={{ shrink: !!props.value }} // Ensure the label shrinks when there's a value
											onChange={e => {
												const mappedKey = removeSpacesAndLowercase(e.target.value);
												props.onChange(mappedKey);
											}}
											label="Key"
											placeholder="Key"
											fullWidth
											defaultValue=""
											disabled={!isCreateAssetMode}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={3}>
								<Controller
									control={control}
									name={`fields[${index}].keyType`}
									render={props => (
										<TextField
											select
											size="small"
											type="text"
											variant="outlined"
											value={props.value}
											inputRef={props.ref}
											onWheel={e => e.target.blur()}
											onChange={e => {
												props.onChange(e.target.value);
											}}
											label="Key type"
											placeholder="Key type"
											fullWidth
											defaultValue=""
											disabled={!isCreateAssetMode}
										>
											{entityKeyTypes.map(option => (
												<MenuItem key={option.value} value={option.value}>
													{option.label}
												</MenuItem>
											))}
										</TextField>
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
										render={props => (
											<FormControlLabel
												control={
													<Checkbox
														checked={!!props.value}
														onChange={e => props.onChange(e.target.checked)}
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
									render={props => (
										<FormControlLabel
											control={
												<Checkbox
													checked={!!props.value}
													onChange={e => props.onChange(e.target.checked)}
													color="primary"
													disabled={hasControlColumnSelected && !props.value} // Disable if another control column is selected
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
									render={props => (
										<FormControlLabel
											control={
												<Checkbox
													checked={!!props.value}
													onChange={e => props.onChange(e.target.checked)}
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
									render={props => {
										return (
											<FormControlLabel
												control={
													<Checkbox
														checked={!!props.value}
														onChange={e => props.onChange(e.target.checked)}
														color="primary"
													/>
												}
												label="Dialog Field"
											/>
										);
									}}
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
export default DynamicForm;
