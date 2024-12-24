import { useLazyQuery } from '@apollo/client';
import { InputAdornment } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useState, useEffect } from 'react';

import { COUNTIES } from 'graphQL/useQueryCountiesBySta';

const useStyles = makeStyles(theme => ({
	formControl: {
		width: '100%',
		color: 'black',
	},
	loader: {},
	autoC: {
		margin: '8px 0px 4px',
	},
}));

export default function FilterCountyName({ value, state, onCountyChange, label, variant, shrink }) {
	const classes = useStyles();

	const [countyList, setCountyList] = useState([]);
	const [getCounties, { loading, data }] = useLazyQuery(COUNTIES);

	useEffect(() => {
		if (state) {
			getCounties({
				variables: {
					state: state,
				},
			});
		} else {
			setCountyList([]);
		}
	}, [state]);

	useEffect(() => {
		if (data) {
			if (data.counties) {
				setCountyList(data.counties);
			} else {
				setCountyList([]);
			}
		}
	}, [data]);

	const handleCountyNameChange = (event, newValue) => {
		onCountyChange(newValue);
	};

	const onEnterKey = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
		}
	};

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			{loading ? (
				<CircularProgress color="secondary" className={classes.loader} size={28} />
			) : (
				<Autocomplete
					className={classes.autoC}
					id="field-county"
					margin="dense"
					options={countyList}
					size={shrink ? 'small' : 'medium'}
					value={value ? { county: value } : ''}
					getOptionLabel={option => (option && option.county ? option.county : option ? option : '')}
					autoComplete
					disableListWrap
					includeInputInList
					onChange={(event, newValue) => {
						handleCountyNameChange(event, newValue);
					}}
					onKeyDown={event => onEnterKey(event)}
					renderInput={params => (
						<form autoComplete="off">
							<TextField
								{...params}
								fullWidth
								label={label}
								variant={variant ? variant : 'outlined'}
								startAdornment={
									<InputAdornment>
										{loading && <CircularProgress color="secondary" className={classes.loader} size={10} />}
									</InputAdornment>
								}
							/>
						</form>
					)}
					renderOption={option => (
						<Typography>{option && option.county ? option.county : option ? option : ''}</Typography>
					)}
				/>
			)}
		</FormControl>
	);
}
