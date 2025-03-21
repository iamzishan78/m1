import React, { useState, useEffect } from 'react';

import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';
import loadashFilter from 'lodash/filter';
import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { GET_ES_FILTER_LIST } from 'graphQL/useQueryESFilterList';

import { detailCardController } from 'stateManagement/detailCardController';

const useStyles = makeStyles({
	inputRoot: {
		backgroundColor: '#ffffff',
	},
	listbox: {
		boxSizing: 'border-box',
		'& ul': {
			padding: 0,
			margin: 0,
		},
	},
});

const filter = createFilterOptions();
const SummaryAutoComplete = ({ fieldData, fieldKey, defaultOptions = [], payload, ...other }) => {
	const classes = useStyles();

	const {
		stateValues: { page },
	} = detailCardController.useState(['page']);
	const { useUpdate } = Pages[page];

	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false); // Track if the API request is in progress

	const { callApi } = useUpdate();
	const [search, setSearch] = useState(fieldData || '');

	const onInputChange = (event, value) => {
		setSearch(value);
	};

	const [getFieldOptions, { data: fieldOptions }] = useLazyQuery(GET_ES_FILTER_LIST, {
		fetchPolicy: 'no-cache',
	});

	const handleOpen = () => {
		// Trigger the API request when the Autocomplete is opened (clicked)
		if (!fieldOptions) {
			setLoading(true);
			getFieldOptions({
				variables: {
					...payload,
				},
			});
		}
	};

	useEffect(() => {
		setSearch(fieldData || '');
	}, [fieldData]);

	useEffect(() => {
		if (fieldOptions?.getESFilterList?.hits) {
			let filterData = fieldOptions.getESFilterList.hits.map(hit => hit.key);
			for (let i = 0; i < defaultOptions.length; i++) {
				filterData = filterData.filter(d => d !== defaultOptions[i].value && d !== defaultOptions[i].label);
			}
			for (let i = 0; i < defaultOptions.length; i++) {
				filterData.push(defaultOptions[i].label);
			}

			filterData = filterData.filter(item => item.trim());
			setOptions(filterData);
			setLoading(false);
		}
	}, [fieldOptions, defaultOptions]);

	return (
		<Autocomplete
			loading={loading}
			onOpen={handleOpen}
			defaultValue={search}
			value={search}
			disableListWrap
			classes={classes}
			options={
				options?.map(type => {
					return { _id: type, name: type };
				}) ?? []
			}
			getOptionLabel={option => {
				// Value selected with enter, right from the input
				if (typeof option === 'string') {
					return option;
				}
				// Add "xxx" option created dynamically
				if (option.inputValue) {
					return option.name;
				}

				if (option?.name) {
					return option.name;
				} else {
					return '';
				}
			}}
			getOptionSelected={option => {
				return option?._id === search;
			}}
			renderOption={option => {
				if (option._id === 'newEntity') {
					return <Typography style={{ color: 'midnightblue' }}>Add &apos;{option.name}&apos;</Typography>;
				}

				return (
					<Grid container spacing={0}>
						<Grid container item xs={12} alignItems="center">
							<Grid item xs>
								<span style={{ fontWeight: 400 }}>{option.name}</span>
							</Grid>
						</Grid>
					</Grid>
				);
			}}
			onInputChange={onInputChange}
			filterOptions={(options, params) => {
				let inputValue = JSON.parse(JSON.stringify(search));
				if (inputValue?.name) {
					inputValue = inputValue.name;
				} else if (!inputValue?.name & (payload?.filterKey?.replaceAll('.keyword', '')?.split('.').length > 1)) {
					inputValue = '';
				}
				const filtered = filter(options, { ...params, inputValue });
				const isExist = loadashFilter(filtered, filter => {
					return filter._id === inputValue;
				});
				// Suggest the creation of a new value
				if (inputValue !== '' && (!isExist || isExist.length === 0)) {
					filtered.unshift({
						name: inputValue,
						_id: 'newEntity',
					});
				}
				return filtered;
			}}
			onChange={(event, newValue) => {
				const splitKeys = payload?.filterKey?.replaceAll('.keyword', '')?.split('.');
				if (newValue) {
					callApi({
						key: fieldKey,
						value: splitKeys.length === 1 ? newValue.name : { [splitKeys[splitKeys.length - 1]]: newValue.name },
						previousValue: fieldData,
						resetFn: setSearch,
					});
				} else {
					setSearch('');
					callApi({
						key: fieldKey,
						value: splitKeys.length === 1 ? '' : { [splitKeys[splitKeys.length - 1]]: '' },
						previousValue: fieldData,
						resetFn: setSearch,
					});
				}
			}}
			renderInput={params => (
				<TextField
					variant={other.variant}
					margin="dense"
					{...params}
					InputProps={{
						...params.InputProps,
					}}
					size="small"
				/>
			)}
			{...other}
		/>
	);
};

SummaryAutoComplete.propTypes = {
	fieldData: PropTypes.string,
	fieldKey: PropTypes.string.isRequired,
	defaultOptions: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
		})
	),
	payload: PropTypes.shape({
		filterKey: PropTypes.string,
	}),
};

export default SummaryAutoComplete;
