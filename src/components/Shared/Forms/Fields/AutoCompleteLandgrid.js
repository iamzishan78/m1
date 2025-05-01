import React, { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import { uniqBy } from 'lodash';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_DB_FILTERS } from 'graphQL/useQueryDbQuery';

import { US_STATES } from 'utils/data';

export const AutoCompleteLandgrid = React.memo(
	({
		onChange,
		filterKey,
		type,
		extendSearchQuery,
		esIndex = 'platformData:landgrid',
		filters,
		label,
		value,
		variant,
		compoundValue,
		newOptions,
		onBlur,
		disabled = false,
	}) => {
		const [options, setOptions] = useState([]);
		const [search, setSearch] = useState(value);

		const [getFilters, { data: filtersData, loading }] = useLazyQuery(GET_DB_FILTERS, {
			fetchPolicy: 'no-cache',
		});

		const getFiltersAction = search => {
			const rawSearch = search;
			if (search) {
				search = type === 'number' ? search : `${search}*`;
			}
			getFilters({
				variables: {
					esIndex,
					index: esIndex,
					filters,
					filterKeys: typeof filterKey !== 'string' ? filterKey : undefined,
					filterKey: typeof filterKey === 'string' ? filterKey : undefined,
					search: { query: rawSearch, fields: [filterKey.replace('.keyword', '')] },
					extendSearchQuery,
					size: label === 'County' ? 1000 : 70,
					filterAggs: {
						field: typeof filterKey === 'string' ? filterKey : undefined,
						fields: typeof filterKey !== 'string' ? filterKey : undefined,
						size: label === 'County' ? 1000 : 70,
					},
				},
			});
		};

		useEffect(() => {
			setSearch(value);
		}, [value]);

		useEffect(() => {
			getFiltersAction('');
		}, [filters, compoundValue]);

		useEffect(() => {
			if (!filtersData) {
				return;
			}

			const keys = Object.keys(filtersData);
			if (!keys || !filtersData[keys[0]] || !filtersData[keys[0]]?.hits) {
				return;
			}

			let hits = filtersData[keys[0]].hits;
			if (label === 'State') {
				hits = hits.map(hit => ({ ...hit, key: US_STATES[hit.key] || null })).filter(hit => hit.key);
			}

			if (label === 'Township') {
				hits = uniqBy(
					hits.map(hit => ({ ...hit, key: hit.key.split(' ')[0] })),
					'key'
				);
			}

			if (label === 'Range') {
				if (compoundValue) {
					hits = hits.filter(hit => hit.key.includes(compoundValue));
				}
				hits = uniqBy(
					hits.map(hit => ({ ...hit, key: hit.key.split(' ')[1] })),
					'key'
				);
			}

			setOptions(hits.map(hit => ({ value: hit.key, label: hit.key })));
		}, [filtersData, compoundValue]);

		return (
			<CustomAutoComplete
				fieldAttributes={{
					name: label,
					label,
					value: search,
					optionArray: options,
				}}
				fieldConfig={{
					variant: variant || 'outlined',
					margin: 'dense',
					disabled,
					allowNewOptions: newOptions,
					loading,
				}}
				fieldEvents={{
					onChange: ({ value }) => {
						setSearch(value);
						onChange(value ? { key: value } : {});
					},
					onBlur,
					onTextFieldChange: value => {
						if (label !== 'State') {
							getFiltersAction(value);
						}
					},
				}}
			/>
		);
	}
);

AutoCompleteLandgrid.displayName = 'AutoCompleteLandgrid';

AutoCompleteLandgrid.propTypes = {
	onChange: PropTypes.func.isRequired,
	filterKey: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
	type: PropTypes.string,
	extendSearchQuery: PropTypes.object,
	esIndex: PropTypes.string,
	filters: PropTypes.array,
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	variant: PropTypes.string,
	compoundValue: PropTypes.string,
	newOptions: PropTypes.bool,
	onBlur: PropTypes.func,
	disabled: PropTypes.bool,
};

AutoCompleteLandgrid.defaultProps = {
	esIndex: 'platformData:landgrid',
	disabled: false,
};
