import React from 'react';
import { DocumentContextProvider } from './DocumentContext';
import { makeStyles } from '@material-ui/core/styles';
import Document from './Document';

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
