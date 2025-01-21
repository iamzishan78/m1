import React, { useEffect, useState } from 'react';

import { Grid, Typography } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';
import { capitalize } from 'lodash';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const useStyles = makeStyles({
	inputRoot: {
		// backgroundColor: "#ffffff",
	},
	listbox: {
		boxSizing: 'border-box',
		'& ul': {
			padding: 0,
			margin: 0,
		},
	},
});

const AutoCompleteESShapeLayer = ({ label, value, filters, setSelectedShapeLayer, searchFields }) => {
	const [search, setSearch] = useState('');

	const [getDbData, { data: elasticData }] = useLazyQuery(GET_DB_DATA, {
		fetchPolicy: 'no-cache',
		onCompleted: () => {
			// setLoading(false);
		},
	});

	useEffect(() => {
		getDbData({
			variables: {
				index: 'shapes_flat',
				pagination: {
					first: 50,
					after: null,
				},
				search: {
					query: search ? `*${search}*` : '',
					fields: searchFields || ['*'],
				},
				filters,
			},
		});
	}, [getDbData, search]);

	const onInputChange = e => {
		if (e?.target?.value) {
			setSearch(e.target.value);
		}
	};

	const onChange = value => {
		setSelectedShapeLayer(value ? value : { clear: true });
	};
	const classes = useStyles();

	const layerList = elasticData?.getDbData?.hits || [];

	return (
		<Autocomplete
			// defaultValue={{ _id: value, name: value }}
			value={value}
			disableListWrap
			classes={classes}
			options={layerList || []}
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
			getOptionSelected={(option, value) => {
				return option?._id === value?._id;
			}}
			filterOptions={options => {
				return options;
			}}
			renderOption={option => {
				return (
					<Grid container spacing={0}>
						<Grid container item xs={12} alignItems="center">
							<Grid item xs>
								<span style={{ fontWeight: 400 }}>{option.shapeLabel}</span>

								<Typography variant="body2" color="textSecondary">
									{capitalize(option.layer)}
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				);
			}}
			onInputChange={onInputChange}
			onChange={(event, newValue) => {
				onChange(newValue);
			}}
			renderInput={params => (
				<TextField
					margin="dense"
					variant="outlined"
					{...params}
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					label={label}
					fullWidth
					autoFocus
					size="small"
				/>
			)}
			// {...other}
		/>
	);
};

export default AutoCompleteESShapeLayer;
