import React from 'react';

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import _ from 'lodash';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

const useStyles = makeStyles(() => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginTop: '25px',
		'& .MuiAutocomplete-root': {
			minWidth: '350px',
		},
	},
}));

const LastCheckDateFilter = ({ calculationOption, setCalculationOption, options }) => {
	const classes = useStyles();

	return (
		<div className={classes.actionBar}>
			<Grid container alignItems="center" spacing={2} style={{ padding: '12px 0px 0px 45px', width: '100%' }}>
				<CustomAutoComplete
					fieldConfig={{
						variant: 'outlined',
						textfieldRestProps: {
							style: {
								width: '360px',
							},
						},
					}}
					fieldAttributes={{
						value: calculationOption?.value,
						optionArray: options,
						options: options.map(option => option.value),
					}}
					fieldEvents={{
						onChange: ({ value }) => {
							const selectedOption = _.find(options, { value });
							setCalculationOption(selectedOption);
						},
					}}
					disableListWrap
					id="custom-date-dropdown"
				/>
			</Grid>
		</div>
	);
};

LastCheckDateFilter.propTypes = {
	calculationOption: PropTypes.shape({
		value: PropTypes.any,
		// Add other fields if known, e.g. label: PropTypes.string,
	}),
	setCalculationOption: PropTypes.func.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.any,
			// Add other fields if known, e.g. label: PropTypes.string,
		})
	).isRequired,
};

export default LastCheckDateFilter;
