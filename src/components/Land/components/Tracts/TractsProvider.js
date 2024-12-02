import React from 'react';
import { TractContextProvider } from './TractContext';
import { makeStyles } from '@material-ui/core/styles';
import Tract from '.';

const useStyles = makeStyles(() => ({
	TractWrapper: {
		width: '100%',
		height: '100%',
	},
}));

export default function TractProvider(props) {
	let classes = useStyles();
	return (
		<TractContextProvider>
			<Tract className={classes.TractWrapper}>{props.children}</Tract>
		</TractContextProvider>
	);
}
