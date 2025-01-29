import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';

import MRTTable from 'components/MRTTable';
import AnalyticsCards from 'components/Revenue/components/Common/AnalyticsCards';
import LastCheckDateFilter from 'components/Revenue/components/Common/LastCheckDateFilter';
import { setStateIfDeepEqual } from 'components/Shared/functions';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';

const useStyles = makeStyles(theme => ({
	root: {
		margin: '75px 0 10px',
	},
	propertyTableContainer: {
		paddingTop: theme.spacing(1),
		marginLeft: '-8px',
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					maxHeight: '67vh',
					minHeight: '67vh',
					'@media (max-height:1600px)': {
						maxHeight: '65vh',
						minHeight: '65vh',
					},
					'@media (max-height:1400px)': {
						maxHeight: '63vh',
						minHeight: '63vh',
					},
					'@media (max-height:1300px)': {
						maxHeight: '61vh',
						minHeight: '61vh',
					},
					'@media (max-height:1200px)': {
						maxHeight: '58vh',
						minHeight: '58vh',
					},
					'@media (max-height:1100px)': {
						maxHeight: '53vh',
						minHeight: '53vh',
					},
					'@media (max-height:1000px)': {
						maxHeight: '49vh',
						minHeight: '49vh',
					},
					'@media (max-height:900px)': {
						maxHeight: '44vh',
						minHeight: '44vh',
					},
					'@media (max-height:850px)': {
						maxHeight: '42vh',
						minHeight: '42vh',
					},
					'@media (max-height:800px)': {
						maxHeight: '40vh',
						minHeight: '40vh',
					},
					'@media (max-height:768px)': {
						maxHeight: '37vh',
						minHeight: '37vh',
					},
				},
			},
		},
	},

	propertyTableInfContainer: {
		paddingTop: theme.spacing(1),
		marginLeft: '-8px',
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
	},
}));

export default function Properties() {
	const classes = useStyles();

	const { stateValues } = globalStateController.useState(['globalSearch']);
	const propertiesTableState = tableController('PropertiesTable').useState([
		'filters',
		'data',
		'globalFilter',
	]).stateValues;

	const [filterToggle, setFilterToggle] = React.useState(false);

	// props to pass in table
	const esIndex = 'properties_flat';

	const [esFilters, ESFilters] = useState([]);

	const setESFilters = (newFilter, oldFilters) => {
		if (newFilter.length === 0) {
			ESFilters([]);
			tableController('PropertiesTable').clearFilters();
		}

		setStateIfDeepEqual(ESFilters, newFilter);

		setTimeout(() => {
			if (oldFilters && oldFilters?.length) {
				oldFilters.forEach(filter => {
					tableController('PropertiesTable').clearFilter(filter.field);
				});
			}
		}, 100);
	};

	useEffect(() => {
		return () => {
			globalStateController.updateState({ globalSearch: '' });
		};
	}, []);

	useEffect(() => {
		tableController('PropertiesTable').setFilters(esFilters);
	}, [esFilters]);

	useEffect(() => {
		tableController('PropertiesTable').setGlobalFilter(stateValues.globalSearch);
	}, [stateValues.globalSearch]);

	// cards default
	const cardsDefault = [
		{
			heading: 'Total Properties',
			points: 0,
		},
		{
			heading: 'In Pay',
			points: 0,
			key: 'inpay',
			filterable: true,
		},
		{
			heading: 'Not In Pay',
			points: 0,
			key: 'notinpay',
			filterable: true,
		},
		{
			heading: 'Unmapped',
			key: 'unmapped',
			points: 0,
			type: 'warning',
			filterable: true,
		},
	];

	return (
		<div className={classes.root}>
			<LastCheckDateFilter
				field={'lastCheck.checkDate'}
				esIndex={esIndex}
				esFilters={propertiesTableState.filters}
				setESFilters={setESFilters}
				setFilterToggle={setFilterToggle}
				filterToggle={filterToggle}
				extraFitlers={['status', 'propertyGroup']}
			/>
			<AnalyticsCards
				esIndex={esIndex}
				esFilters={propertiesTableState.filters}
				cardsDefault={cardsDefault}
				totalCount={propertiesTableState?.data?.total}
				landSearchQuery={stateValues.globalSearch}
				setESFilters={setESFilters}
				filterToggle={filterToggle}
				setFilterToggle={setFilterToggle}
				clearFilter={tableController('PropertiesTable').clearFilter}
			/>
			<div className={classes.propertyTableInfContainer}>
				<MRTTable name="PropertiesTable" />
			</div>
		</div>
	);
}
