import { useQuery } from '@apollo/client';
import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { setStateIfDeepEqual } from 'components/Shared/functions';

import { GET_DB_MODELS } from 'graphQL/useQueryDbQuery';

function IndexAutoCompleteFilter({ sx, multiple, value, setValue }) {
	const [options, setOptions] = useState([]);

	const { data, loading } = useQuery(GET_DB_MODELS);

	useEffect(() => {
		if (!data?.getDbModels?.data) {
			return setStateIfDeepEqual(setOptions, []);
		}

		setStateIfDeepEqual(
			setOptions,
			data?.getDbModels?.data.map(d => d.esIndexName)
		);
	}, [data]);

	return (
		<Autocomplete
			sx={sx}
			multiple={true}
			id={'index-filter-autocomplete'}
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
