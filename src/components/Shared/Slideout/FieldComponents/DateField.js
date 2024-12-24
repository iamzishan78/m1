import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	notchedOutline: {
		border: 0,
	},
	dateRoot: {
		border: '1px solid #EBEBEB',

		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#fff',
		},
	},

	inputFieldDate: {
		marginBottom: '7px',
	},

	marginNormal: {
		marginTop: '0px',
		marginBottom: '0px',
		'& .MuiIconButton-label': {
			'& .MuiSvgIcon-root': {
				color: '#7f7f7f !important',
				fill: '#7f7f7f !important',
			},
		},
	},
}));

function DateField({ title, date, setDate, time, setTime, disabled = false, isTime = false }) {
	const classes = useStyles();

	return (
		<>
			<Grid item xs={3}>
				<div>{title}</div>
			</Grid>
			<Grid item xs={isTime ? 4 : 9}>
				<TextField
					margin="dense"
					title={title}
					type="date"
					variant="outlined"
					value={date}
					autoFocus
					placeholder=""
					fullWidth
					disabled={disabled}
					className={`${classes.dateRoot} ${classes.inputFieldDate}`}
					onChange={e => {
						setDate(e.target.value);
					}}
					InputLabelProps={{
						shrink: true,
					}}
					InputProps={{
						classes: {
							root: classes.dateRoot,
							focused: classes.focused,
							notchedOutline: classes.notchedOutline,
							light: classes.light,
						},
					}}
				/>
			</Grid>
			{isTime && (
				<Grid item xs={5}>
					<TextField
						margin="dense"
						value={time}
						type="time"
						variant="outlined"
						autoFocus
						placeholder=""
						fullWidth
						disabled={disabled}
						className={`${classes.dateRoot} ${classes.inputFieldDate}`}
						onChange={e => {
							setTime(e.target.value);
						}}
						InputLabelProps={{
							shrink: true,
						}}
						InputProps={{
							classes: {
								root: classes.dateRoot,
								focused: classes.focused,
								notchedOutline: classes.notchedOutline,
								light: classes.light,
							},
						}}
					/>
				</Grid>
			)}
		</>
	);
}

export default DateField;
