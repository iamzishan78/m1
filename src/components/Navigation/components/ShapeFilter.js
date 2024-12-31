import React, { useEffect, useRef, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';

import { copy } from 'components/Shared/functions';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

import { navController } from 'hookstate/navStateController';

const ShapeFilter = ({ filterType, label }) => {
	const [rows, setRows] = useState([]);
	const totalRows = useRef(null);
	const appendOptions = useRef(false);
	const searchText = useRef('');
	const controllerKey = `${filterType}Filter`;
	const { navStateValues } = navController.useState([controllerKey], 'navStateValues');

	const [getESSearch, { data, loading }] = useLazyQuery(GET_DB_DATA, {
		fetchPolicy: 'no-cache',
	});

	const loadData = (after = null) => {
		getESSearch({
			variables: {
				index: 'shapes_flat',
				pagination: {
					first: 25,
					after,
				},
				search: {
					query: searchText.current ? `*${searchText.current}*` : null,
					fields: ['name^4', '_id'],
				},
				sort: {
					field: 'name.keyword',
					order: 'asc',
				},
				filters: [{ field: 'layer.keyword', value: filterType }],
			},
		});
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		if (Array.isArray(data?.getDbData?.hits)) {
			totalRows.current = data?.getDbData.total;
			if (appendOptions.current) {
				appendOptions.current = false;
				setRows([...rows, ...copy(data?.getDbData?.hits)]);
			} else {
				setRows(copy(data?.getDbData?.hits));
			}
		}
	}, [data]);

	const handleChange = value => {
		const shapes = rows.filter(row => value.includes(row.name)).map(row => row.shapeJson);
		navController.handleGeographyFilters({ field: controllerKey, value: { shapes, value } });
	};

	const handleScroll = event => {
		const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
		if (bottom && rows.length < totalRows.current && rows.length > 0 && !loading) {
			appendOptions.current = true;
			loadData(rows[rows.length - 1].sort);
		}
	};

	return (
		<Autocomplete
			defaultValue={navStateValues[controllerKey].value}
			value={navStateValues[controllerKey].value}
			onChange={(event, newValue) => {
				handleChange(newValue);
			}}
			multiple
			ChipProps={{ color: 'secondary' }}
			options={rows.filter(layer => layer.name).map(layer => layer.name)}
			renderInput={params => (
				<TextField
					{...params}
					variant="outlined"
					label={label}
					placeholder=""
					onChange={e => {
						searchText.current = e.target.value;
						loadData();
					}}
					fullWidth
				/>
			)}
			disableListWrap
			id="virtualize-aoi"
			ListboxProps={{
				onScroll: handleScroll,
			}}
		/>
	);
};

export default ShapeFilter;
