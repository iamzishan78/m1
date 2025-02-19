import React, { useEffect, useState } from 'react';

import { TextField, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import moment from 'moment';

import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'controllers/detailCardController';

import { parseDate } from 'utils/helper';

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
function DateField({ fieldData, field }) {
	const classes = useStyles();
	const {
		stateValues: { page, loadingField },
	} = detailCardController.useState(['page', 'loadingField']);

	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const [value, setValue] = useState(fieldData || '');

	useEffect(() => {
		setValue(fieldData || '');
	}, [fieldData]);

	const handleDateChange = value => {
		const newValue = parseDate(value);
		setValue(newValue);
	};

	const handleBlur = event => {
		let currValue = event.target.value;

		if (currValue !== fieldData) {
			callApi(field.key, currValue);
		}
	};

	const handleKeyUp = e => {
		if (e.key === 'Enter') {
			e.target.blur();
		}
	};

	return (
		<TextField
			autoOk
			type="date"
			variant="outlined"
			margin="dense"
			className={`${classes.field}`}
			fullWidth
			value={value ? moment(value).format('YYYY-MM-DD') : ''}
			onBlur={handleBlur}
			onKeyUp={handleKeyUp}
			disabled={field.disabled}
			onChange={e => handleDateChange(e.target.value)}
			InputLabelProps={{
				shrink: true,
			}}
			InputProps={{
				endAdornment: loadingField && loadingField === field?.key && <CircularProgress size={22} color="secondary" />,
			}}
			disableToolbar
			KeyboardButtonProps={{ 'aria-label': 'change date' }}
			format="MM/DD/YYYY"
			PopoverProps={{ disablePortal: false }}
		/>
	);
}

export default DateField;
