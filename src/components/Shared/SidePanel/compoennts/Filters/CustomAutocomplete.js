import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { useController } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';

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
 */
const CustomAutocomplete = ({
	defaultValue,
	name,
	control,
	options,
	label,
	className,
	onChange,
	isTextFieldOnly = false, // New prop to toggle behavior
	multiple = false, // New prop to enable multiselect
}) => {
	// Using the useController hook to bind the input to react-hook-form's control
	const { field } = useController({
		name, // Name of the field
		control, // The control object from react-hook-form
		defaultValue: defaultValue || (multiple ? [] : ''), // Provide a default value based on multiselect
	});

	// Conditionally render TextField when isTextFieldOnly is true
	if (isTextFieldOnly) {
		return (
			<TextField
				fullWidth
				label={label} // Display the label provided in props
				className={className} // Apply custom styles to the input field
				variant="standard" // MUI TextField variant
				value={field.value} // Controlled input value
				onChange={e => field.onChange(e.target.value)} // Update the form state on change
			/>
		);
	}

	// Default Autocomplete behavior with multiselect support
	return (
		<Autocomplete
			{...field}
			multiple={multiple} // Enable multiple selection if true
			options={options} // The options to show in the dropdown
			onChange={(e, v, r) => {
				onChange?.(e, v, r);
				field.onChange(v); // Update the form state with the selected value(s)
			}}
			value={(multiple && typeof field?.value === 'string' ? [field?.value] : field?.value) || (multiple ? [] : '')} // Controlled input for Autocomplete
			renderInput={params => (
				<TextField
					{...params}
					label={label} // Display the label provided in props
					className={className} // Apply custom styles to the input field
					variant="standard" // MUI TextField variant
				/>
			)}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip
						key={index}
						label={option}
						{...getTagProps({ index })}
						style={{
							backgroundColor: 'darkgray', // Background color for the Chip
							color: 'white', // Text color for the Chip
						}}
						deleteIcon={
							<CloseIcon style={{ color: 'white' }} /> // Custom color for the delete icon (cross)
						}
					/>
				))
			}
		/>
	);
};

export default CustomAutocomplete;
