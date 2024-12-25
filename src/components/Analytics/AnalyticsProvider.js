import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import Analytics from './../Analytics/Aanlytics';
import { ContactsContextProvider } from './../Contacts/ContactsContext';
const useStyles = makeStyles(theme => ({
	ContactsWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function ContactsProvider(props) {
	let classes = useStyles();
	return (
		<ContactsContextProvider>
			<Analytics className={classes.ContactsWrapper}>{props.children}</Analytics>
		</ContactsContextProvider>
	);
}
