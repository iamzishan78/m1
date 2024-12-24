import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect } from 'react';

import MRTTable from 'components/MRTTable';

import { tableController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(() => ({
	root: {
		// padding: "0px 30px 30px",
		marginTop: '65px',
		// marginLeft: '-10px',
	},
}));

const ContactManagement = () => {
	const classes = useStyles();
	const [stateApp] = useContext(AppContext);

	useEffect(() => {
		tableController('ContactTable').setGlobalFilter(stateApp.contactSearchQuery);
	}, [stateApp.contactSearchQuery]);

	return (
		<div className={classes.root}>
			<Box sx={{ padding: '1em', marginLeft: '1em' }}>
				<MRTTable name="ContactTable" />
			</Box>
		</div>
	);
};

export default ContactManagement;
