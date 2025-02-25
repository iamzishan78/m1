import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';
import { tableController } from 'stateManagement/tableController';
import { LOD_YEAR, LOD_YEAR_OPTIONS } from 'utils/consts';
import SelectFilter from 'components/Shared/ui/SelectFilter';

const WellOwnersToolbar = ({ tableKey }) => {
	const [year, setYear] = useState(`${LOD_YEAR}`);

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
			<SelectFilter
				options={LOD_YEAR_OPTIONS.map(year => `${year}`)}
				initialValue={`${LOD_YEAR}`}
				onValueChange={year => {
					setYear(year);
				}}
			/>
		</Box>
	);
};

export default WellOwnersToolbar;
