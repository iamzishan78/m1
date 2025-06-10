import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';
import { uniq } from 'lodash';
import PropTypes from 'prop-types';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

const useStyles = makeStyles(() => ({
	iconContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	tex1: {
		colorPrimary: 'white',
	},
}));

export default function FieldBulkAutoComplete({
	value,
	onChange,
	onKeyDown,
	onBlur,
	filterKey,
	placeholder,
	esIndex = 'contacts_flat',
	defaultOptions = [],
}) {
	let classes = useStyles();
	const [options, setOptions] = useState([]);

	const [getFilters, { data: filtersData }] = useLazyQuery(GET_ES_FILTER_LIST, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getFilters({
			variables: {
				esIndex,
				filterKey: filterKey,
				size: 50,
			},
		});
	}, []);

	useEffect(() => {
		if (filtersData?.getESFilterList?.hits) {
			let options = uniq([...defaultOptions, ...filtersData.getESFilterList.hits.map(hit => hit.key)]);
			setOptions(
				options.map(op => ({
					value: op,
					text: op,
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

FieldBulkAutoComplete.propTypes = {
	/** The current value of the field */
	value: PropTypes.string,
	/** Callback fired when the value changes */
	onChange: PropTypes.func,
	/** Callback fired when a key is pressed */
	onKeyDown: PropTypes.func,
	/** Callback fired when the field loses focus */
	onBlur: PropTypes.func,
	/** The key to filter by in the ES query */
	filterKey: PropTypes.string.isRequired,
	/** Placeholder text for the input field */
	placeholder: PropTypes.string,
	/** The Elasticsearch index to query */
	esIndex: PropTypes.string,
	/** Default options to show before loading from ES */
	defaultOptions: PropTypes.arrayOf(PropTypes.string),
};
