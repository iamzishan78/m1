import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography, TextField } from '@mui/material';
import React from 'react';

// Autocomplete for showing summary fields in dropdown
const AttrsAutocomplete = ({ options, selectedValue, setSelectedValue }) => {
	return (
		<div style={{ margin: '8px 0' }}>
			<Typography style={{ fontSize: '1.2rem', margin: '8px 0' }}>Color based on</Typography>
			<Autocomplete
				options={options}
				getOptionLabel={option => option['label']}
				value={selectedValue}
				onChange={(event, newValue) => {
					setSelectedValue(newValue);
				}}
				renderInput={params => (
					<TextField
						{...params}
						label="Select a field"
						variant="outlined"
						fullWidth
						InputProps={{
							...params['InputProps'],
							style: {
								height: '50px', // Adjust the height here
								padding: '0 14px',
							},
						}}
						InputLabelProps={{
							style: {
								lineHeight: '1.2',
							},
						}}
					/>
				)}
				isOptionEqualToValue={(option, value) => option['value'] === value?.['value']}
			/>
		</div>
	);
};

export default AttrsAutocomplete;
