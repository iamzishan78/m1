import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import TitleOpinion from './TitleOpinion';
import { TitleOpinionContextProvider } from './TitleOpinionContext';

const useStyles = makeStyles(theme => ({
	titleWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function TitleOpinionProvider(props) {
	let classes = useStyles();
	return (
		<TitleOpinionContextProvider>
			<TitleOpinion className={classes.titleWrapper}>{props.children}</TitleOpinion>
		</TitleOpinionContextProvider>
	);
}
