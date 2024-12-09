import React from 'react';
import { MenuItem, Box } from '@mui/material';

import { tableController } from 'hookstate/tableController';
import { tableESSimpleFilterModes } from '../utils/data';
let previousFilter = '';
function FilterModeMenuItems({ option, tableKey, name, onSelectFilterMode }) {
	const mode = tableESSimpleFilterModes[option];
	return (
		<MenuItem
			divider={mode.divider}
			onClick={() => {
				// When filter is mode equals to between and filter mode is not between, set filter mode to equals and then set filter mode to between
				if (previousFilter.includes('between') && ['singleselect', 'multiselect'].includes(mode.option)) {
					tableController(tableKey).setFilterMode(name, 'equals');
					setTimeout(() => {
						tableController(tableKey).setFilterMode(name, mode.option);
						onSelectFilterMode(mode.option);
					}, 0);
				} else {
					tableController(tableKey).setFilterMode(name, mode.option);
					onSelectFilterMode(mode.option);
				}

				previousFilter = mode.option;
			}}
			// selected={option === filterOption}
			sx={{
				alignItems: 'center',
				display: 'flex',
				gap: '2ch',
				my: 0,
				py: '6px',
			}}
			value={mode.option}
		>
			{mode.symbol && <Box sx={{ fontSize: '1.25rem', width: '2ch' }}>{mode.symbol}</Box>}
			{mode.label}
		</MenuItem>
	);
}

export default FilterModeMenuItems;
