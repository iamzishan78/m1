import React, { useState } from 'react';

import { Box, MenuItem, Select } from '@material-ui/core';

const SelectFilter = props => {
	const { options, initialValue, onValueChange, labelId, id } = props;
	const [selectedValue, setSelectedValue] = useState(initialValue || (options.length > 0 ? options[0] : null));

	const handleValueChange = event => {
		const selectedOption = event.target.value;
		setSelectedValue(selectedOption);
		if (onValueChange) {
			onValueChange(selectedOption);
		}
	};

	return (
		<Box>
			<Select labelId={labelId} id={id} value={selectedValue} onChange={handleValueChange}>
				{options.map(option => (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				))}
			</Select>
		</Box>
	);
};

export default SelectFilter;
