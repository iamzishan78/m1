import React, { useState, useContext, useEffect, useMemo } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from 'AppContext';
import { useLazyQuery } from '@apollo/client';
import Card from '@material-ui/core/Card';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setMapGridCardState } from 'actions';
import OwnersSummaryCard from 'components/OwnersSummaryCard/OwnersSummaryCard';
import { TabPanel } from 'components/Shared/TabPanels';
import ContactDetailedInfo from 'components/ContactDetailedInfo/ContactDetailedInfo';
import ActivitiesTable from 'components/Table/Activities/ActivitiesTable';
import RelatedContactsTable from 'components/Table/Contact/RelatedContactTable';
import ContactTaxRollInterestTable from 'components/Table/Contact/ContactTaxRollInterestTable';
import ContactRelatedAgreementTable from 'components/Table/Contact/ContactRelatedAgreementTable';
import ContactDealsProvider from 'components/DealsDetailCard/ContactDealsProvider';
import ContactDocumentsProvider from 'components/ViewDocuments/ContactDocumentsProvider';

import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { contactDetailInitialData } from './data';

import { CONTACT_SUMMARY } from 'graphQL/useQueryContactSummary';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
import MRTTable from 'components/MRTTable';

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

function MapGridCard(props) {
	// contexts
	const [stateApp, setStateApp] = useContext(AppContext);

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
		if (props.contactData._id)
			getContactSummary({
				variables: {
					contactId: props.contactData._id,
				},
			});
	}, [getContactSummary, props.contactData]);

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
		if (props.purchaseData.length > 0) {
			// Sort the purchase data by the system date time in descending order (latest first)
			const sortedPurchaseData = sortBy(props.purchaseData, item => moment(item.sysDateTime).valueOf()).reverse();
			setSortedPurchaseData(sortedPurchaseData); // Update the state with the sorted purchase data
		}
	}, [props.purchaseData]);

	// If the ducument component is loading as Associated data, isExpanded should be false
	useEffect(() => {
		if (searchTapValue?.value === 'documents') {
			setStateApp(stateApp => ({ ...stateApp, isExpanded: false }));
		}
	}, [searchTapValue, setStateApp]);

	const contactWellInterestOverride = useMemo(
		() => ({
			defaultFilters: [{ field: 'contact._id', value: props.contactData._id || '' }],
			customProps: {
				contactId: props.contactData._id,
			},
			refetchQueries: ['getContactSummary'],
		}),
		[props.contactData._id]
	);

	const contactlUnitInterestOverride = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'shape.layer', value: 'unit' },
				{ field: 'contact._id', value: props.contactData._id || '' },
			],
			refetchQueries: ['getContactSummary'],
		}),
		[props.contactData._id]
	);

	const contactTractInterestOverride = useMemo(
		() => ({
			defaultFilters: [
				{ field: 'shape.layer', value: 'parcel' },
				{ field: 'contact._id', value: props.contactData._id || '' },
			],
			customProps: {
				contactId: props.contactData._id,
			},
			refetchQueries: ['getContactSummary'],
		}),
		[props.contactData._id]
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
												contactData={props.contactData}
												handleQuickActionActivity={props.handleQuickActionActivity}
											/>
										)}
										{searchTapValue.value === 'activities' && (
											<ActivitiesTable
												esIndex={'activities_flat'}
												id="activitiesInterestsTable"
												searchFields={['name', '_all']}
												filtersChange={() => {}}
												appliedFilters={[
													{
														field: 'contactName.keyword',
														value: props.contactData?.name,
													},
												]}
												filterToggle={() => {}}
												targetLabel={'activitiesDashboard'}
												header="Activities"
												parent="assocTaxRollInterests"
												addAble={{ type: 'contactActivity' }}
												onAddActivity={props.onAddActivity}
												dialogType="activitySideDialog"
												applyCustomClasses
											/>
										)}
										{searchTapValue.value === 'taxRollInterests' && (
											<ContactTaxRollInterestTable
												parent="assocTaxRollInterests"
												id="taxInterestsTable"
												header={'Tax Roll Interests'}
												targetLabel="well"
												contactId={props.contactData._id}
												showTracks
											/>
										)}
										{searchTapValue.value === 'wellInterests' && (
											<MRTTable name="ContactWellInterestTable" overrideMeta={contactWellInterestOverride} />
										)}
										{searchTapValue.value === 'unitInterests' && (
											<MRTTable name="ContactDetailUnitInterestTable" overrideMeta={contactlUnitInterestOverride} />

											// <UnitInterestsTable
											// 	parent="assocTaxRollInterests"
											// 	header={'Unit Interests'}
											// 	targetLabel="contactUnits"
											// 	id="unitInterestTable"
											// 	esFilters={[{ field: 'contact._id', value: props.contactData._id }]}
											// 	esIndex="shapeowners_flat"
											// 	setESFilters={() => {}}
											// 	onTractCount={() => {}}
											// />
										)}
										{searchTapValue.value === 'tractInterests' && (
											<MRTTable name="ContactDetailTractInterestTable" overrideMeta={contactTractInterestOverride} />

											// <ContactParcelInterestTable
											// 	parent="contactAssocTaxRollInterests"
											// 	header={'Tract Interests'}
											// 	id="tractInterestTable"
											// 	targetLabel="parcel"
											// 	contactId={props.contactData._id}
											// 	showTracks
											// />
										)}
										{searchTapValue.value === 'deals' && <ContactDealsProvider />}
										{searchTapValue.value === 'documents' && (
											<ContactDocumentsProvider contactId={props.contactData._id} />
										)}
										{searchTapValue.value === 'relatedContacts' && (
											<RelatedContactsTable contactId={props.contactData._id} />
										)}
										{searchTapValue.value === 'relatedAgreements' && (
											<ContactRelatedAgreementTable
												dense
												moduleId={props.contactData._id}
												setDrawer={props.setDrawer}
												setCounter={() => {}}
												esFilters={[{ field: 'contact._id', value: props.contactData._id }]}
												targetLabel="Shape"
												setESFilters={() => {}}
												onTractCount={() => {}}
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

export default MapGridCard;
