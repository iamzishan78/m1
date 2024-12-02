import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useQuery } from '@apollo/client';

import { setStateIfDeepEqual } from 'components/Shared/functions';
import { GET_ES_INDICES } from 'graphQL/useQueryESSimpleFilter';

function IndexAutoCompleteFilter({ sx, multiple, value, setValue }) {
	const [options, setOptions] = useState([]);

	const { data: dataJobs, loading } = useQuery(GET_ES_INDICES);

	useEffect(() => {
		if (!dataJobs?.getESIndices?.indices) return setStateIfDeepEqual(setOptions, []);

		setStateIfDeepEqual(setOptions, dataJobs?.getESIndices?.indices);
	}, [dataJobs]);

	return (
		<Autocomplete
			sx={sx}
			multiple={true}
			id={`index-filter-autocomplete`}
			options={multiple ? options?.filter(option => !value.includes(option)) : options}
			loading={loading}
			value={value}
			renderInput={params => <TextField {...params} label="Indices" placeholder="Search by index" variant="standard" />}
			onChange={(e, option) => {
				setValue(option);
			}}
		/>
	);
}

export default IndexAutoCompleteFilter;
