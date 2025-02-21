import React, { useState, useEffect, useMemo } from 'react';

import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import vf_number, { vf_number_to_precision } from 'components/Shared/valueformatters/vf_number';

import { tableController } from 'controllers/tableController';

import { GET_CAMPAIGN_ANALYTICS } from 'graphQL/useQueryCampaignAnalytics';

import { getActivityAnalyticsFilters } from 'utils/helper';

const useStyles = makeStyles(() => ({
	card: { borderRadius: '8px' },
	cardHeaderTypography: {
		fontWeight: 'bolder',
		marginBottom: '25px',
	},
	cardNumberTypography: {
		fontWeight: 900,
		fontSize: 'xx-large',
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '160px',
		textAlign: 'left',
	},
	issuesBadges: {
		display: 'flex',
		alignItems: 'center',
		color: '#ff0000',
		height: '20px',
	},
	tooltip: {
		position: 'absolute',
		top: 72,
		color: 'rgb(255, 0, 0)',
		width: 200,
		left: -148,
	},
	tooltipText: {
		fontSize: 14,
		lineHeight: '120%',
		textAlign: 'left',
	},
}));

export default function CampaignAnalytics({ contactSearchQuery, TableKey }) {
	const classes = useStyles();
	const [analyticsData, setAnalyticsData] = useState({});
	const precision = 9;

	const { filters } = tableController(TableKey).useState(['filters']);

	const [getCampaignAnalytics, { data }] = useLazyQuery(GET_CAMPAIGN_ANALYTICS, {
		fetchPolicy: 'no-cache',
	});

	const appliedFilters = useMemo(() => tableController(TableKey)?.getExternalFilter(), [filters]);

	useEffect(() => {
		if (data?.campaignAnalytics) {
			setAnalyticsData(data?.campaignAnalytics);
		}
	}, [data]);

	// Wrap non-empty query with '*' to use a contains expression; otherwise, use '*'
	const query = contactSearchQuery ? `*${contactSearchQuery}*` : '*';
	useEffect(() => {
		getCampaignAnalytics({
			variables: {
				search: {
					// Synced fileds with ESSimpleSeach
					fields: ['name.keyword', 'status.keyword', 'owner.name.keyword', 'tags.tag.keyword'],
					query,
				},
				filters: getActivityAnalyticsFilters(appliedFilters),
			},
		});
	}, [contactSearchQuery, appliedFilters, getCampaignAnalytics]);

	return (
		<Grid
			style={{ marginTop: 0, marginBottom: 0 }}
			container
			direction="row"
			display="flex"
			align="center"
			spacing={4}
			textAlign="left"
			className={classes.root}
		>
			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Total Campaigns
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{vf_number(get(analyticsData, 'total', 0))}
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Open Campaigns
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{vf_number(get(analyticsData, 'openCampaigns', 0))}
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Closed Campaigns
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{vf_number(get(analyticsData, 'closeCampaigns', 0))}
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item md={3} style={{ position: 'relative' }}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Total NRA
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{vf_number_to_precision(get(analyticsData, 'totalNra'), precision)}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

CampaignAnalytics.propTypes = {
	TableKey: PropTypes.string.isRequired,
	contactSearchQuery: PropTypes.string.isRequired,
};
