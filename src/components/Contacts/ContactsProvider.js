import { makeStyles } from '@material-ui/core/styles';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';

import Contacts from './Contacts';
import { ContactsContextProvider } from './ContactsContext';

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
			<Contacts className={classes.ContactsWrapper}>{props.children}</Contacts>
		</ContactsContextProvider>
	);
}
