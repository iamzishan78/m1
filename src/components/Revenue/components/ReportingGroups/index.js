import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';

import MRTTable from 'components/MRTTable';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';

import { tableController } from 'hookstate/tableController';

// actions

const useStyles = makeStyles(theme => ({
	root: { paddingTop: '65px' },
	propertyTableContainer: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		marginLeft: '-8px',
		marginTop: theme.spacing(2),
	},
}));

export default function ReportingGroups() {
	const classes = useStyles();
	const tableStateValues = tableController('RevenuePropertiesTable').useState(['filters']).stateValues;
	// redux

	const [filterToggle, setFilterToggle] = React.useState(false);
	// props to pass in table
	const [esFilters, setESFilters] = useState([]);

	useEffect(() => {
		tableController('RevenuePropertiesTable').setFilters(esFilters);
	}, [esFilters, filterToggle]);

	useEffect(() => {
		setESFilters(tableStateValues?.filters);
	}, [tableStateValues?.filters]);

	return (
		<div className={classes.root}>
			<ReportGroupHeader
				type="Properties"
				esFilters={esFilters}
				setESFilters={setESFilters}
				setFilterToggle={setFilterToggle}
			/>
			<div className={classes.propertyTableContainer}>
				<MRTTable name="RevenuePropertiesTable" />
			</div>
		</div>
	);
}
