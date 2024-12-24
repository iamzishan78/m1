import { Typography, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

import AdjustmentTable from './AdjustmentTable';
import DonutChart from '../RevenueSection/DonutChart';
import StackedChart from '../RevenueSection/StackedChart';

const useStyles = makeStyles(theme => ({
	sectionTitle: {
		textTransform: 'uppercase',
		fontWeight: theme.typography.fontWeightBold,
	},
	root: {
		padding: '25px 0px 25px 0px',
		width: 'inherit',
		display: 'flex',
		'flex-direction': 'row',
		'align-items': 'stretch',
		'&>div': {
			flex: 1,
		},
	},
}));

const AdjustmentSection = ({ portfolioSummary, loading }) => {
	const classes = useStyles();

	const items = portfolioSummary.adjustmentsDetails || [];
	const total = portfolioSummary.adjustmentTotal || 0;
	const monthsInterval = portfolioSummary.months || [];

	return (
		<>
			{loading ? (
				<CircularProgress size={80} disableShrink color="secondary" />
			) : (
				<>
					<Typography variant="h6" className={classes.sectionTitle}>
						Adjustments
					</Typography>
					<Grid container display="flex" direction="row" justify="flex-start" spacing={4} className={classes.root}>
						<Grid item md={5} style={{ paddingRight: '0px' }}>
							<DonutChart
								items={items.map(item => ({ ...item, total: item?.total?.toFixed(0) }))}
								total={total}
								id="adjustment-chart"
							/>
						</Grid>
						<Grid item md={7}>
							<StackedChart items={items} total={total} monthsInterval={monthsInterval} id="adjustment-chart-stacked" />
						</Grid>
					</Grid>
					<AdjustmentTable monthsInterval={monthsInterval} items={items} total={total} />
				</>
			)}
		</>
	);
};

export default AdjustmentSection;
