import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { parseDate } from 'utils/helper';
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
function DateField({ fieldData, field }) {
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
			disableToolbar
			KeyboardButtonProps={{ 'aria-label': 'change date' }}
			format="MM/DD/YYYY"
			PopoverProps={{ disablePortal: false }}
		/>
	);
}

export default DateField;
