import { Button, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
	disabledTopBarButtons: {
		fontWeight: '600',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
	selectTopBarButtons: {
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff !important',
		fontWeight: '600',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff !important',
		},
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

export default ToolbarButton;
