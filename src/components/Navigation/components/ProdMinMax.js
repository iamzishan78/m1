import React, { useState, useContext, useCallback, useEffect } from 'react';
import NumberFormat from 'react-number-format';

import { FormLabel } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CancelIcon from '@material-ui/icons/Cancel';

import { NavigationContext } from '../NavigationContext';

const useStyles = makeStyles({
	divBordersMinMax: {
		padding: '3.5px 5px 5.5px 9px',
		border: '1px solid #C4C4C4',
		borderRadius: '4px',
		display: 'flex',
		alignItems: 'center',
	},
	input: {
		marginLeft: '30px',
		width: '145px',
		float: 'right',
		'& input': { color: '#17AADD' },
	},
	inputLabel: {
		float: 'left',
		display: 'block',
		width: '200px',
		textAlign: 'center',
		lineHeight: '1.2',
	},
});

export default function FirstMonthWater(props) {
	const classes = useStyles();
	const [stateNav, setStateNav] = useContext(NavigationContext);
	const [valueMinDisplay, setValueMinDisplay] = useState('');
	const [valueMaxDisplay, setValueMaxDisplay] = useState('');
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState('');
	const [type, setType] = useState('');
	const [filterName, setFilterName] = useState(props.filter);
	const { name, id } = props;

	useEffect(() => {
		if (name.includes('Gas')) {
			setType('(MCF)');
		} else {
			setType('(BBL)');
		}
	}, [name]);

	const setFilter = useCallback(() => {
		let filter;
		let min = parseInt(valueMinDisplay);
		let max = parseInt(valueMaxDisplay);
		if (!min && !max) {
			filter = null;
		}
		if (!min && max) {
			filter = ['all', ['<=', ['get', id.toString()], max]];
		} else if (min && !max) {
			filter = ['all', ['>=', ['get', id.toString()], min]];
		} else if (min && max) {
			if (min < max) {
				filter = ['all', ['>=', ['get', id.toString()], min], ['<=', ['get', id.toString()], max]];
			}
		} else {
			filter = null;
		}

		setStateNav(stateNav => ({
			...stateNav,
			[filterName]: filter,
		}));
	}, [filterName, id, setStateNav, valueMaxDisplay, valueMinDisplay]);

	useEffect(() => {
		if (stateNav.prodOptions) {
			setFilter();
		} else {
			clearFilters();
		}
	}, [setFilter, stateNav.prodOptions]);

	useEffect(() => {
		const recall = () => {
			let checkStateNav = stateNav[filterName];
			if (!valueMinDisplay && !valueMaxDisplay) {
				if (checkStateNav && checkStateNav.length === 3) {
					const recallMin = checkStateNav[1][2];
					const recallMax = checkStateNav[2][2];
					setValueMinDisplay(recallMin);
					setValueMaxDisplay(recallMax);
				}
			}
			if (!valueMaxDisplay) {
				if (checkStateNav && checkStateNav[1][0] === '<=') {
					const recallMax = checkStateNav[1][2];
					setValueMaxDisplay(recallMax);
				}
			}
			if (!valueMinDisplay) {
				if (checkStateNav && checkStateNav[1][0] === '>=') {
					const recallMin = checkStateNav[1][2];
					setValueMinDisplay(recallMin);
				}
			}
		};
		recall();
		return () => {
			recall();
		};
	}, [filterName, stateNav, valueMaxDisplay, valueMinDisplay]);

	useEffect(() => {
		if (valueMinDisplay && valueMaxDisplay) {
			if (valueMinDisplay >= valueMaxDisplay) {
				setError(true);
				setErrorText('Min value is greater or equal than Max value');
			} else {
				setError(false);
				setErrorText('');
			}
		}
	}, [valueMaxDisplay, valueMinDisplay]);

	const allowNumbersOnly = e => {
		let code = e.which ? e.which : e.keyCode;
		if (code > 31 && (code < 48 || code > 57)) {
			e.preventDefault();
		}
	};

	const handleChangeMin = event => {
		setValueMinDisplay(parseInt(event.target.value.replace(/,/g, '')));
		if (event.target.value === '') {
			setStateNav(stateNav => ({
				...stateNav,
				[filterName]: null,
			}));
		}
	};

	const handleChangeMax = event => {
		setValueMaxDisplay(parseInt(event.target.value.replace(/,/g, '')));
		if (event.target.value === '') {
			setStateNav(stateNav => ({
				...stateNav,
				[filterName]: null,
			}));
		}
	};

	const clearFilters = () => {
		if (stateNav[filterName]) {
			setStateNav(stateNav => ({
				...stateNav,
				[filterName]: null,
			}));
		}
		handleChangeMax({ target: { value: '' } });
		handleChangeMin({ target: { value: '' } });
		setError(false);
		setErrorText('');
	};

	return (
		<div className={classes.divBordersMinMax}>
			<FormLabel className={classes.inputLabel}>
				{name} {type}
			</FormLabel>
			<NumberFormat
				value={valueMinDisplay}
				onChange={handleChangeMin}
				thousandSeparator={true}
				customInput={TextField}
				id={id}
				className={classes.input}
				aria-labelledby="range-number"
				type="text"
				label="Min"
				size="small"
				onKeyPress={e => allowNumbersOnly(e)}
				InputProps={{
					inputProps: {
						min: Number.MIN_SAFE_INTEGER,
						max: Number.MAX_SAFE_INTEGER - 1,
						step: 1000,
					},
				}}
			/>
			<NumberFormat
				value={valueMaxDisplay}
				onChange={handleChangeMax}
				thousandSeparator={true}
				customInput={TextField}
				id={id}
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
						min: Number.MIN_SAFE_INTEGER + 1,
						max: Number.MAX_SAFE_INTEGER,
						step: 1000,
					},
				}}
			/>
			<IconButton onClick={clearFilters}>
				<CancelIcon height={'30px'} />
			</IconButton>
		</div>
	);
}
