import React, { useState, useEffect } from 'react';

import { Typography, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';
import loadashFilter from 'lodash/filter';
import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { SHAPE_AUTOCOMPLETE_LIST } from 'graphQL/useQueryShapeAutoCompleteList';

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

const ShapeAutoComplete = ({ fieldData, fieldKey, shapeType, ...other }) => {
	const classes = useStyles();

	const {
		stateValues: { page },
	} = detailCardController.useState(['page']);
	const { useUpdate } = Pages[page];

	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false); // Track if the API request is in progress

	const { callApi } = useUpdate();
	const value = fieldData || '';
	const [search, setSearch] = useState(value);

	const onInputChange = (event, value) => {
		setSearch(value);
	};

	const [typeListQuery, { data: dataTypes }] = useLazyQuery(SHAPE_AUTOCOMPLETE_LIST);

	const handleOpen = () => {
		// Trigger the API request when the Autocomplete is opened (clicked)
		if (!dataTypes) {
			setLoading(true);
			typeListQuery({ variables: { shapeType, key: fieldKey } });
		}
	};

	useEffect(() => {
		setSearch(value);
	}, [value]);

	useEffect(() => {
		if (dataTypes && dataTypes[Object.keys(dataTypes)[0]]) {
			setOptions(() => {
				let options = dataTypes[Object.keys(dataTypes)[0]];
				if (other?.manualOptions) {
					options = options.concat(other?.manualOptions);
					options = Array.from(new Set(options));
				}
				return options;
			});
			setLoading(false);
		}
	}, [dataTypes, other?.manualOptions]);

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
				if (newValue) {
					callApi({ key: fieldKey, value: newValue.name });
				} else {
					setSearch('');
					callApi({ key: fieldKey, value: '' });
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

ShapeAutoComplete.propTypes = {
	fieldData: PropTypes.string,
	fieldKey: PropTypes.string.isRequired,
	shapeType: PropTypes.string.isRequired,
	manualOptions: PropTypes.arrayOf(PropTypes.string),
	variant: PropTypes.string,
};

export default ShapeAutoComplete;
