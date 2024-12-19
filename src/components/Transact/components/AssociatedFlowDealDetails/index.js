import React, { useState, useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'AppContext';
import { get } from 'lodash';
import Card from '@material-ui/core/Card';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setMapGridCardState } from 'actions';
import OwnersSummaryCard from 'components/OwnersSummaryCard/OwnersSummaryCard';
import { TabPanel } from 'components/Shared/TabPanels';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { contactDetailInitialData } from './data';
import { mapControlsController } from 'hookstate/mapControlsController';
import RelatedUnitInterestTable from 'components/Common/RelatedTables/Units/unitInterests';
import RelatedTractInterestTable from 'components/Common/RelatedTables/Tracts/tractInterests';

const useStyles = makeStyles(theme => ({
	card: {
		width: '72vw',
		height: '50vh',
		position: 'absolute',
		zIndex: 9999,
		bottom: 0,
		left: 0,
	},
	dockMenu: {
		width: '100%',
		height: '50vh',
	},
	tapsRoot: {
		// flexGrow: 1,
		'& .MuiTab-root': {
			textTransform: 'none',
		},
	},
	appBar: {
		backgroundColor: '#F2F2F2',
		borderBottom: '1px solid rgba(224, 224, 224, 1)',
		boxShadow: 'none',
		color: '#757575',
		cursor: 'context-menu',
		'& .MuiIconButton-root:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
		'& button': {
			cursor: 'pointer',
		},
	},
	tapsPanels: {
		'& .MuiBox-root': { padding: '0' },
	},
	tapsPanelsPadding: {
		'& .MuiBox-root': { padding: '0', height: '100%' },
	},
	mainPanelsDiv: {
		height: '100%',
		maxHeight: '100vh',
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
					height: 'calc(50vh - 128px) !important',
				},
			},
		},
	},
	tapsLabelsButtons: {
		boxShadow: 'none',
		backgroundColor: '#fff',
		color: '#757575',
		'&:hover': { boxShadow: 'none !important' },
	},
	tapsLabelsButtonsSelected: {
		boxShadow: 'none',
		color: '#fff',
		backgroundColor: theme.palette.secondary.main,
		'&:hover': { color: '#757575', boxShadow: 'none !important' },
	},
	viewportWells: {
		textAlign: ({ viewportWells }) => (viewportWells ? 'inherit' : 'center'),
		'& #minimumZoomRequired': {
			margin: '30px',
			fontSize: '1.25rem',
			fontFamily: 'Poppins',
			fontWeight: '500',
			lineHeight: '1.6',
			display: ({ viewportWells }) => (viewportWells ? 'none' : 'block'),
		},
		'& #viewportWellsTable': {
			display: ({ viewportWells }) => (viewportWells ? 'block' : 'none'),
		},
	},
	selectBoundary: {
		background: 'white',
		width: '180px',
		height: '35px',
		marginTop: '6px',
		marginBottom: '6px',
		marginLeft: '10px',
		'& .MuiSelect-select.MuiSelect-select': {
			paddingLeft: '10px',
		},
	},
	selectorOptions: {
		backgroundColor: '#F2F2F2',
		maxHeight: '49.25vh',
		overflow: 'overlay',
	},
}));

// params:
// contact: ObjectId[]
function AssociatedFlowDetails(props) {
	const [stateApp] = useContext(AppContext);

	const [searchTapValue, SearchTapValue] = useState(contactDetailInitialData[0]);

	const { mapGridCardActiveTap, selectedOwner } = useSelector(({ MapGridCard }) => MapGridCard, shallowEqual);
	const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
	const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

	const dispatch = useDispatch();

	const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');

	const setSearchTapValue = state => {
		if (searchTapValue !== state) {
			SearchTapValue(state);
		}
	};

	// styles
	const classes = useStyles({
		mapLayersPanelExtended,
		mapGridCardActivated: mapControlsStateValues.mapGridCardActivated,
		mapGridCardActiveTap,
		viewportWells: stateApp.viewportWells,
		userGridViewFilters,
		// screenSizes
	});

	const relatedUnitInterestOverride = useMemo(
		() => ({
			tableHeading: 'Unit Interests',
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [
				{ field: 'contact._id', value: props.contacts },
				{ field: 'deals._id', value: props.deal },
				{ field: 'shape.layer.keyword', value: 'unit' },
			],
			refetchQueries: ['flowDealSummary'],
		}),
		[props.contacts, props.deal]
	);

	const relatedTractInterestOverride = useMemo(
		() => ({
			tableHeading: 'Tract Interests',
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [
				{ field: 'contact._id', value: props.contacts },
				{ field: 'deals._id', value: props.deal },
				{ field: 'shape.layer.keyword', value: 'parcel' },
			],
			refetchQueries: ['flowDealSummary'],
		}),
		[props.contacts, props.deal]
	);

	const handleSearchPanelChange = value => {
		setSearchTapValue(value);
		if (searchTapValue.index !== value.index) {
			dispatch(setMapGridCardState({ searchResultData: [], searchloading: true }));
		}
	};

	return (
		<div id="associated-flowdeal-data" className={classes.card}>
			<Card className={classes.dockMenu}>
				{selectedOwner ? (
					<OwnersSummaryCard />
				) : (
					<div className={`cancelDraggableEffect ${classes.mainPanelsDiv}`} style={{ position: 'relative' }}>
						{/* //// search panel //// */}
						<TabPanel
							value={mapGridCardActiveTap}
							index={0}
							className={classes.tapsPanelsPadding}
							style={{ width: '100%', height: '100%' }}
						>
							<Grid container direction="row" style={{ height: '100%', marginBottom: '20px' }}>
								<Grid item md={2} className={classes.selectorOptions}>
									<Typography variant="h6" component="h1" style={{ fontWeight: 'bold', padding: '10px 0px 0px 20px' }}>
										Associated Data
									</Typography>

									<List component="nav" aria-label="main mailbox folders">
										{contactDetailInitialData.map(row => {
											const Icon = row.Icon;
											return (
												<ListItem
													button
													selected={row.value === searchTapValue.value}
													onClick={() => handleSearchPanelChange(row)}
												>
													<ListItemIcon style={{ minWidth: '40px' }}>
														<Icon />
													</ListItemIcon>
													<ListItemText
														id={row.label}
														// TODO: Get Summary of flow associated data
														primary={`${row.label} (${get(props.dealSummaryData, `flowDealSummary.data.${row.value}`, 0)})`}
													/>
												</ListItem>
											);
										})}
									</List>
								</Grid>

								<Grid item md={10} style={{ padding: '0px' }}>
									<div style={{ position: 'relative' }} classes={classes.gridTables}>
										{searchTapValue.value === 'unitInterests' && (
											<RelatedUnitInterestTable
												id="relatedUnitInterestsTable"
												overrideMeta={relatedUnitInterestOverride}
											/>
										)}
										{searchTapValue.value === 'parcelInterests' && (
											<RelatedTractInterestTable
												id="relatedTractInterestsTable"
												overrideMeta={relatedTractInterestOverride}
											/>
										)}
									</div>
								</Grid>
							</Grid>
						</TabPanel>
					</div>
				)}
			</Card>
		</div>
	);
}

export default AssociatedFlowDetails;
