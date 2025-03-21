import React, { useMemo } from 'react';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import MRTTable from 'components/MRTTable';
import useTabedTablesUnmount from 'components/MRTTable/Hooks/useTabedTablesUnmount';

import { tableGlobalController } from 'stateManagement/tableController';

import { campaignInitialData } from './data';

const useStyles = makeStyles(theme => ({
	card: {
		width: '100%',
		'& .MuiInput-inputTypeSearch': {
			width: '96%',
		},
	},
	dockMenu: {
		width: '100%',
	},
	mainPanelsDiv: {
		height: '100%',
		maxHeight: 'calc(100vh - 493px)',
		position: 'relative',
		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 10,
		},
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					[theme.breakpoints.up('xl')]: {
						height: 'calc(50vh + 50px) !important',
					},
					[theme.breakpoints.down('xl')]: {
						height: 'calc(35vh) !important',
					},
				},
			},
		},
	},
	selectorOptions: {
		backgroundColor: '#F2F2F2',
		overflow: 'overlay',
	},
}));

function CamapignRelatedGrids({ campaign }) {
	const classes = useStyles();
	const globalSelectedTabKey = tableGlobalController.useState(['tabKey'])?.stateValues;

	useTabedTablesUnmount();

	const setSearchTapValue = state => {
		tableGlobalController.setSelectedTab(state?.index);
	};

	const campaignUnitInterestoverrideMeta = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'shape.layer.keyword', value: 'unit' },
				{ field: 'campaigns', value: { _id: campaign?._id, name: campaign?.name } },
				{ field: 'contact.IsDeleted', value: 'false' },
				{ field: 'shape.IsDeleted', value: 'false' },
			],
			gridViewSettings: null,
			fetchMetaData: null,
			deletedKeys: {
				mainRecord: { key: '_id' },
				campaigns: {
					key: 'campaigns',
					func: campaigns => campaigns.filter(c => c._id !== campaign?._id),
				},
			},
			customValue: { campaign: campaign },
			maxTableHeight: '35vh',
			columnVirtualization: false,
		}),
		[campaign?._id]
	);

	const campaignUnitoverrideMeta = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'layer.keyword', value: 'unit' },
				{ field: 'shapeJson.properties.campaigns', value: { _id: campaign?._id, name: campaign?.name } },
			],
			gridViewSettings: null,
			fetchMetaData: null,
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: campaign?._id },
				customlayers: {
					key: 'shapeJson',
					func: shapeJson => {
						return {
							shapeJson: {
								...shapeJson,
								properties: {
									...shapeJson.properties,
									campaigns: shapeJson?.properties?.campaigns?.filter?.(c => c._id !== campaign?._id) || [],
								},
							},
						};
					},
				},
			},
			customValue: { parentRecord: campaign?._id, campaign: campaign },
			customProps: {
				campaign,
				exportValues: {
					'Campaign System ID': campaign?._id,
					'Campaign Name': campaign?.name,
				},
			},
			isCampaignRefetch: true,
			maxTableHeight: '35vh',
			columnVirtualization: false,
		}),
		[campaign?._id]
	);

	const campaignContactoverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'campaigns', value: { _id: campaign?._id, name: campaign?.name } }],
			gridViewSettings: null,
			fetchMetaData: null,
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: campaign?._id },
			},
			customProps: {
				campaign,
				exportValues: {
					'Campaign System ID': campaign?._id,
					'Campaign Name': campaign?.name,
				},
			},
			customValue: { parentRecord: campaign?._id },
			isCampaignRefetch: true,
			showAddContactButton: false,
			maxTableHeight: '35vh',
			columnVirtualization: false,
		}),
		[campaign?._id]
	);

	const campaignTractOverrideMeta = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'layer.keyword', value: 'parcel' },
				{ field: 'shapeJson.properties.campaigns', value: { _id: campaign?._id, name: campaign?.name } },
			],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { key: '', func: () => campaign?._id },
				customlayers: {
					key: 'shapeJson',
					func: shapeJson => {
						return {
							shapeJson: {
								...shapeJson,
								properties: {
									...shapeJson.properties,
									campaigns: shapeJson?.properties?.campaigns?.filter?.(c => c._id !== campaign?._id) || [],
								},
							},
						};
					},
				},
			},
			customValue: { parentRecord: campaign?._id, campaign: campaign },
			isCampaignRefetch: true,
			maxTableHeight: '35vh',
			columnVirtualization: false,
			gridViewSettings: null,
			fetchMetaData: null,
		}),
		[campaign?._id]
	);

	const campaignTractInterestOverrideMeta = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'shape.layer.keyword', value: 'parcel' },
				{ field: 'contact.IsDeleted', value: 'false' },
				{ field: 'shape.IsDeleted', value: 'false' },
				{ field: 'campaigns', value: { _id: campaign?._id, name: campaign?.name } },
			],
			deletedKeys: {
				mainRecord: { key: '_id' },
				campaigns: {
					key: 'campaigns',
					func: campaigns => campaigns.filter(c => c._id !== campaign?._id),
				},
			},
			customValue: { campaign: campaign },
			isCampaignRefetch: true,
			maxTableHeight: '35vh',
			gridViewSettings: null,
			columnVirtualization: false,
			fetchMetaData: null,
		}),
		[campaign?.name]
	);

	return (
		<div className={classes.card}>
			<Card className={classes.dockMenu}>
				<div style={{ position: 'relative' }}>
					{/* //// search panel //// */}
					<Grid container direction="row" style={{ height: '100%' }}>
						<Grid item md={2} className={classes.selectorOptions}>
							<Typography variant="h6" component="h1" style={{ fontWeight: 'bold', padding: '10px 0px 0px 20px' }}>
								Campaign Details
							</Typography>

							<List component="nav" aria-label="main mailbox folders">
								{campaignInitialData.map(row => {
									const { Icon } = row;
									return (
										<ListItem
											key={row.index}
											button
											selected={row.index === globalSelectedTabKey.tabKey}
											onClick={() => setSearchTapValue(row)}
										>
											<ListItemIcon style={{ minWidth: '40px' }}>
												<Icon />
											</ListItemIcon>
											<ListItemText id={row.label} primary={row.label} />
										</ListItem>
									);
								})}
							</List>
						</Grid>

						<Grid item md={10} style={{ padding: '0px 0px', overflow: 'overlay' }}>
							<div style={{ position: 'relative' }} className={classes.gridTables}>
								{globalSelectedTabKey.tabKey === 0 && campaign?.name && (
									<MRTTable name="CampaignContactTable" overrideMeta={campaignContactoverrideMeta} />
								)}
								{globalSelectedTabKey.tabKey === 1 && campaign?.name && (
									<MRTTable name="CampaignUnitTable" overrideMeta={campaignUnitoverrideMeta} />
								)}
								{}
								{globalSelectedTabKey.tabKey === 2 && campaign?.name && (
									<MRTTable name="CampaignUnitInterestTable" overrideMeta={campaignUnitInterestoverrideMeta} />
								)}
								{}
								{globalSelectedTabKey.tabKey === 3 && campaign?.name && (
									<MRTTable name="CampaignTractTable" overrideMeta={campaignTractOverrideMeta} />
								)}
								{}
								{globalSelectedTabKey.tabKey === 4 && campaign?.name && (
									<MRTTable name="CampaignTractInterestTable" overrideMeta={campaignTractInterestOverrideMeta} />
								)}
							</div>
						</Grid>
					</Grid>
				</div>
			</Card>
		</div>
	);
}

CamapignRelatedGrids.propTypes = {
	campaign: PropTypes.object.isRequired,
};

export default CamapignRelatedGrids;
