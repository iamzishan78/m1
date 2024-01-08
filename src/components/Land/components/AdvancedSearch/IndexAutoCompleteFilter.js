import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { setStateIfDeepEqual } from 'components/Shared/functions';

function IndexAutoCompleteFilter({ sx, multiple, value, setValue }) {
	const [options, setOptions] = useState([]);

	useEffect(() => {
		const data = ['shapes_flat', 'shapefile_flat'];

		setStateIfDeepEqual(setOptions, data);
	}, []);

	return (
		<Autocomplete
			sx={sx}
			multiple={true}
			id={`index-filter-autocomplete`}
			options={
				multiple ? options?.filter(option => !value.includes(option)) : options
			}
			// loading={loading}
			value={value}
			renderInput={params => (
				<TextField
					{...params}
					label="Indices"
					placeholder="Search by index"
					variant="standard"
				// onChange={e => getFiltersAction(e.target.value)}
				// onFocus={e => getFiltersAction(e.target.value)}
				/>
			)}
			onChange={(e, option) => {
				setValue(option);
			}}
		/>
	);
}

export default IndexAutoCompleteFilter;
