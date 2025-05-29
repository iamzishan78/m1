import React, { useState, useEffect } from 'react';
import { Popper } from '@material-ui/core';

import { useLazyQuery } from '@apollo/client';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

const AutoCompleteField = ({
	placeholder,
	value,
	onChange,
	column,
	query,
	extendSearchQuery,
	esIndex,
	filters,
	variant,
	...rest
}) => {
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [search, setSearch] = useState(value);
	const { label, filterKey, type } = column;
	const [getFilters, { data: filtersData, loading }] = useLazyQuery(query, { fetchPolicy: 'no-cache' });

	useEffect(() => {
		getFiltersAction('');
	}, []);

	useEffect(() => {
		if (filtersData) {
			const keys = Object.keys(filtersData);
			if (keys && filtersData[keys[0]] && filtersData[keys[0]]?.hits) {
				setOptions(
					filtersData[keys[0]].hits.map(hit => ({
						doc_count: hit.doc_count,
						key: typeof hit.key === 'string' ? [hit.key] : hit.key,
						key_as_string: hit.key_as_string,
					}))
				);
			}
		}
	}, [filtersData]);

	const handleChange = search => {
		setSearch(search);
		getFiltersAction(search);
	};

	const getFiltersAction = search => {
		if (search) {
			search = type === 'number' ? search : search.includes('-') ? `"*${search}*"` : `*${search}*`;
		}
		getFilters({
			variables: {
				esIndex,
				filters,
				filterKeys: filterKey,
				// filterKey: typeof filterKey === 'string' ? filterKey : undefined,
				search,
				extendSearchQuery,
				size: 50,
			},
		});
	};

	const PopperMy = props => {
		return <Popper {...props} style={{ maxWidth: 'fit-content', ...rest.style }} placement="bottom-start" />;
	};

	const getCustomOptionLabel = option => {
		if (typeof option.key === 'string') {
			return option;
		} else {
			const filterSpace = option?.key?.filter(item => item !== '');

			if (!filterSpace) {
				return '';
			}

			return `#-${filterSpace[0]}${filterSpace[1] ? ` - ${filterSpace[1]}` : ''}`;
		}
	};

	return (
		<CustomAutoComplete
			id={`filter-autocomplete-${label || 'es-field'}`}
			PopperComponent={PopperMy}
			open={open}
			onOpen={() => {
				setOpen(true);
			}}
			onClose={() => {
				setOpen(false);
			}}
			inputValue={search}
			fieldConfig={{
				loading,
				variant,
				getCustomOptionLabel,
				...(rest.renderOption && { renderOptionComp: rest.renderOption }),
				textfieldRestProps: {
					onKeyDown: e => {
						if (e.code === 'Tab') {
							const ops = options.filter(op => op.key.startsWith(search));
							if (ops[0] && ops[0].key) {
								onChange(ops[0].key);
							}
						}
					},
				},
			}}
			fieldAttributes={{
				label,
				value,
				placeholder,
				optionArray: options,
			}}
			fieldEvents={{
				onTextFieldChange: value => handleChange(value),
				onChange: ({ value, reason }) => {
					if (reason === 'clear' || !value?.key) {
						return setSearch('');
					}

					if (typeof value.key === 'string') {
						setSearch(value.key);
						onChange(value.key);
						return;
					}
					const valuesLength = value.key.length;
					const lastValue = value.key?.[valuesLength - 1];
					const val = lastValue && lastValue !== '' ? lastValue : value.key.find(val => val !== '') || '';
					const index = value.key.indexOf(val);
					setSearch(val);
					onChange(val, index >= 0 ? index : 0);
				},
			}}
		/>
	);
};

export default AutoCompleteField;
