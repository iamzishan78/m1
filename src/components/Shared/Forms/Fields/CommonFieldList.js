import React, { Fragment, useState } from 'react';
import { Controller } from 'react-hook-form';

import { Grid, IconButton, InputAdornment, MenuItem, Select, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { get } from 'lodash';

import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import DateField from 'components/Shared/components/Fields/DateField';
import NumberField from 'components/Shared/components/Fields/NumberField';
import ReactSelectField from 'components/Shared/M1nTable/components/SubComponents/ReactSelectField';

const useStyles = makeStyles(theme => ({
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

	return fields.map((field, index) => {
		const fieldKey = (field.key || field.esKey).replaceAll('.keyword', '');

		const handleEdit = () => {
			window.setStateApp(stateApp => ({
				...stateApp,
				selectedMeta: field,
				showFieldModal: true,
			}));
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
				key={index + field.label + fieldKey}
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
					<Fragment key={index}>
						{(field.type === 'text' ||
							field.type === 'number' ||
							field.type === 'date' ||
							field.type === 'dropdown' ||
							field.type === 'multiselect' ||
							field.type === 'select') && (
							<Controller
								key={fieldKey}
								control={control}
								name={fieldKey}
								render={params => {
									return (
										<Fragment>
											{field.type === 'text' && (
												<CustomTextField
													{...params}
													id={`field-${fieldKey}`}
													index={index}
													fieldKey={fieldKey}
													field={field}
													defaultValue={get(data, `${fieldKey}`, '')}
													showLinkPopup={true}
													offClickHandler={(key, value) => {
														offClickHandler(key, value);
													}}
													InputProps={{
														...field.InputProps,
														endAdornment,
													}}
													props={{
														className: classes.text,
													}}
												/>
											)}
											{field.type === 'number' && (
												<NumberField
													{...params}
													id={`field-${fieldKey}`}
													index={index}
													fieldKey={fieldKey}
													field={field}
													defaultValue={get(data, `${fieldKey}`, '')}
													offClickHandler={(key, value) => {
														offClickHandler(key, value);
													}}
													InputProps={{
														...field.InputProps,
														endAdornment,
													}}
													props={{
														className: classes.text,
													}}
												/>
											)}
											{field.type === 'date' && (
												<DateField
													{...params}
													id={`field-${fieldKey}`}
													index={index}
													field={field}
													fieldKey={fieldKey}
													defaultValue={get(data, `${fieldKey}`, '')}
													offClickHandler={(key, value) => {
														offClickHandler(key, value);
													}}
													InputProps={{
														...field.InputProps,
														endAdornment,
													}}
													props={{
														className: classes.text,
													}}
												/>
											)}
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
													{...params}
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
														<MenuItem value={option.value ? option.value : option}>
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

export default CommonFieldList;
