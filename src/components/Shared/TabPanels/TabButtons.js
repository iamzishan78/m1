import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
	tapsLabelsButtonsSelected: {
		boxShadow: 'none',
		color: '#fff',
		backgroundColor: theme.palette.secondary.main,
		'&:hover': { color: '#757575', boxShadow: 'none !important' },
	},
	tapsLabelsButtons: {
		boxShadow: 'none',
		backgroundColor: '#fff',
		color: '#757575',
		'&:hover': { boxShadow: 'none !important' },
	},
}));

const TabButtons = ({ labels, value, setValue }) => {
	const classes = useStyles();
	return (
		<>
			{labels &&
				labels.length &&
				labels.map((label, i) => (
					<Button
						id={label.replace(/\s/g, '')}
						key={i}
						size="small"
						variant="contained"
						className={value === i ? classes.tapsLabelsButtonsSelected : classes.tapsLabelsButtons}
						onClick={() => {
							setValue(i);
						}}
					>
						{label}
					</Button>
				))}
		</>
	);
};

export default React.memo(TabButtons);
