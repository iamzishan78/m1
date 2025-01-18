import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, Select } from '@material-ui/core';
import { detailCardController } from 'hookstate/detailCardController';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';

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

	const [value, setValue] = useState(fieldData?.get({ noproxy: true }) || '');

	useEffect(() => {
		setValue(fieldData?.get({ noproxy: true }) || '');
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
				callApi(field.key, e.target.value);
			}}
		>
			{field.options.map((opt, index) => (
				<MenuItem key={index} value={typeof opt === 'object' ? opt.value : opt}>
					{typeof opt === 'object' ? opt.label : opt}
				</MenuItem>
			))}
		</Select>
	);
}

export default SimpleSelectField;
