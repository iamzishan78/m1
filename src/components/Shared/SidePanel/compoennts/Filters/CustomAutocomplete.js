import React from 'react';
import { useController } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';

import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField, Chip, IconButton } from '@mui/material';

import moment from 'moment';

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
		color: '#ffffff',
		'& input': {
			marginLeft: 8,
		},
		minWidth: '150px',
	},
}));

const CustomAutocomplete = ({
	defaultValue,
	name,
	control,
	options,
	label,
	className,
	onChange,
	isTextFieldOnly = false,
	searchText,
	handleChange,
	multiple = false,
	type,
}) => {
	const { field } = useController({
		name,
		control,
		defaultValue: defaultValue || (multiple ? [] : ''),
	});

	const classes = useStyles();

	if (type === 'date') {
		const handleDateChange = (key, value) => {
			const updatedValue = { ...field.value, [key]: value }; // Use `gte` or `lte` as keys
			field.onChange(updatedValue);
			onChange?.(updatedValue);
		};

		return (
			<div style={{ display: 'flex', gap: '4em' }}>
				<TextField
					type="date"
					label={'Date From'}
					value={field.value?.gte || ''}
					onChange={e => handleDateChange('gte', e.target.value)}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						inputProps: {
							max: moment().subtract(1, 'day').format('YYYY-MM-DD'),
						},
						endAdornment: field.value?.gte && (
							<IconButton onClick={() => handleDateChange('gte', '')}>
								<CloseIcon />
							</IconButton>
						),
						classes: {
							root: classes.dateRoot,
						},
					}}
					variant="standard"
					className={className}
				/>
				<TextField
					type="date"
					label={'Date To'}
					value={field.value?.lte || ''}
					onChange={e => handleDateChange('lte', e.target.value)}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						inputProps: {
							max: moment().format('YYYY-MM-DD'),
						},
						endAdornment: field.value?.lte && (
							<IconButton onClick={() => handleDateChange('lte', '')}>
								<CloseIcon />
							</IconButton>
						),
						classes: {
							root: classes.dateRoot,
						},
					}}
					variant="standard"
					className={className}
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
				<TextField
					type="number"
					label={'Min'}
					value={field.value?.[0] || ''}
					onChange={e => handleNumberChange(0, e.target.value)}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						classes: {
							root: classes.dateRoot, // Reusing dateRoot styles for consistency
						},
					}}
					variant="standard"
					className={className}
				/>
				<TextField
					type="number"
					label={'Max'}
					value={field.value?.[1] || ''}
					onChange={e => handleNumberChange(1, e.target.value)}
					InputLabelProps={{ shrink: true }}
					InputProps={{
						classes: {
							root: classes.dateRoot, // Reusing dateRoot styles for consistency
						},
					}}
					variant="standard"
					className={className}
				/>
			</div>
		);
	}

	if (isTextFieldOnly) {
		return (
			<TextField
				fullWidth
				label={label}
				className={className}
				variant="standard"
				value={field.value}
				onChange={e => field.onChange(e.target.value)}
			/>
		);
	}

	return (
		<Autocomplete
			{...field}
			multiple={multiple}
			options={options.filter(option => (multiple ? !field?.value?.includes(option) : true))}
			onChange={(e, v, r) => {
				onChange?.(e, v, r);
				field.onChange(v);
			}}
			value={(multiple && typeof field?.value === 'string' ? [field?.value] : field?.value) || (multiple ? [] : '')}
			renderInput={params => (
				<TextField
					{...params}
					label={label}
					className={className}
					value={searchText}
					variant="standard"
					onChange={e => {
						handleChange(e);
					}}
				/>
			)}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip
						key={index}
						label={option}
						{...getTagProps({ index })}
						style={{
							backgroundColor: 'darkgray',
							color: 'white',
						}}
						deleteIcon={<CloseIcon style={{ color: 'white' }} />}
					/>
				))
			}
		/>
	);
};

export default CustomAutocomplete;
