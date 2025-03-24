import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const AggAutocomplete = ({ setAggregation, aggregation, options, defaultValue }) => {
	return (
		<>
			<Autocomplete
				options={options}
				defaultValue={defaultValue}
				value={aggregation}
				onChange={(event, newValue) => {
					setAggregation(newValue);
				}}
				renderInput={params => <TextField {...params} variant="outlined" fullWidth placeholder="Select Value" />}
				getOptionLabel={option => option}
			/>
		</>
	);
};

AggAutocomplete.propTypes = {
	setAggregation: PropTypes.func.isRequired,
	aggregation: PropTypes.string,
	options: PropTypes.array.isRequired,
	defaultValue: PropTypes.string,
};

export default AggAutocomplete;
