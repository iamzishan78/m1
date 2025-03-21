import React, { useEffect, useState } from 'react';

import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'stateManagement/detailCardController';

const useStyles = makeStyles({
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
	field: {
		'& .MuiAutocomplete-clearIndicator': {
			marginRight: '10px',
		},
		'& .MuiFormControl-marginNormal': {
			margin: '0px',
		},
		'& .MuiFormControl-marginDense': {
			margin: '0px',
		},
		'& .MuiInputBase-root': {
			borderRadius: '7px',
		},
	},
});

function SimpleSelectField({ fieldData, field }) {
	const classes = useStyles();
	const {
		stateValues: { page },
	} = detailCardController.useState(['page']);
	const { useUpdate } = Pages[page];

	const { callApi } = useUpdate();

	const [value, setValue] = useState(fieldData || '');

	useEffect(() => {
		setValue(fieldData || '');
	}, [fieldData]);

	return (
		<Select
			variant="outlined"
			margin="dense"
			className={`${classes.field}`}
			id="divOrderStatus-simple-select-outlined-label"
			value={value || ''}
			fullWidth
			onChange={e => {
				setValue(e.target.value);
				callApi({ key: field.key, value: e.target.value, field, previousValue: fieldData, resetFn: setValue });
			}}
		>
			{field.options.map(opt => (
				<MenuItem key={opt?.value ?? opt} value={typeof opt === 'object' ? opt.value : opt}>
					{typeof opt === 'object' ? opt.label : opt}
				</MenuItem>
			))}
		</Select>
	);
}

SimpleSelectField.propTypes = {
	fieldData: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
	field: PropTypes.shape({
		key: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		options: PropTypes.arrayOf(
			PropTypes.shape({
				label: PropTypes.string.isRequired,
				value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
			})
		).isRequired,
		disabled: PropTypes.bool,
	}).isRequired,
};

export default SimpleSelectField;
