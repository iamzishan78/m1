import React, { useState, useEffect } from 'react';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { VariableSizeList } from 'react-window';
import { useTheme } from '@material-ui/core/styles';

const filter = createFilterOptions();

// function for rendering one row
function renderRow(props) {
	const { data, index, style } = props;
	return <Typography noWrap>{data[index]}</Typography>;
}

function AutoCompleteFieldComponent(props) {
	const { inputRef, onChange, name, options, label, value, defaultValue, variant, ref, disabled, ...other } = props;
	const theme = useTheme();
	const LISTBOX_PADDING = theme.spacing(1);

	// State to manage the filtered options
	const [filteredOptions, setFilteredOptions] = useState(options.slice(0, 10));
	const [inputValue, setInputValue] = useState('');

	// Effect to update filtered options based on input value
	useEffect(() => {
		let newFilteredOptions = options
			.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()))
			.slice(0, 10);

		// Include typed text as an option if it doesn't exist in the filtered options
		if (inputValue && !newFilteredOptions.includes(inputValue)) {
			newFilteredOptions = [inputValue, ...newFilteredOptions];
		}

		setFilteredOptions(newFilteredOptions);
	}, [inputValue, options]);

	return (
		<Autocomplete
			options={filteredOptions}
			onChange={(e, newValue) => {
				onChange(newValue);
			}}
			{...(!disabled === false && { disabled: true })}
			inputRef={ref}
			value={value}
			defaultValue={defaultValue}
			getOptionLabel={option => {
				if (typeof option === 'string') {
					return option;
				}
				if (option !== '') {
					return option;
				}
				return option;
			}}
			filterOptions={(options, params) => {
				const filtered = filter(options, params);
				return filtered;
			}}
			ListboxComponent={React.forwardRef(function ListboxComponent(props, ref) {
				const { children, ...other } = props;
				const itemData = React.Children.toArray(children);
				return (
					<div ref={ref} {...other}>
						<VariableSizeList
							height={300} // Maintain a standard height
							width="100%"
							itemSize={() => 48} // Adjust the item size if needed
							itemCount={itemData.length}
							itemData={itemData}
							overscanCount={10} // Pre-render 10 items
						>
							{renderRow}
						</VariableSizeList>
					</div>
				);
			})}
			renderInput={params => (
				<TextField
					margin="dense"
					{...params}
					variant={variant || 'outlined'}
					label={label}
					InputLabelProps={{ shrink: true }}
					onChange={e => setInputValue(e.target.value)}
				/>
			)}
		/>
	);
}

export default AutoCompleteFieldComponent;
