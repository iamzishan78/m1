import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useLazyQuery } from '@apollo/client';

import { setStateIfDeepEqual } from 'components/Shared/functions';
import { GET_DATASETS } from 'graphQL/useQueryDataset';
import { globalStateController } from 'hookstate/globalStateController';

const DatasetsAutoCompleteFilter = ({ sx, multiple, value, setValue }) => {
	const [options, setOptions] = useState([]);

	const [getDatasets, { data: datasets, loading }] = useLazyQuery(GET_DATASETS);

	useEffect(() => {
		const user = globalStateController.getValue('user');

		getDatasets({ variables: { userId: user._id } });
	}, [getDatasets]);

	useEffect(() => {
		if (!datasets?.getDatasets) return setStateIfDeepEqual(setOptions, []);

		setStateIfDeepEqual(
			setOptions,
			datasets?.getDatasets.filter(d => d.fileName)
		);
	}, [datasets]);

	return (
		<Autocomplete
			sx={sx}
			multiple={multiple}
			id={`dataset-autocomplete`}
			options={options}
			getOptionLabel={o => o.sourceName || ''}
			loading={loading}
			value={value}
			renderInput={params => (
				<TextField {...params} label="Shape File" placeholder="Search by shape file" variant="standard" />
			)}
			onChange={(e, option) => {
				setValue(option);
			}}
		/>
	);
};

export default DatasetsAutoCompleteFilter;
