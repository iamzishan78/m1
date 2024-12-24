import { FormControl, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@mui/material';
import React, { memo } from 'react';

const useStyles = makeStyles(theme => ({
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	fieldWidth: {
		width: '100%',
		maxWidth: 400,
	},
}));

function SingleSelectField({ title, value, options, onChange }) {
	const classes = useStyles();

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Grid container className={classes.gridStyle}>
				<Grid item xs={3}>
					<div>{title}</div>
				</Grid>

				<Grid item xs={9}>
					<Autocomplete
						id={`activity-${title}`}
						disableClearable
						className={classes.fieldWidth}
						options={options}
						onChange={(e, option) => onChange(option.value)}
						value={options.find(option => option.value === value) || null}
						getOptionLabel={option => option.label}
						getOptionSelected={(option, value) => option.value === value.value}
						renderInput={params => <TextField {...params} margin="dense" variant="outlined" />}
					/>
				</Grid>
			</Grid>
		</FormControl>
	);
}

export default memo(SingleSelectField);
