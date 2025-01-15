import React from 'react';

import { Button, makeStyles } from '@material-ui/core';

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
	disabledTopBarButtons: {
		fontWeight: '600',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
		marginLeft: '0.2rem',
		marginRight: '0.2rem',
	},
	selectTopBarButtons: {
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff !important',
		fontWeight: '600',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff !important',
		},
		marginLeft: '0.2rem',
		marginRight: '0.2rem',
	},
}));

const ToolbarButton = ({ label, color = 'secondary', disabled = false, onClick, customStyles = {} }) => {
	const classes = useStyles();

	return (
		<Button
			color={color}
			className={`${disabled ? classes.disabledTopBarButtons : classes.selectTopBarButtons} ${customStyles.button}`}
			disabled={disabled}
			onClick={onClick}
		>
			{label}
		</Button>
	);
};

ToolbarButton.propTypes = {
	label: PropTypes.string.isRequired, // Label must be a string and is required
	color: PropTypes.oneOf(['primary', 'secondary', 'default']), // Restrict color to specific values
	disabled: PropTypes.bool, // Boolean indicating whether the button is disabled
	onClick: PropTypes.func, // Function for the button's onClick event
	customStyles: PropTypes.shape({
		button: PropTypes.string, // Optional styles, expecting a `button` key as a string
	}),
};

export default ToolbarButton;
