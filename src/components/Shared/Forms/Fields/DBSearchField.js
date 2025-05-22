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
import PropTypes from 'prop-types';

import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const useStyles = makeStyles(() => ({
	secondaryText: {
		color: 'grey',
		fontSize: '15px',
		margin: 0,
	},
	alignCenter: {
		textAlign: 'center',
	},
}));

function DBSearchField({ filters, index, pagination, fields, sort, fieldName, onSelect }) {
	//Intials
	const location = useLocation();
	const classes = useStyles();
	const [foundItems, setFoundItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [focused, setFocused] = useState(false);

	const [getDbData, { data: constDataItems, loading }] = useLazyQuery(GET_DB_DATA, {
		fetchPolicy: 'no-cache',
	});
	// searching
	const callItemDBSearch = React.useMemo(
		() =>
			debounce(request => {
				getDbData({
					variables: {
						filters,
						index,
						pagination,
						search: {
							query: `${request.input}`,
							fields,
						},
						sort,
					},
				});
			}, 500),
		[]
	);

	// setting the items
	useEffect(() => {
		const allDBItem = constDataItems?.getDbData?.hits;
		setFoundItems(allDBItem);
	}, [constDataItems]);

	useEffect(() => {
		callItemDBSearch({ input: '*' }, () => null);
	}, []);

	// ON change of selected item
	const onChange = item => {
		onSelect(item);
		setSelectedItem(item);
	};

	useEffect(() => {
		if (location.state?.focusOnItemSearch) {
			setFocused(true);
		}
	}, [location.state]);

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Autocomplete
				options={foundItems || []}
				onChange={(e, Item) => {
					onChange(Item);
				}}
				value={selectedItem}
				getOptionLabel={option => option?.name || option?.checkNumber}
				filterOptions={x => x}
				loading
				id={`${fieldName}Search`}
				loadingText={
					loading ? (
						<div className={classes.alignCenter}>
							<CircularProgress />
						</div>
					) : (
						'No record found'
					)
				}
				renderOption={option => {
					return (
						<div>
							<Typography variant="subtitle1">{option?.name || option?.checkNumber}</Typography>
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
						label={`${fieldName.replace(/ies$/, 'y').replace(/s$/, '')} ${
							fieldName.toLowerCase().includes('revenue') ? 'Number' : 'Name'
						}`}
						InputLabelProps={{ shrink: true }}
						onChange={event => {
							callItemDBSearch({ input: `*${event.target.value}*` }, () => null);
						}}
						onBlur={() => setFocused(false)}
					/>
				)}
			/>
		</FormControl>
	);
}

DBSearchField.propTypes = {
	filters: PropTypes.arrayOf(PropTypes.object),
	index: PropTypes.string.isRequired,
	pagination: PropTypes.shape({
		first: PropTypes.number,
		keep_alive: PropTypes.string,
	}),
	fields: PropTypes.arrayOf(PropTypes.string),
	sort: PropTypes.arrayOf(PropTypes.object),
	fieldName: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired,
};

DBSearchField.defaultProps = {
	filters: [],
	fields: [],
	sort: [],
	pagination: {
		first: 50,
		keep_alive: '1micros',
	},
};

export default DBSearchField;
