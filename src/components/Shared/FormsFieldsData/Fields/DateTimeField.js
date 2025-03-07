import React, { useEffect, useState } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { sideDialogController } from 'stateManagement/sideDialogController';

const getCurrentDate = () => {
	const d = new Date().toISOString();
	return d.slice(0, d.indexOf('T'));
};

const getCurrentTime = () => {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, '0');
	const minutes = now.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
};

const useStyles = makeStyles(theme => ({
	dateTimeRow: {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		columnGap: '16px',
	},
	dateTimeField: {
		height: 41,
		width: '100%',
		marginBottom: '20px',

		'& .MuiInputBase-root': {
			height: '100%',
		},
	},
}));

const DateTimeField = ({ item, dialogKey }) => {
	const [date, setDate] = useState(getCurrentDate());
	const [time, setTime] = useState(getCurrentTime() || '08:00');

	const classes = useStyles();

	useEffect(() => {
		sideDialogController(dialogKey).updateState({ [item.name]: { date, time } });
	}, [date, time]);

	return (
		<div className={classes.dateTimeRow}>
			<TextField
				className={classes.dateTimeField}
				value={date}
				label={item.label}
				InputLabelProps={{ shrink: true }}
				type="date"
				variant="outlined"
				onChange={e => {
					setDate(e.target.value);
				}}
			/>
			<TextField
				className={classes.dateTimeField}
				value={time}
				type="time"
				variant="outlined"
				onChange={e => {
					setTime(e.target.value);
				}}
			/>
		</div>
	);
};

export default DateTimeField;
