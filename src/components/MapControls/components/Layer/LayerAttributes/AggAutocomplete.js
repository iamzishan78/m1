import React from 'react';

import { Autocomplete, TextField } from '@mui/material';

import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const AggAutocomplete = ({ setAggregation, aggregation }) => {
	return (
		<>
			<Autocomplete
				options={['SUM', 'MEAN', 'MIN', 'MAX', 'COUNT']}
				value={aggregation || 'SUM'}
				onChange={(event, newValue) => {
					setAggregation(newValue);
				}}
				renderInput={params => <TextField {...params} variant="outlined" fullWidth placeholder="Select Aggregation" />}
				getOptionLabel={option => option}
			/>
		</>
	);
};

AggAutocomplete.propTypes = {
	setAggregation: PropTypes.func.isRequired,
	aggregation: PropTypes.string,
};

export default AggAutocomplete;
