import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import Document from './Document';
import { DocumentContextProvider } from './DocumentContext';

const useStyles = makeStyles(theme => ({
	DocumentWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function DocumentProvider(props) {
	let classes = useStyles();
	return (
		<DocumentContextProvider>
			<Document className={classes.DocumentWrapper}>{props.children}</Document>
		</DocumentContextProvider>
	);
}
