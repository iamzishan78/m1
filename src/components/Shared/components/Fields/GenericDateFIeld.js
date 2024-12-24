import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Clear from '@material-ui/icons/Clear';
import moment from 'moment';
import React from 'react';

import { parseDate } from 'utils/helper';

const useStyles = makeStyles({
	dateRoot: {
		color: 'grey',
		'& input': {
			marginLeft: '20px',
		},
	},
});
function GenericDateField({ value, onChange }) {
	const classes = useStyles();
	const handleDateChange = event => {
		const newValue = parseDate(event?.target?.value);
		onChange(newValue);
	};

	return (
		<TextField
			type="date"
			margin="none"
			fullWidth
			value={value ? moment(value).format('YYYY-MM-DD') : ''}
			onChange={handleDateChange}
			InputLabelProps={{
				shrink: true,
			}}
			disableToolbar
			KeyboardButtonProps={{ 'aria-label': 'change date' }}
			format="MM/DD/YYYY"
			PopoverProps={{ disablePortal: false }}
			InputProps={{
				endAdornment: (
					<IconButton onClick={() => onChange('')}>
						<Clear style={{ height: 22, width: 22 }} />
					</IconButton>
				),
				classes: {
					root: classes.dateRoot,
				},
			}}
		/>
	);
}

export default GenericDateField;
