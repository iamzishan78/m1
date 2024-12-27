import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

const useStyles = makeStyles(theme => ({
	iconContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	tex1: {
		colorPrimary: 'white',
	},
}));

export default function FieldBulkAutoComplete({ value, onChange, onKeyDown, onBlur, filterKey, placeholder }) {
	let classes = useStyles();
	const [options, setOptions] = useState([]);

	const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getFilters({
			variables: {
				esIndex: 'contacts_flat',
				filterKey: filterKey,
				size: 50,
			},
		});
	}, []);

	useEffect(() => {
		if (filtersData?.getESFilterList?.hits) {
			setOptions(
				filtersData.getESFilterList.hits.map(hit => ({
					value: hit.key,
					text: hit.key,
				}))
			);
		}
	}, [filtersData]);

	return (
		<Autocomplete
			options={options.filter(u => u.text)}
			onChange={onChange ? onChange : () => {}}
			onKeyDown={onKeyDown ? onKeyDown : () => {}}
			onBlur={onBlur ? onBlur : () => {}}
			value={options.find(user => user?.value === value) || null}
			getOptionLabel={option => option.text}
			getOptionSelected={option => option.value === value}
			renderInput={params => (
				<TextField
					size="small"
					placeholder={placeholder}
					{...params}
					className={classes.maxWidth}
					multiline
					value={value}
				/>
			)}
		/>
	);
}
