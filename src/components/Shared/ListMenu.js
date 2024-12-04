import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	active: {
		borderBottom: '4px solid #01B0F0',
		fontWeight: 'bold',
	},
	inActive: {
		marginTop: '-4px !important',
	},
	root: {
		display: 'flex',
		width: '100%',
		alignItems: 'center',
	},
}));

const ListMenu = ({ options, onChange, selectedOption, optionStyle }) => {
	const classes = useStyles();
	return (
		<List>
			<ListItem className={classes.root}>
				{options.map(option => {
					return (
						<span
							key={option.value}
							className={`${selectedOption === option.value ? classes.active : classes.inActive} `}
							style={optionStyle ? optionStyle : {}}
							onClick={() => (option.disabled ? {} : onChange(option.value))}
						>
							{option.label}
						</span>
					);
				})}
			</ListItem>
		</List>
	);
};

export default ListMenu;
