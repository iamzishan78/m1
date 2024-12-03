import React, { useState, useContext, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import Grid from '@material-ui/core/Grid';
import { FormLabel } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

import { navController } from 'hookstate/navStateController';
import { NavigationContext } from '../NavigationContext';

const useStyles = makeStyles({
	divBordersMinMax: {
		display: 'flow-root',
		padding: '3.5px 5px 5.5px 10px',
		border: '1px solid #C4C4C4',
		borderRadius: '4px',
	},
	divBordersSwitch: {
		textAlign: 'center',
		padding: '3px 15px',
		border: '1px solid #C4C4C4',
		borderRadius: '4px',
		'&:hover': {
			border: '1px solid black',
		},
	},
	input: {
		marginLeft: '7px',
		width: '147px',
		'& input': { color: '#17AADD' },
	},
	inputLabel: {
		position: 'relative',
		top: '11.5px',
	},
	IconButton: {
		marginRight: '10px',
		'&:hover': {
			backgroundColor: '#fff',
			cursor: 'context-menu',
		},
	},
	ownersToggle: {
		marginRight: '50px',
	},
	inputFieldsContainer: {
		float: 'right',
		marginTop: 10,
	},
});

export default function FilterTVD() {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const [valueMinDisplay, setValueMinDisplay] = useState('');
	const [valueMaxDisplay, setValueMaxDisplay] = useState('');

	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState('');

	const setFilter = useCallback(() => {
		const min = parseInt(valueMinDisplay);
		const max = parseInt(valueMaxDisplay);

		const value = { min, max };

		if (!min && min !== 0) delete value.min;
		if (!max && max !== 0) delete value.max;

		const type = 'range';
		navController.handleWellsFilters({ field: 'trueVerticalDepth', value, type });
	}, [setStateNav, valueMaxDisplay, valueMinDisplay]);

	const handleChangeMin = event => {
		setValueMinDisplay(parseInt(event.target.value.replace(/,/g, '')));
		setStateNav(stateNav => ({
			...stateNav,
			tvdWell: event.target.id,
		}));
	};

	const handleChangeMax = event => {
		setValueMaxDisplay(parseInt(event.target.value.replace(/,/g, '')));
		setStateNav(stateNav => ({
			...stateNav,
			tvdWell: event.target.id,
		}));
	};

	const clearFilters = () => {
		handleChangeMax({ target: { id: 'TVDMax', value: '' } });
		handleChangeMin({ target: { id: 'TVDMin', value: '' } });
		setError(false);
		setErrorText('');
	};

	useEffect(() => {
		if (stateNav.tvdWell) {
			setFilter();
		} else {
			clearFilters();
		}
	}, [setFilter, stateNav.tvdWell]);

	useEffect(() => {
		if (!valueMinDisplay || !valueMaxDisplay) return;

		if (valueMinDisplay > valueMaxDisplay) {
			setError(true);
			setErrorText('Min value is greater than Max value');
			return;
		}

		setError(false);
		setErrorText('');
	}, [valueMaxDisplay, valueMinDisplay]);

	const allowNumbersOnly = e => {
		const code = e.which ? e.which : e.keyCode;
		if (code > 31 && (code < 48 || code > 57)) {
			e.preventDefault();
		}
	};

	return (
		<Grid item sm={12}>
			<div className={classes.divBordersMinMax}>
				<FormLabel className={classes.inputLabel}>TVD [ft.]</FormLabel>
				<div className={classes.inputFieldsContainer}>
					<NumberFormat
						id="TVDMin"
						value={valueMinDisplay}
						onChange={handleChangeMin}
						thousandSeparator
						customInput={TextField}
						className={classes.input}
						aria-labelledby="range-number"
						type="text"
						label="Min"
						size="small"
						onKeyPress={e => allowNumbersOnly(e)}
						InputProps={{
							inputProps: {
								min: 0,
								max: Number.MAX_SAFE_INTEGER - 1,
							},
						}}
					/>
					<NumberFormat
						id="TVDMax"
						value={valueMaxDisplay}
						onChange={handleChangeMax}
						thousandSeparator
						customInput={TextField}
						className={classes.input}
						aria-labelledby="range-number"
						type="text"
						label="Max"
						size="small"
						onKeyPress={e => allowNumbersOnly(e)}
						error={error}
						helperText={errorText}
						InputProps={{
							inputProps: {
								min: 0,
								max: Number.MAX_SAFE_INTEGER,
							},
						}}
					/>
					<IconButton onClick={clearFilters}>
						<CancelIcon height="30px" />
					</IconButton>
				</div>
			</div>
		</Grid>
	);
}
