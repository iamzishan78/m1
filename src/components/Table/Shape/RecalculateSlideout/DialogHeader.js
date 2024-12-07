import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardTabBlackIcon from 'components/Shared/svgIcons/KeyboardTabBlackIcon';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
	container: { padding: '25px', paddingLeft: '30px', paddingRight: '30px' },
	close: {
		background: 'transparent',
		paddingLeft: '10px',
		align: 'center',
	},
	title: { fontWeight: 'bolder', fontSize: '20px' },
	dialogActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			fill: '#d9d9d9',
			'&:hover': {
				fill: '#b5b2b2',
			},
		},
	},
}));

const DialogHeader = ({ handleClickDialogClose }) => {
	const classes = useStyles();

	return (
		<div>
			<Grid container className={classes.container}>
				<Grid item container xs={9} alignItems="center" className={classes.title}>
					Recalculate Ownership Values
				</Grid>
				<Grid item xs={3} className={classes.dialogActions}>
					<IconButton size="small" component="span" className={classes.close} onClick={handleClickDialogClose}>
						<KeyboardTabBlackIcon />
					</IconButton>
				</Grid>
			</Grid>
			<Divider />
		</div>
	);
};

export default memo(DialogHeader);
