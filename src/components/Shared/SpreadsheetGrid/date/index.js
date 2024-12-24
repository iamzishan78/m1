import { TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Clear } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
	date: {
		margin: 0,
		'& .MuiInputBase-root': {
			padding: 0,
		},
	},
	dateRoot: {
		color: '#ffffff',
		'& .MuiInputBase-inputMarginDense': {
			marginLeft: 12,
		},
	},
}));
const SpreadsheetGridDate = props => {
	const classes = useStyles();
	const [value, setValue] = useState(null);

	useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	const onChange = date => {
		setValue(date);
	};

	const onBlur = () => {
		if (props.onChange) {
			props.onChange(value);
		}
	};

	return (
		<TextField
			id="dateType"
			type="date"
			className={classes.dateRoot}
			margin="dense"
			fullWidth
			dataDateFormat="MM/DD/YYYY"
			value={moment(value).format('yyyy-MM-DD')}
			defaultValue={moment(value).format('YYYY-MM-DD')}
			onKeyDown={e => {
				if (e.keyCode === 13 || e.keyCode === 9) {
					onBlur();
				}
			}}
			onBlur={onBlur}
			onChange={date => {
				if (date.target.value) {
					onChange(date.target.value);
				}
			}}
			InputLabelProps={{
				shrink: true,
			}}
			InputProps={{
				endAdornment: (
					<IconButton
						onClick={event => {
							onChange(null);
						}}
					>
						<Clear style={{ height: 22, width: 22 }} />
					</IconButton>
				),
			}}
		/>
	);
};

export default SpreadsheetGridDate;
