import React, { memo, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	gridStyle: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputFieldCustomTextInput: {
		marginBottom: '7px',
	},
	customDataTextInputRoot: {
		border: '1px solid #EBEBEB',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
	},
	notchedOutline: {
		border: 0,
	},
}));

function DollarField({ title, price, setPrice }) {
	const classes = useStyles();

	const textFieldRef = useRef(null);

	// useEffect(() => {
	//     textFieldRef.current.focus();
	// }, [price]);

	function NumberFormatCustom(props) {
		const { inputRef, onChange, ...other } = props;

		return (
			<NumberFormat
				{...other}
				getInputRef={inputRef}
				onValueChange={values => {
					onChange({
						target: {
							name: props.name,
							value: values.value,
						},
					});
				}}
				thousandSeparator
				isNumericString
				prefix="$"
			/>
		);
	}

	NumberFormatCustom.propTypes = {
		inputRef: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
	};

	return (
		<FormControl variant="outlined" fullWidth size="small">
			<Grid container className={classes.gridStyle}>
				<Grid item xs={3}>
					<div>{title}</div>
				</Grid>
				<Grid item xs={9}>
					<TextField
						margin="dense"
						variant="outlined"
						autoFocus
						value={price}
						error={isNaN(price)}
						helperText={isNaN(price) ? 'Offer Price must be a valid number' : ''}
						className={classes.inputFieldCustomTextInput}
						fullWidth
						onChange={e => {
							setPrice(e.target.value);
						}}
						inputRef={textFieldRef}
						InputProps={{
							inputComponent: NumberFormatCustom,
							classes: {
								root: classes.customDataTextInputRoot,
								focused: classes.focused,
								notchedOutline: classes.notchedOutline,
							},
						}}
					/>
				</Grid>
			</Grid>
		</FormControl>
	);
}

export default memo(DollarField);
