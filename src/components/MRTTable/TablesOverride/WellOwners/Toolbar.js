import React, { useEffect, useState } from 'react';
import { Box, Select, MenuItem } from '@material-ui/core';
import { tableController } from 'hookstate/tableController';

const WellOwnersToolbar = ({ tableKey }) => {
	const [year, setYear] = useState('2023');

	const Controller = tableController(tableKey);
	const { id } = Controller.getValue('customProps');

	useEffect(() => {
		Controller.updateState({
			customProps: {
				id,
				selectedYear: year,
			},
		});
	}, [year]);

	return (
		<Box style={{ marginBottom: '8px' }}>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={year}
				onChange={e => setYear(e.target.value)}
			>
				<MenuItem selected={year === '2019'} value={'2019'}>
					2019
				</MenuItem>
				<MenuItem selected={year === '2020'} value={'2020'}>
					2020
				</MenuItem>
				<MenuItem selected={year === '2021'} value={'2021'}>
					2021
				</MenuItem>
				<MenuItem selected={year === '2022'} value={'2022'}>
					2022
				</MenuItem>
				<MenuItem selected={year === '2023'} value={'2023'}>
					2023
				</MenuItem>
			</Select>
		</Box>
	);
};

export default WellOwnersToolbar;
