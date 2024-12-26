import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash/debounce';

// Queries

import { GET_ES_SIMPLE_SEARCH } from 'graphQL/useQueryESSimpleSearch';

const useStyles = makeStyles(theme => ({
	secondaryText: {
		color: 'grey',
		fontSize: '15px',
		margin: 0,
	},
	alignCenter: {
		textAlign: 'center',
	},
}));

function WellSearchApiField(props) {
	//Intials
	const location = useLocation();
	const classes = useStyles();
	const startPaginationAt = 50;
	const [foundWells, setFoundWells] = useState([]);
	const [selectedWell, setSelectedWell] = useState(null);
	const [focused, setFocused] = useState(false);

	const [getESSimpleSearch, { data: constDataWells }] = useLazyQuery(GET_ES_SIMPLE_SEARCH, { fetchPolicy: 'no-cache' });
	// searching wells
	const callWellESSearch = React.useMemo(
		() =>
			debounce((request, callback) => {
				getESSimpleSearch({
					variables: {
						index: 'platformData:wells',
						pagination: {
							first: request.searchTop ? request.searchTop : startPaginationAt,
							keep_alive: '1micros',
						},
						search: {
							query: request.input,
							fields: ['wellName', 'api'],
						},
						sort: [],
					},
				});
			}, 500),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	// setting the wells in set
	useEffect(() => {
		const allESWell = constDataWells?.getESSimpleSearch?.hits;
		setFoundWells(allESWell);
	}, [constDataWells]);

	// ON change of selected well
	const onChange = well => {
		props.getSelectedWell(well);
		setSelectedWell(well);
	};

	useEffect(() => {
		if (location.state?.focusOnWellSearch) {
			setFocused(true);
		}
	}, [location.state]);

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Autocomplete
				options={foundWells || []}
				onChange={(e, well) => {
					onChange(well);
				}}
				value={selectedWell}
				getOptionLabel={(option, value) => option.wellName}
				filterOptions={x => x}
				loading
				id="wellSearch"
				loadingText={
					<div className={classes.alignCenter}>
						<CircularProgress />
					</div>
				}
				renderOption={option => {
					return (
						<div>
							<Typography variant="subtitle1">{option?.wellName}</Typography>
							<p className={classes.secondaryText}>{option?.ApiNumber}</p>
						</div>
					);
				}}
				renderInput={params => (
					<TextField
						margin="dense"
						focused={focused}
						{...params}
						required
						variant="outlined"
						label="Search for a well by name or API"
						InputLabelProps={{ shrink: true }}
						onChange={event => {
							callWellESSearch({ input: event.target.value }, results => null);
						}}
						onBlur={() => setFocused(false)}
					/>
				)}
			/>
		</FormControl>
	);
}

export default WellSearchApiField;
