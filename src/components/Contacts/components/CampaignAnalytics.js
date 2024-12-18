import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useLazyQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import vf_number from 'components/Shared/valueformatters/vf_number';

// Queries
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

export default function CampaignAnalytics({ appliedFilters, contactSearchQuery }) {
	const classes = useStyles();
	const [analyticsData, setAnalyticsData] = useState({});

	const [getCampaignAnalytics] = useLazyQuery(GET_CAMPAIGN_ANALYTICS, {
		fetchPolicy: 'no-cache',
		onCompleted: data => {
			if (data?.campaignAnalytics) {
				setAnalyticsData(data?.campaignAnalytics);
			}
		},
	});

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
							{vf_number(Math.round(get(analyticsData, 'totalNra', 0)))}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}
