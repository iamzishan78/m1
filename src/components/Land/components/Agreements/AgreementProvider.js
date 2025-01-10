import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Agreement from '.';
import { AgreementContextProvider } from './AgreementContext';
import { DrawerContextProvider } from './detailComponents/DrawerContext';

const useStyles = makeStyles(() => ({
	AgreementWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function AgreementProvider(props) {
	let classes = useStyles();
	return (
		<AgreementContextProvider>
			<Agreement className={classes.AgreementWrapper}>{props.children}</Agreement>
		</AgreementContextProvider>
	);
}
