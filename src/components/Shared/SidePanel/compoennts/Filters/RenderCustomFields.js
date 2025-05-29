import React from 'react';
import { useController } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import CustomDatePicker from 'components/Shared/components/Fields/CustomDatePicker';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';

/**
 * CustomAutocomplete component integrates MUI Autocomplete with react-hook-form using useController.
 *
 * @param {string} name - The name of the form field (used by react-hook-form).
 * @param {object} control - The react-hook-form control object for managing form state.
 * @param {Array} options - The array of options to display in the Autocomplete dropdown.
 * @param {string} label - The label to display for the Autocomplete input field.
 * @param {string} className - Additional class styles for the input field.
 * @param {boolean} isTextFieldOnly - If true, the component will behave as a TextField and not show dropdown options.
 * @param {boolean} multiple - If true, allows the user to select multiple options.
 * @param {string} type - The type of the field (e.g., "date" for date pickers).
 */

const useStyles = makeStyles(() => ({
	datesRow: {
		display: 'flex',
		flexDirection: 'row',
	},
	datePicker: {
		margin: '5px',
		'& .MuiInputLabel-root': {
			color: 'white', // Change the label color to white
		},
		'& .MuiInputLabel-root.Mui-focused': {
			color: 'white', // Ensure it remains white when focused
		},
		'&& span': {
			pointerEvents: 'none',
		},
		'& .MuiIconButton-root': {
			padding: '10px 0px',
		},
		'& input::-webkit-calendar-picker-indicator': {
			filter: 'invert(1)',
		},
	},
	blue: {
		'& .MuiInputBase-input': { color: '#17AADD' },
	},
	dateRoot: {
		color: '#ffffff !important',
		'& input': {
			marginLeft: 8,
		},
		minWidth: '150px',
	},
}));

const RenderCustomFields = ({
	defaultValue,
	name,
	control,
	watch,
	options,
	label,
	className,
	onChange,
	isTextFieldOnly = false,
	searchText,
	handleChange,
	multiple = false,
	type,
	isSearch,
	setFieldNameObj,
}) => {
	const { field } = useController({
		name,
		control,
		defaultValue: defaultValue || (multiple ? [] : ''),
	});

	const classes = useStyles();

	// label === 'Field Name' && console.log({ type });

	if (type === 'date') {
		const handleDateChange = (key, value) => {
			const updatedValue = { ...field.value, [key]: value }; // Use `gte` or `lte` as keys
			field.onChange(updatedValue);
			onChange?.(updatedValue);
		};

		return (
			<div style={{ display: 'flex', gap: '3em' }}>
				<CustomDatePicker
					fieldConfig={{
						variant: 'standard',
					}}
					fieldAttributes={{
						label: 'Date From',
						value: field.value?.gte || '1970-01-01',
						InputLabelProps: { shrink: true },
					}}
					fieldEvents={{
						onChange: value => handleDateChange('gte', value),
					}}
					style={{ width: '160px' }}
					className={className}
					InputProps={{
						inputProps: {
							max: moment().subtract(1, 'day').format('YYYY-MM-DD'),
						},
						classes: {
							root: classes.dateRoot,
						},
					}}
				/>

				<CustomDatePicker
					fieldConfig={{
						variant: 'standard',
					}}
					fieldAttributes={{
						label: 'Date To',
						value: field.value?.lte || moment().format('YYYY-MM-DD'),
						InputLabelProps: { shrink: true },
					}}
					fieldEvents={{
						onChange: value => handleDateChange('lte', value),
					}}
					style={{ width: '160px' }}
					className={className}
					InputProps={{
						inputProps: {
							max: moment().format('YYYY-MM-DD'),
						},
						classes: {
							root: classes.dateRoot,
						},
					}}
				/>
			</div>
		);
	}

	if (type === 'range') {
		// Handle changes for min and max fields
		const handleNumberChange = (index, value) => {
			const updatedValue = [...(field.value || [])]; // Ensure the array is initialized
			updatedValue[index] = value; // Update the specific index (0 for "min", 1 for "max")
			field.onChange(updatedValue);
			onChange?.(updatedValue);
		};

		return (
			<div style={{ display: 'flex', gap: '4em' }}>
				<CustomTextField
					fieldConfig={{
						type: 'number',
						variant: 'standard',
						customStyleClass: className,
					}}
					fieldAttributes={{
						label: 'Min',
						value: field.value?.[0] || '',
						InputLabelProps: { shrink: true },
						InputProps: {
							classes: {
								root: classes.dateRoot,
							},
						},
					}}
					fieldEvents={{
						onChange: value => handleNumberChange(0, value),
					}}
				/>

				<CustomTextField
					fieldConfig={{
						type: 'number',
						variant: 'standard',
						customStyleClass: className,
					}}
					fieldAttributes={{
						label: 'Max',
						value: field.value?.[1] || '',
						InputLabelProps: { shrink: true },
						InputProps: {
							classes: {
								root: classes.dateRoot,
							},
						},
					}}
					fieldEvents={{
						onChange: value => handleNumberChange(1, value),
					}}
				/>
			</div>
		);
	}

	if (isTextFieldOnly) {
		return (
			<CustomTextField
				control={control}
				watch={watch}
				fieldConfig={{
					fullWidth: true,
					variant: 'standard',
					customStyleClass: className,
				}}
				fieldAttributes={{
					label,
					name,
				}}
			/>
		);
	}

	return (
		<CustomAutoComplete
			control={control}
			watch={watch}
			fieldConfig={{
				multiple: multiple,
				variant: 'standard',
				inputClassName: className,
				chipStyles: {
					backgroundColor: 'darkgray',
					color: 'white',
				},
			}}
			fieldAttributes={{
				label,
				name,
				optionArray: options,
				inputSearchText: searchText,
			}}
			fieldEvents={{
				onChange: ({ value, oldValue }) => {
					handleChange('');
					onChange?.({ value, previousValue: oldValue });
					const option = options.find(opt => opt.value === value);
					setFieldNameObj(option);
				},
				onTextFieldChange: value => isSearch && handleChange(value),
			}}
		/>
	);
};

RenderCustomFields.propTypes = {
	defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
	name: PropTypes.string,
	control: PropTypes.object,
	watch: PropTypes.func,
	options: PropTypes.array,
	label: PropTypes.string,
	className: PropTypes.string,
	onChange: PropTypes.func,
	isTextFieldOnly: PropTypes.bool,
	searchText: PropTypes.string,
	handleChange: PropTypes.func,
	multiple: PropTypes.bool,
	type: PropTypes.string,
	isSearch: PropTypes.bool,
	setFieldNameObj: PropTypes.func,
};

export default RenderCustomFields;
