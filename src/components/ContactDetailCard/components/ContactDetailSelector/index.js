import { useLazyQuery } from '@apollo/client';

import ContactTaxRollInterestTable from 'components/Table/Contact/ContactTaxRollInterestTable';
import ContactDealsProvider from 'components/DealsDetailCard/ContactDealsProvider';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { get } from 'lodash';

import moment from 'moment';
import sortBy from 'lodash/sortBy';
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MRTTable from 'components/MRTTable';
import RelatedDocumentsTable from 'components/Common/RelatedTables/Documents';
import ContactDetailedInfo from 'components/ContactDetailedInfo/ContactDetailedInfo';
import { DrawerContextProvider } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import ActivitiesToolbar from 'components/MRTTable/TablesOverride/ContactDetailActivities/ActivitiesToolbar';
import OwnersSummaryCard from 'components/OwnersSummaryCard/OwnersSummaryCard';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { TabPanel } from 'components/Shared/TabPanels';

import { CONTACT_SUMMARY } from 'graphQL/useQueryContactSummary';

import { setMapGridCardState } from 'actions';
import { AppContext } from 'AppContext';

import { contactDetailInitialData } from './data';

const useStyles = makeStyles(theme => ({
	card: {
		width: '100%',
		'& .MuiInput-inputTypeSearch': {
			width: '96%',
		},
	},
	rootList: {
		width: ({ mapGridCardActivated }) =>
			mapGridCardActivated === 'min' ? '57vw' : mapGridCardActivated === 'exp' ? '96vw' : '57vw',
		height: ({ mapGridCardActivated }) =>
			mapGridCardActivated === 'min' ? '60vh' : mapGridCardActivated === 'exp' ? '91vh' : '60vh',
		left: ({ mapGridCardActivated, expandGrid }) => (mapGridCardActivated === 'exp' ? '2vw' : '2vw'),
		top: ({ mapGridCardActivated }) => (mapGridCardActivated === 'exp' ? '5vh' : '12vh'),
		zIndex: '1300',
		position: 'fixed',
	},
	dockMenu: {
		width: '100%',
		height: 'auto', // height as auto
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
		'& .MuiBox-root': { padding: '0' },
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

function MapGridCard({ contactData, purchaseData, handleQuickActionActivity }) {
	// contexts
	const [stateApp, setStateApp] = useContext(AppContext);
	const maxTableHeight = 'calc(50vh - 100px)';

	const [getContactSummary, { data: contactSummaryData }] = useLazyQuery(CONTACT_SUMMARY);

	// function state
	const [searchTapValue, SearchTapValue] = useState(contactDetailInitialData[0]);

	// selectorsW
	const { mapGridCardActivated, mapGridCardActiveTap, selectedOwner } = useSelector(
		({ MapGridCard }) => MapGridCard,
		shallowEqual
	);
	const mapLayersPanelExtended = useSelector(({ MainMap }) => MainMap.mapLayersPanelExtended);
	const userGridViewFilters = useSelector(({ session }) => session.userGridViewSettings?.filters);

	const dispatch = useDispatch();
	// Initialize state to hold sorted purchase data
	const [sortedPurchaseData, setSortedPurchaseData] = useState([]);

	useEffect(() => {
		if (contactData._id) {
			getContactSummary({
				variables: {
					contactId: contactData._id,
				},
			});
		}
	}, [getContactSummary, contactData]);

	const setSearchTapValue = state => {
		if (searchTapValue !== state) {
			SearchTapValue(state);
		}
	};

	// styles
	const classes = useStyles({
		mapLayersPanelExtended,
		mapGridCardActivated,
		mapGridCardActiveTap,
		viewportWells: stateApp.viewportWells,
		userGridViewFilters,
		// screenSizes
	});

	const handleSearchPanelChange = value => {
		setSearchTapValue(value);
		if (searchTapValue.index !== value.index) {
			dispatch(setMapGridCardState({ searchResultData: [], searchloading: true }));
		}
	};

	useEffect(() => {
		if (purchaseData.length > 0) {
			// Sort the purchase data by the system date time in descending order (latest first)
			const sortedPurchaseData = sortBy(purchaseData, item => moment(item.sysDateTime).valueOf()).reverse();
			setSortedPurchaseData(sortedPurchaseData); // Update the state with the sorted purchase data
		}
	}, [purchaseData]);

	// If the ducument component is loading as Associated data, isExpanded should be false
	useEffect(() => {
		if (searchTapValue?.value === 'documents') {
			setStateApp(stateApp => ({ ...stateApp, isExpanded: false }));
		}
	}, [searchTapValue, setStateApp]);

	const contactWellInterestOverride = useMemo(
		() => ({
			defaultFilters: [{ field: 'contact._id', value: contactData._id || '' }],
			customProps: {
				contactId: contactData._id,
			},
			refetchQueries: ['getContactSummary'],
		}),
		[contactData._id]
	);

	const contactlUnitInterestOverride = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'shape.layer.keyword', value: 'unit' },
				{ field: 'contact._id', value: contactData._id || '' },
			],
			refetchQueries: ['getContactSummary'],
		}),
		[contactData._id]
	);

	const contactTractInterestOverride = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'shape.layer.keyword', value: 'parcel' },
				{ field: 'contact._id', value: contactData._id || '' },
			],
			customProps: {
				contactId: contactData._id,
			},
			refetchQueries: ['getContactSummary'],
		}),
		[contactData._id]
	);

	const RelatedAgreementOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'relatedParties.contactId', value: contactData._id }],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: {
					key: 'relatedParties',
					func: relatedParties => relatedParties.find(rp => rp.contactId === contactData._id)?._id,
				},
			},
			customValue: { campaign: contactData._id },
			refetchQueries: ['getContactSummary'],
		}),
		[contactData._id]
	);

	const ContactDetailActivitiesOverrideMeta = useMemo(
		() => ({
			defaultFilters: [
				{
					field: ['contactId', 'relatedContacts._id'],
					value: contactData?._id,
					oRFilter: true,
				},
			],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: contactData?._id },
			},
			customValue: { parentRecord: contactData?._id },
			maxTableHeight,
			CustomToolBar: ActivitiesToolbar,
			refetchQueries: ['getContactSummary'],
			isDeleteDisabled: true,
		}),
		[contactData?._id]
	);

	const ContactDetailContactsOverrideMeta = useMemo(
		() => ({
			defaultFilters: [{ field: 'relatedContacts.relatedObject', value: contactData?._id, isArrayKey: true }],
			maxTableHeight,
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: contactData?._id },
			},
			customProps: { contactId: contactData?._id },
			customValue: { parentRecord: contactData?._id },
			refetchQueries: ['getContactSummary'],
		}),
		[contactData?._id]
	);

	const RelatedDocumentsOverrideMeta = useMemo(
		() => ({
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [{ field: 'contacts._id', value: contactData?._id }],
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: contactData?._id },
			},
			customValue: { parentRecord: contactData?._id },
			columnReordering: false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[contactData?._id]
	);

	return (
		<div className={classes.card}>
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
												<FeatureFlag feature={row.feature} noCheck={!row.feature}>
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
															primary={`${row.label} ${
																row.showCounts ? `(${get(contactSummaryData, `contactSummary.${row.value}`, 0)})` : ''
															}`}
														/>
													</ListItem>
												</FeatureFlag>
											);
										})}
									</List>
								</Grid>

								<Grid item md={10} style={{ padding: '0px' }}>
									<div style={{ position: 'relative' }} classes={classes.gridTables}>
										{searchTapValue.value === 'contactInformation' && (
											<ContactDetailedInfo
												user={stateApp.user}
												purchaseData={sortedPurchaseData}
												contactData={contactData}
												handleQuickActionActivity={handleQuickActionActivity}
											/>
										)}
										{searchTapValue.value === 'activities' && (
											<MRTTable
												name="ContactDetailActivitiesTable"
												overrideMeta={ContactDetailActivitiesOverrideMeta}
											/>
										)}
										{searchTapValue.value === 'taxRollInterests' && (
											<ContactTaxRollInterestTable
												parent="assocTaxRollInterests"
												id="taxInterestsTable"
												header={'Tax Roll Interests'}
												targetLabel="well"
												contactId={contactData._id}
												showTracks
											/>
										)}
										{searchTapValue.value === 'wellInterests' && (
											<MRTTable name="ContactWellInterestTable" overrideMeta={contactWellInterestOverride} />
										)}
										{searchTapValue.value === 'unitInterests' && (
											<MRTTable name="ContactDetailUnitInterestTable" overrideMeta={contactlUnitInterestOverride} />
										)}
										{searchTapValue.value === 'tractInterests' && (
											<MRTTable name="ContactDetailTractInterestTable" overrideMeta={contactTractInterestOverride} />
										)}
										{searchTapValue.value === 'deals' && <ContactDealsProvider />}
										{searchTapValue.value === 'documents' && (
											<DrawerContextProvider>
												<RelatedDocumentsTable
													id="relatedDocumentsTable"
													moduleId={contactData?._id}
													overrideMeta={RelatedDocumentsOverrideMeta}
													relatedObjectType="Contact"
												/>
											</DrawerContextProvider>
										)}
										{searchTapValue.value === 'relatedContacts' && (
											<MRTTable name="ContactDetailContactsTable" overrideMeta={ContactDetailContactsOverrideMeta} />
										)}
										{searchTapValue.value === 'relatedAgreements' && (
											<MRTTable name="ContactDetailAgreementsTable" overrideMeta={RelatedAgreementOverrideMeta} />
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

export default MapGridCard;
