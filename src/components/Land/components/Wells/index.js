import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import WellsFilters from 'components/Land/components/Wells/WellsFilters';
import MRTTable from 'components/MRTTable';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '65px',
	},
	custom: {
		marginTop: '25px',
	},
}));

function Wells({ defaultFilters = [] }) {
	const classes = useStyles();
	const { testCase, stateValues } = globalStateController.useState(['testCase']);
	const { id: globalWellId } = useParams();
	const [stateApp] = useContext(AppContext);
	const wellTableState = tableController('MyWellsTable').useState(['filters', 'data']).stateValues;

	useEffect(() => {
		if (globalWellId || (stateValues?.testCase?.globalWellId && stateValues?.testCase)) {
			tableGlobalController.updateState({
				addWellDialog: {
					type: 'addWell',
					showDialog: true,
				},
			});
		}
	}, [globalWellId, testCase?.globalWellId]);

	useEffect(() => {
		tableController('MyWellsTable')?.setGlobalFilter(stateApp.landSearchQuery);
	}, [stateApp.landSearchQuery]);

	return (
		<div className={classes.root}>
			<WellsFilters filters={wellTableState.filters} setFilters={tableController('MyWellsTable').setFilters} />
			<div className={classes.custom} style={{ padding: '0rem 1.5rem 0rem 1.5rem' }}>
				<MRTTable name="MyWellsTable" />
			</div>
		</div>
	);
}

export default Wells;
