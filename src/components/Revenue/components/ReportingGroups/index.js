import React, { useState, useContext, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';

import MRTTable from 'components/MRTTable';
import { deepEqual } from 'components/Shared/functions';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';

import { tableController } from 'stateManagement/tableController';

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
	const [esFilters, ESFilters] = useState([]);

	const setESFilters = (newFilter, oldFilters) => {
		// If the new filter is an empty array, reset `esFilters` to an empty array
		if (newFilter?.length === 0) {
			ESFilters([]); // Reset filters
		}
		// Check if the new filter is deeply equal to the current state; if not, update `esFilters`
		if (!deepEqual(ESFilters, newFilter)) {
			ESFilters(newFilter); // Update filters only if they are different
		}

		setTimeout(() => {
			if (oldFilters && oldFilters?.length) {
				oldFilters.forEach(filter => {
					tableController('RevenuePropertiesTable').clearFilter(filter.field);
				});
			}
		}, 100);
	};

	useEffect(() => {
		// Check if `tableStateValues?.filters` differs from the current `esFilters`
		if (!deepEqual(tableStateValues?.filters, esFilters)) {
			// Update the filters in the table controller if they differ
			tableController('RevenuePropertiesTable').setFilters(esFilters);
		}
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
