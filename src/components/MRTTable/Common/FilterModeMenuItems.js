import React from 'react';

import { MenuItem, Box } from '@mui/material';

import PropTypes from 'prop-types';

import { tableESSimpleFilterModes } from '../utils/data';

let previousFilter = '';
function FilterModeMenuItems({ option, tableKey, name, onSelectFilterMode, controller }) {
	const mode = tableESSimpleFilterModes[option];
	return (
		<MenuItem
			divider={mode.divider}
			onClick={() => {
				const isBetween = previousFilter.includes('between');
				const isSingleMulti = ['singleselect', 'multiselect'].includes(mode.option);
				const isEmptyNotEmpty = ['empty', 'notEmpty'].includes(mode.option);
				const isPrevSingleMulti = ['singleselect', 'multiselect'].includes(previousFilter);

				if (isBetween && isSingleMulti) {
					controller(tableKey).setFilterMode(name, 'equals');
					onSelectFilterMode('equals');
					setTimeout(() => {
						controller(tableKey).setFilterMode(name, mode.option);
						onSelectFilterMode(mode.option);
					}, 0);
				} else {
					controller(tableKey).setFilterMode(name, mode.option);
					onSelectFilterMode(mode.option);
				}

				if ((isSingleMulti || isPrevSingleMulti) && !isEmptyNotEmpty) {
					controller(tableKey).clearFilter(name);
				}

				previousFilter = mode.option;
			}}
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

FilterModeMenuItems.propTypes = {
	option: PropTypes.string.isRequired, // The key to access the mode in tableESSimpleFilterModes
	tableKey: PropTypes.string.isRequired, // The key identifying the table
	name: PropTypes.string.isRequired, // The name of the filter field
	onSelectFilterMode: PropTypes.func.isRequired, // Callback when a filter mode is selected
	controller: PropTypes.func.isRequired, // Function to manage filter state
};

export default FilterModeMenuItems;
