import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

// Queries

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

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

function WellSearchApiField({ esIndex, fields, filters = [], optionsParams, targetLabel, onSelectOption }) {
	//Intials
	const location = useLocation();
	const classes = useStyles();
	const startPaginationAt = 5;
	const [foundWells, setFoundWells] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [focused, setFocused] = useState(false);

	const [getDbData, { loading, data: constDataWells }] = useLazyQuery(GET_DB_DATA, { fetchPolicy: 'no-cache' });
	// searching wells
	const callWellESSearch = React.useMemo(
		() =>
			debounce(request => {
				getDbData({
					variables: {
						index: esIndex,
						pagination: {
							first: request.searchTop ? request.searchTop : startPaginationAt,
							keep_alive: '1micros',
						},
						search: {
							query: `*${request.input}*`,
							fields,
						},
						filters,
					},
				});
			}, 500),
		[]
	);

	// setting the wells in set
	useEffect(() => {
		const allESWell = constDataWells?.getDbData?.hits;
		setFoundWells(allESWell);
	}, [constDataWells]);

	// ON change of selected well
	const onChange = option => {
		setSelectedOption(option);
		onSelectOption(option);
	};

	useEffect(() => {
		if (location.state?.focusOnWellSearch) {
			setFocused(true);
		}
	}, [location.state]);

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<CustomAutoComplete
				filterOptions={options => options}
				fieldAttributes={{
					optionArray: foundWells || [],
					value: selectedOption,
					label: `Search for ${targetLabel} by name`,
				}}
				fieldConfig={{
					loading,
					variant: 'outlined',
					margin: 'dense',
					size: 'small',
					textfieldRestProps: {
						focused: focused,
						required: true,
						InputLabelProps: { shrink: true },
						onBlur: () => setFocused(false),
					},
					renderOptionComp: ({ option }) => {
						return (
							<div>
								<Typography variant="subtitle1">{option[optionsParams[0]]}</Typography>
								<p className={classes.secondaryText}>{option?.[optionsParams[1]]}</p>
							</div>
						);
					},
				}}
				fieldEvents={{
					onChange: ({ value }) => {
						value && onChange(value);
					},
					onTextFieldChange: value => callWellESSearch({ input: value ?? '' }),
				}}
				id="wellSearch"
			/>
		</FormControl>
	);
}

WellSearchApiField.propTypes = {
	esIndex: PropTypes.string.isRequired,
	fields: PropTypes.arrayOf(PropTypes.string).isRequired,
	filters: PropTypes.arrayOf(PropTypes.object),
	optionsParams: PropTypes.arrayOf(PropTypes.string).isRequired,
	targetLabel: PropTypes.string.isRequired,
	onSelectOption: PropTypes.func.isRequired,
};

WellSearchApiField.defaultProps = {
	filters: [],
};

export default WellSearchApiField;
