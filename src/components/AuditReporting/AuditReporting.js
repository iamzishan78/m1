import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';

import ActivitiesDashboardFilter from 'components/Activities/components/ActivitiesDashboardFilter';
import ActivityAnalytics from 'components/Activities/components/ActivityAnalytics';
import { GET_ES_MIN_VALUE } from 'graphQL/useQueryESMinValue';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '90px',
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					maxHeight: '53vh',
					minHeight: '53vh',
					'@media (max-height:900px)': {
						maxHeight: '47vh',
						minHeight: '47vh',
					},
					'@media (max-height:800px)': {
						maxHeight: '45vh',
						minHeight: '45vh',
					},
					'@media (max-height:768px)': {
						maxHeight: '45vh',
						minHeight: '45vh',
					},
				},
			},
		},
	},
}));

const ActivitiesDashboard = () => {
	const classes = useStyles();
	const esIndex = 'contacts_flat';
	const searchFields = ['name', '_all'];
	const [filterToggle, setFilterToggle] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState({
		toDate: null,
		fromDate: null,
		filter: 'audit',
	});
	const [tableFilters, setTableFilters] = useState([]);
	const [minDate, setMinDate] = useState('');

	const [getESMinValue] = useLazyQuery(GET_ES_MIN_VALUE, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.getESMinValue) {
				setFilterToggle(!filterToggle);
				setMinDate(data?.getESMinValue);
			}
		},
	});

	useEffect(() => {
		getESMinValue({
			variables: {
				esIndex,
				field: 'lastUpdateAt',
				value_as_string: true,
			},
		});
	}, [getESMinValue]);

	const filtersChange = filters => {
		setTableFilters(filters);
	};

	return (
		<div className={classes.root}>
			{
				<ActivitiesDashboardFilter
					esIndex={esIndex}
					searchFields={searchFields}
					setFilterToggle={setFilterToggle}
					filterToggle={filterToggle}
					tableFilters={tableFilters}
					appliedFilters={appliedFilters}
					minDate={minDate}
					setAppliedFilters={setAppliedFilters}
					label={'User'} // to pass the dynamic label in filter
				/>
			}
			{
				<ActivityAnalytics
					esIndex={esIndex}
					filterToggle={filterToggle}
					tableFilters={tableFilters}
					appliedFilters={appliedFilters}
					setAppliedFilters={setAppliedFilters}
				/>
			}
		</div>
	);
};

export default ActivitiesDashboard;
