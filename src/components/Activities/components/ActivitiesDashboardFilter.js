import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';

import ActivitiesFilters from './ActivitiesFilters';

const useStyles = makeStyles(theme => ({
	actionBar: {
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
	},
	actionsGrid: {
		marginTop: '6px',
		'& .MuiButtonBase-root': {
			width: '149px',
			height: '35px',
			fontWeight: 'bold',
		},
	},
	propertyTableContainer: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: '38px',
		paddingRight: '38px',
		marginTop: theme.spacing(2),
	},
	label: {
		fontSize: 16,
		fontWeight: 'bold',
	},
}));

const ActivitiesDashboardFilter = ({
	esIndex,
	searchFields,
	setFilterToggle,
	filterToggle,
	setAppliedFilters,
	tableFilters,
	appliedFilters,
	minDate,
	label,
}) => {
	const classes = useStyles();

	const [fromDate, setFromDate] = useState(null);
	const [toDate, setToDate] = useState(null);
	const [campaigns, setCampaigns] = useState('');
	const [qualifier, setQualifier] = useState('');

	useEffect(() => {
		setFromDate(`${moment(minDate).startOf('month').format('yyyy-MM-DD')}`);
	}, [minDate]);
	useEffect(() => {
		if (fromDate === 'Invalid date' || toDate === 'Invalid date') return;
		setAppliedFilters({ fromDate, toDate, campaigns, qualifier });
		setFilterToggle(prev => !prev);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromDate, toDate, campaigns, qualifier]);
	return (
		<div className={classes.actionBar}>
			<Grid container direction="row" display="flex" justify="space-between" style={{ padding: '0px 36px 0px 45px' }}>
				<Grid item xs={12} md={12} lg={12} xl={12} style={{ marginTop: '4px' }}>
					<ActivitiesFilters
						isActivity
						fromDate={fromDate}
						setFromDate={setFromDate}
						toDate={toDate}
						setToDate={setToDate}
						minDate={minDate}
						campaigns={campaigns}
						setCampaigns={setCampaigns}
						qualifier={qualifier}
						setQualifier={setQualifier}
						esIndex={esIndex}
						searchFields={searchFields}
						tableFilters={tableFilters}
						appliedFilters={appliedFilters}
						setFilterToggle={setFilterToggle}
						filterToggle={filterToggle}
						setAppliedFilters={setAppliedFilters}
						label={label}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default ActivitiesDashboardFilter;
