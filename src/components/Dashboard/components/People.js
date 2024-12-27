import React from 'react';

import { makeStyles } from '@material-ui/styles';

import { CardHeader, Typography } from '@mui/material';

const useStyles = makeStyles(theme => ({
	headerTitle: {
		width: '100%',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
}));

const People = () => {
	const classes = useStyles();

	return (
		<>
			<CardHeader
				className={classes.headerTitle}
				title={
					<Typography variant="h5" margin={'8px'}>
						People
					</Typography>
				}
			/>
		</>
	);
};

export default People;
