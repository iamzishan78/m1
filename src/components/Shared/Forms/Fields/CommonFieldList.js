import React, { Fragment, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, IconButton, InputAdornment, MenuItem, Select, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { get } from 'lodash';
import PropTypes from 'prop-types';

import ReactSelectField from 'components/MRTTable/Common/Components/ReactSelectField';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';

import { globalStateController } from 'stateManagement/globalStateController';

const useStyles = makeStyles(() => ({
	text: {
		'& div': {
			paddingRight: 0,
		},
	},
}));

const CommonFieldList = ({ data, fields, control, offClickHandler = () => {} }) => {
	const classes = useStyles();

	const [isHovered, setIsHovered] = useState(false);

	if (!fields || fields.length === 0) {
		return null;
	}

	return fields.map(field => {
		const fieldKey = (field.key || field.esKey).replaceAll('.keyword', '');

		const handleEdit = () => {
			globalStateController.updateState?.({
				showFieldModal: true,
				selectedMeta: field,
			});
		};

		const isMetaField = field._id && field.category;

		const endAdornment =
			isMetaField && isHovered === field._id ? (
				<InputAdornment position="end">
					<IconButton aria-label="Edit Meta" style={{ padding: '6px' }} onClick={handleEdit}>
						<EditIcon />
					</IconButton>
				</InputAdornment>
			) : undefined;

		return (
			<Grid
				item
				xs={4}
				key={field.label + fieldKey}
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
			>
				<Grid item xs={3}>
					<div style={{ wordBreak: 'break-word' }}>{fieldKey !== 'approvalStatus' && field.label}</div>
				</Grid>

				<Grid
					item
					xs={8}
					onMouseEnter={() => {
						setIsHovered(field._id);
					}}
					onMouseLeave={() => {
						setIsHovered(false);
					}}
				>
					<Fragment key={fieldKey}>
						{field.type === 'text' && (
							<CustomTextField
								id={`field-${fieldKey}`}
								control={control}
								fieldConfig={{
									margin: 'dense',
									variant: 'outlined',
									size: 'small',
									disabled: field?.disabled,
									customStyleClass: classes.text,
								}}
								fieldAttributes={{
									name: field.key,
									defaultValue: get(data, `${fieldKey}`, ''),
									InputProps: {
										...field.InputProps,
										endAdornment,
									},
								}}
								fieldEvents={{
									onBlur: value => offClickHandler(fieldKey, value),
								}}
							/>
						)}
						{field.type === 'number' && (
							<CustomTextField
								id={`field-${fieldKey}`}
								control={control}
								fieldConfig={{
									margin: 'dense',
									variant: 'outlined',
									size: 'small',
									type: 'number',
									disabled: field?.disabled,
									customStyleClass: classes.text,
								}}
								fieldAttributes={{
									name: field.key,
									defaultValue: get(data, `${fieldKey}`, ''),
									InputProps: {
										...field.InputProps,
										endAdornment,
									},
								}}
								fieldEvents={{
									onBlur: value => offClickHandler(fieldKey, value),
								}}
							/>
						)}
						{field.type === 'date' && (
							<CustomDatePicker
								control={control}
								fieldAttributes={{
									name: fieldKey,
									value: get(data, `${fieldKey}`, ''),
								}}
								fieldConfig={{
									size: 'small',
									overrideEndAdornment: true,
								}}
								fieldEvents={{
									onChange: newValue => {
										offClickHandler?.(fieldKey, newValue?.toDate());
									},
								}}
								InputProps={{
									endAdornment,
								}}
							/>
						)}
						{(field.type === 'dropdown' || field.type === 'multiselect' || field.type === 'select') && (
							<Controller
								key={fieldKey}
								control={control}
								name={fieldKey}
								render={params => {
									return (
										<Fragment>
											{field.type === 'dropdown' && (
												<div
													style={{
														margin: '8px 0px 4px',
													}}
												>
													<ReactSelectField
														id={`field-${field.title}`}
														isSingleSelect={true}
														fullWidth
														variant="outlined"
														dropdownOptions={field.dropdownOptions}
														column={field}
														onCustomKeyChange={value => {
															offClickHandler(fieldKey, value, field.isCustom);
														}}
														disabled={field.disabled}
														value={get(data, `${fieldKey}`, '')}
														minHeight=""
													/>
												</div>
											)}
											{field.type === 'select' && (
												<Select
													{...params.field}
													id={`field-${fieldKey}`}
													variant="outlined"
													fullWidth
													InputLabelProps={{
														shrink: true,
													}}
													style={{ margin: '8px 0px 4px' }}
													onChange={event => offClickHandler(fieldKey, event.target.value, field.isCustom)}
													disabled={field.disabled}
													value={get(data, `${fieldKey}`, '')}
												>
													{field.dropdownOptions.map(option => (
														<MenuItem
															key={option.value ? option.value : option}
															value={option.value ? option.value : option}
														>
															{option.label ? option.label : option}
														</MenuItem>
													))}
												</Select>
											)}
											{field.type === 'multiselect' && (
												<div
													style={{
														margin: '8px 0px 4px',
													}}
												>
													<ReactSelectField
														id={`field-${fieldKey}`}
														variant="outlined"
														margin="dense"
														fullWidth
														dropdownOptions={field.dropdownOptions}
														column={field}
														value={get(data, `${fieldKey}`) ?? []}
														onCustomKeyChange={value => {
															offClickHandler(fieldKey, value, field.isCustom);
														}}
														minHeight=""
													/>
												</div>
											)}
										</Fragment>
									);
								}}
							/>
						)}
					</Fragment>
				</Grid>
			</Grid>
		);
	});
};

CommonFieldList.propTypes = {
	control: PropTypes.object,
	data: PropTypes.object,
	fields: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.oneOf(['text', 'number', 'date', 'dropdown', 'multiselect']),
			key: PropTypes.string,
			label: PropTypes.string,
			disabled: PropTypes.bool,
			InputProps: PropTypes.object,
			dropdownOptions: PropTypes.arrayOf(
				PropTypes.shape({
					value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
					label: PropTypes.string,
				})
			),
		})
	),
	classes: PropTypes.object,
	endAdornment: PropTypes.node,
	offClickHandler: PropTypes.func,
};

export default CommonFieldList;
