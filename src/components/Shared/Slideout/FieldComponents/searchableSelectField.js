import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputFieldCustomTextInput: {
		marginBottom: '7px',
	},
	flowlineRoot: {
		'&:hover': {
			backgroundColor: '#EBEBEB',
			'& .MuiOutlinedInput-notchedOutline': {
				border: 0,
			},
			'& .MuiSelect-icon': {
				display: 'inline-block',
			},
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#EBEBEB',
		},
	},
	notchedOutline: {
		border: 0,
	},
}));

function SearchableSelectField({ title, options, value, selectedFieldId, onChange }) {
	const classes = useStyles();

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Grid container className={classes.gridStyle}>
				<Grid item xs={3}>
					<div>{title}</div>
				</Grid>

				<Grid item xs={9}>
					<Autocomplete
						className={classes.fieldWidth}
						options={options}
						onChange={(e, value) => onChange(value)}
						value={value}
						getOptionSelected={option => option.id === selectedFieldId}
						getOptionLabel={option => option.name}
						renderOption={option => {
							return (
								<Grid container spacing={0}>
									<Grid container item xs={12} alignItems="center">
										<Grid item xs>
											<span style={{ fontWeight: 400 }}>{option.name}</span>

											<Typography variant="body2" color="textSecondary">
												{option.label}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							);
						}}
						renderInput={params => <TextField margin="dense" {...params} label="Associated Deal" variant="outlined" />}
					/>
				</Grid>
			</Grid>
		</FormControl>
	);
}

export default SearchableSelectField;
