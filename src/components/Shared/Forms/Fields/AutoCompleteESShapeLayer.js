import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { capitalize } from 'lodash';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import { GET_DB_DATA } from 'graphQL/useQueryDbQuery';

const AutoCompleteESShapeLayer = ({ label, value, filters, setSelectedShapeLayer, searchFields }) => {
	const renderOptionComp = ({ option }) => {
		return (
			<Grid container item xs={12} alignItems="center">
				<Grid item xs>
					<span style={{ fontWeight: 400 }}>{option.shapeLabel}</span>
					<Typography variant="body2" color="textSecondary">
						{capitalize(option.layer)}
					</Typography>
				</Grid>
			</Grid>
		);
	};

	return (
		<CustomAutoComplete
			fieldAttributes={{
				label,
				value,
				query: GET_DB_DATA,
				variables: {
					index: 'shapes_flat',
					pagination: {
						first: 100,
						after: null,
					},
					search: {
						fields: searchFields || ['*'],
					},
					filters,
				},
				getOptions: ({ data }) => data?.getDbData?.hits || [],
			}}
			fieldConfig={{
				variant: 'outlined',
				size: 'small',
				margin: 'dense',
				renderOptionComp,
				getCustomOptionLabel: option => {
					if (typeof option === 'string') return option;
					if (option?.inputValue) return option.name;
					return option?.name || '';
				},
				textFieldInputProps: {
					startAdornment: <SearchIcon />,
				},
			}}
			fieldEvents={{
				onChange: ({ value }) => setSelectedShapeLayer(value || { clear: true }),
			}}
		/>
	);
};

AutoCompleteESShapeLayer.propTypes = {
	label: PropTypes.string,
	value: PropTypes.any,
	filters: PropTypes.array,
	setSelectedShapeLayer: PropTypes.func.isRequired,
	searchFields: PropTypes.arrayOf(PropTypes.string),
};

AutoCompleteESShapeLayer.defaultProps = {
	label: '',
	filters: [],
	searchFields: ['*'],
};

export default memo(AutoCompleteESShapeLayer);
