import { useLazyQuery, useMutation } from '@apollo/client';
import {
	Typography,
	IconButton,
	Tabs,
	Tab,
	Button,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';
import {
	DescriptionOutlined as DocumentIcon,
	InfoOutlined as InfoOutlinedIcon,
	Delete as DeleteIcon,
	MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/styles';
import { get, set } from 'lodash';
import moment from 'moment';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import LegalDescription from 'components/Land/components/Agreements/detailComponents/legalDescription';
import Provisions from 'components/Land/components/Agreements/detailComponents/provisions';
import RelatedAgreementsTable from 'components/Land/components/Agreements/detailComponents/relatedAgreements';
import AddNewRelatedAgreementDialog from 'components/Land/components/Agreements/detailComponents/relatedAgreements/AddNewRelatedAgreementDialog';
import RelatedParties from 'components/Land/components/Agreements/detailComponents/relatedParties';
import RelatedWells from 'components/Land/components/Agreements/detailComponents/relatedWells';
import Summary from 'components/Land/components/Agreements/detailComponents/summary';
import NavHeader from 'components/Land/components/Common/NavHeader';
import MapProvider from 'components/Map/MapProvider';
import MetadataDrawer from 'components/Revenue/components/Common/MetadataDrawer';
import DocViewer from 'components/Shared/DocViewer';
import { copy } from 'components/Shared/functions';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import MapImgViewIcon from 'components/Shared/svgIcons/MapImgViewIcon';
import Tags from 'components/Shared/Tagger';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { GET_AGREEMENT_PROVISIONS } from 'graphQL/useQueryGetAgreementProvisions';
import { GET_STANDARD_PROVISIONS } from 'graphQL/useQueryGetStandardProvisions';
import { SHAPE_SUMMARY_DETAILS } from 'graphQL/useQueryShapeSummaryDetail';

import { detailCardController } from 'hookstate/detailCardController';
import { jobController } from 'hookstate/jobStateController';
import { tableGlobalController } from 'hookstate/tableController';

import { PaymentFeatureTenants } from 'utils/data';

import { setLandReduxKey } from 'actions';
import { AppContext } from 'AppContext';

// Components

// import { UPSERT_USER_DESCRIPTOR } from "graphQL/useMutationUserDescriptor";

import { DrawerContext } from './DrawerContext';
import RelatedDocumets from './relatedDocuments';
import RelatedPayments from './relatedPayments';

const useStyles = makeStyles(theme => ({
	mapProvider: {
		position: 'relative',
		zIndex: '9999',
		height: 'calc(100vw - 63vw)',
	},
	detailHeader: {
		backgroundColor: '#fff',
		padding: '20px 27px 0px 45px',
		marginTop: '7px',
	},
	title: {
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	titleText: {
		marginLeft: 16,
		width: '100%',
	},
	highlighter: {
		background: '#263451',
		padding: '5px 16px',
		borderRadius: 4,
		width: 'max-content',
		transform: 'translateX(5px) translateY(11px)',
		height: '32px',
	},
	highlight: {
		color: '#ffffff',
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
	icon: {
		height: 80,
		width: 80,
		backgroundColor: '#d5f4ff',
		borderRadius: 12,
		'& svg': {
			fontSize: '3.1875rem',
			fill: '#263451',
		},
	},
	tabsHeader: {
		background: '#ffffff',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	tabsSection: {},
	tabDetailSection: {
		padding: 20,
		background: '#ffffff',
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	tags: {
		'& fieldset': {
			border: 'none',
		},
		width: '100%',
	},
	tabsSectionDetails: {
		maxHeight: 'calc(100vh - 280px)',
		overflow: 'overlay',
		backgroundColor: '#f3f3f3',
	},
	actionsContainer: {
		display: 'flex',
		direction: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	metaActions: {
		marginTop: '2px',
		'& button': {
			margin: '0px 5px',
			color: 'grey',
			fontWeight: 'bold',
			textTransform: 'capitalize',
			padding: '6px 12px',
		},
	},
	metaButton: ({ drawer }) => ({
		backgroundColor: drawer === 'meta' ? '#eceded' : '#fff',
		'&:hover': {
			backgroundColor: drawer ? '#eceded' : '#fff',
		},
	}),
	mapButton: ({ mapCollapse }) => ({
		backgroundColor: !mapCollapse ? '#eceded' : '#fff',
		'&:hover': {
			backgroundColor: !mapCollapse ? '#eceded' : '#fff',
		},
	}),
	validationButton: ({ validationCollapse }) => ({
		backgroundColor: !validationCollapse ? '#eceded' : '#fff',
		'&:hover': {
			backgroundColor: !validationCollapse ? '#eceded' : '#fff',
		},
	}),
	flowlineButton: ({ flowlineCollapse }) => ({
		backgroundColor: !flowlineCollapse ? '#eceded' : '#fff',
		'&:hover': {
			backgroundColor: !flowlineCollapse ? '#eceded' : '#fff',
		},
	}),
	menu: {
		'& .MuiListItem-gutters': {
			paddingLeft: '10px !important',
			paddingRight: '10px !important',
		},
		'& .MuiListItem-root': {
			'& .MuiListItemIcon-root': {
				minWidth: '25px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
	tabsDetailContainer: ({ drawer }) => ({
		padding: 20,
		width: '100%',
	}),
	menuIcon: {
		marginLeft: 10,
		background: 'transparent',
		align: 'center',
		'& svg': {
			fill: '#808080 !important',
		},
	},
}));

const StyledTabs = withStyles({
	root: {
		textTransform: 'capitalize',
	},
	indicator: {
		backgroundColor: '#12abe0',
		height: '5px',
	},
})(Tabs);

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(4),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: 'black',
			opacity: 1,
		},
		'&$selected': {
			color: 'black',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&:focus': {
			color: 'black',
		},
	},
	selected: {},
}))(props => <Tab disableRipple {...props} />);

export function DetailComponents(props) {
	const { id: agreementId } = useParams();
	const dispatch = useDispatch();
	const history = useHistory();
	const agreementDetails = useSelector(({ Land }) => Land.agreement?.activeAgreement?.shape)?.properties;
	const activeAgreement = useSelector(({ Land }) => Land.agreement?.activeAgreement);
	const [stateApp, setStateApp] = useContext(AppContext);
	const [drawer, setDrawer] = useContext(DrawerContext);
	const isPaymentTenant = PaymentFeatureTenants.includes(window.sessionStorage?.getItem('tenantName').toLowerCase());

	const [tab, setTab] = useState(0);
	const sectionsRef = useRef([]); // References for all tab sections
	const observer = useRef(null); // Intersection Observer reference
	const selectedTabRef = useRef(null);
	// const [isNewAgmt, setNewAgmtState] = useState(false);
	const [isButtonScroll, setButtonScroll] = useState(false);
	const [mapCollapse, setMapCollapse] = useState(true);
	const [validationCollapse] = useState(true);
	const [flowlineCollapse] = useState(true);
	const [anchorEl, setAnchorEl] = useState();
	const [uniObj, setUniObj] = useState();
	const [openDialog, setOpenDialog] = useState(false);
	const classes = useStyles({ ...props, drawer, validationCollapse, flowlineCollapse, mapCollapse });
	// queries

	const [getCustomLayer, { data: dataCustomLayer }] = useLazyQuery(CUSTOMLAYER);
	const [getStandardProvisions, { data: standardProvisions }] = useLazyQuery(GET_STANDARD_PROVISIONS);
	const [getAgreementProvisions, { data: agreementProvisions }] = useLazyQuery(GET_AGREEMENT_PROVISIONS);
	const [getShapeSummaryDetails, { data: dataShapeSummaryDetails }] = useLazyQuery(SHAPE_SUMMARY_DETAILS);
	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);
	// const [updateMetaData] = useMutation(UPSERT_USER_DESCRIPTOR);

	useEffect(() => {
		return () => {
			dispatch(
				setLandReduxKey('agreement', {
					activeAgreement: {},
				})
			);
		};
	}, [dispatch]);

	useEffect(() => {
		if (agreementId) {
			getAgreementProvisions({ variables: { agreementId: agreementId } });
		}
	}, [agreementId, getAgreementProvisions]);

	useEffect(() => {
		getStandardProvisions();
	}, [getStandardProvisions]);

	useEffect(() => {
		if (selectedTabRef?.current && isButtonScroll) {
			selectedTabRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'start',
			});
		}
	}, [tab, isButtonScroll]);

	useEffect(() => {
		if (agreementId) {
			getCustomLayer({ variables: { id: agreementId } });
		}
	}, [agreementId, getCustomLayer]);

	useEffect(() => {
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			detailCardController.updateState({ customLayer: dataCustomLayer.customLayer });
			let shape = JSON.parse(dataCustomLayer.customLayer.shape);
			if (dataCustomLayer.customLayer.shapeJson) {
				shape = copy(dataCustomLayer.customLayer.shapeJson);
			}

			shape.id = dataCustomLayer.customLayer._id;
			shape.properties.id = dataCustomLayer.customLayer._id;
			shape.layer = { id: dataCustomLayer.customLayer.layer };
			setStateApp(state => ({
				...state,
				selectedShape: { ...shape.properties, shape },
			}));
			dispatch(
				setLandReduxKey('agreement', {
					activeAgreement: {
						...dataCustomLayer.customLayer,
						shape,
					},
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataCustomLayer?.customLayer]);

	useEffect(() => {
		if (activeAgreement) {
			let shape = activeAgreement.shape;
			if (activeAgreement.shapeJson) {
				shape = copy(activeAgreement.shapeJson);
			}
			setUniObj({
				...activeAgreement,
				shape,
			});
		}
	}, [activeAgreement]);

	useEffect(() => {
		if (activeAgreement?._id) {
			getShapeSummaryDetails({
				variables: {
					shapeId: activeAgreement._id,
					shapeType: 'Agreement',
				},
			});
		}
	}, [activeAgreement, getShapeSummaryDetails]);

	useEffect(() => {
		const escapeFunc = e => {
			if (e.key === 'Escape') {
				setMapCollapse(true);
			}
		};
		document.addEventListener('keyup', escapeFunc);
		return () => {
			setStateApp({ ...stateApp, viewDoc: null });
			document.removeEventListener('keyup', escapeFunc);
			tableGlobalController.updateState({
				paymentMultiGrid: { showMultiGrid: false },
			});
			detailCardController.updateState({ customLayer: null });
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateAgreement = (field, value, isCustom) => {
		if (agreementDetails[field] === value) {
			return;
		}
		const shape = activeAgreement.shape;
		if (field === 'agreementTerm' || field === 'effectiveDate') {
			if (field === 'agreementTerm') {
				shape.properties.expirationDate = moment(shape.properties.effectiveDate, 'YYYY-MM-DD')
					.add(parseInt(value), 'months')
					.format('YYYY-MM-DD');
			} else {
				shape.properties.expirationDate = moment(value, 'YYYY-MM-DD')
					.add(parseInt(shape.properties.agreementTerm), 'months')
					.format('YYYY-MM-DD');
			}
		}
		//support for extensionTerm
		if (field === 'extensionTerm' || field === 'expirationDate') {
			if (field === 'extensionTerm') {
				shape.properties.extensionDate = moment(shape.properties.expirationDate, 'YYYY-MM-DD')
					.add(parseInt(value), 'months')
					.format('YYYY-MM-DD');
			} else {
				shape.properties.extensionDate = moment(value, 'YYYY-MM-DD')
					.add(parseInt(shape.properties.extensionTerm), 'months')
					.format('YYYY-MM-DD');
			}
		}
		// Used for Agreement nra, net_acres and grossAcres overidden
		if (value?.overridden?.toString()) {
			set(shape, `properties.overridden.${field}`, value.overridden);
			value = value.value;
		}
		set(shape, `properties.${field}`, value);
		const customLayer = {};
		let shapeLabel = shape.properties.shapeLabel;
		if (field === 'agreementNumber') {
			shapeLabel = `${value}${shape.properties.agreementName ? `-${shape.properties.agreementName}` : ''}`;
		}

		if (field === 'agreementName') {
			shapeLabel = `${shape.properties.agreementNumber ? `${shape.properties.agreementNumber}-` : ''}${value}`;
		}

		if (field === 'agreementType') {
			customLayer.layer = value;
		}
		if (field === 'state') {
			if (shape.properties.originalProperties) {
				shape.properties.originalProperties.County = undefined;
				shape.properties.originalProperties.State = value;
				shape.properties.originalProperties.StateAbbreviation = value;
			} else {
				shape.properties.originalProperties = { State: value, StateAbbreviation: value };
			}
		}
		if (field === 'county') {
			if (shape.properties.originalProperties) {
				shape.properties.originalProperties.County = value;
			} else {
				shape.properties.originalProperties = { County: value };
			}
		}

		shape.properties.shapeLabel = shapeLabel;
		shape.name = shapeLabel;
		shape.properties.name = shapeLabel;
		customLayer.shape = JSON.stringify(shape);
		customLayer.shapeJson = shape;

		updateCustomLayer({
			variables: {
				customLayerId: activeAgreement._id,
				customLayer,
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['customLayer', 'getAllLayerSettingsByUser'],
			awaitRefetchQueries: true,
		});
	};

	useEffect(() => {
		// Set up Intersection Observer
		observer.current = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						// Get the index of the currently visible section
						const index = sectionsRef.current.indexOf(entry.target);
						setTab(index);
					}
				});
			},
			{
				root: null, // Defaults to the viewport
				threshold: 0.1, // At least 50% of the section must be visible
			}
		);

		// Observe all sections
		sectionsRef.current.forEach(section => {
			if (section) {
				observer.current.observe(section);
			}
		});

		// Cleanup observer on unmount
		return () => {
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, []);

	const handleMenuClick = event => setAnchorEl(event.currentTarget);

	const handleDeleteAgreement = () => {
		updateCustomLayer({
			variables: {
				customLayerId: dataCustomLayer?.customLayer?._id,
				customLayer: {
					IsDeleted: true,
				},
			},
			refetchQueries: ['getAllLayerSettingsByUser'],
			awaitRefetchQueries: true,
		}).then(({ data }) => {
			jobController.toggleBulkUpload();
			if (data.updateCustomLayer?.success) {
				history.push('/land/agreements');
			}
		});
	};

	const handleMetaToggle = () => {
		setDrawer(prevState => (prevState === 'meta' ? null : 'meta'));
	};

	const handleTabChange = (event, newTab) => {
		sectionsRef.current[newTab]?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
		});
	};

	return (
		<NavHeader title={`${agreementDetails?.agreementNumber} - ${agreementDetails?.agreementName}`}>
			{/**
			 * Detail title section
			 */}
			<div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
				<div className="flex column alignStart justifyStart w-100">
					<div className={classes.title}>
						<IconButton className={classes.icon}>
							<DocumentIcon id="documentIcon" />
						</IconButton>
						<div className={classes.titleText}>
							{agreementDetails && (
								<Typography
									style={{
										fontWeight: 'bold',
										fontSize: 'large',
										marginLeft: 8,
									}}
								>{`${agreementDetails?.agreementNumber} - ${agreementDetails?.agreementName}`}</Typography>
							)}
							<div className={classes.tagsContainer}>
								<div className={classes.highlighter}>
									<Typography className={classes.highlight} variant="highlight">
										{agreementDetails?.agreementType}
									</Typography>
								</div>
								<div className={classes.tags}>
									<Tags width="100%" targetSourceId={agreementId} targetLabel="agreement" publicLeftBottom onlyTags />
								</div>
							</div>
						</div>
					</div>

					<div className={classes.actionsContainer}>
						<div className={classes.tabsHeader}>
							<StyledTabs value={tab} id={'header-tabs'} onChange={handleTabChange} aria-label="ant example">
								<StyledTab id="summaryTab" label="Summary" />
								<StyledTab label="Parties" />
								<StyledTab id="provisionsTab" label="Provisions" />
								{isPaymentTenant && <StyledTab id="paymentsTab" label="Payments" />}
								<StyledTab id="legalDescriptionTab" label="Legal Description" />
								<StyledTab id="wellsTab" label="Wells" />
								<StyledTab id="documentsTab" label="Documents" />
								<StyledTab id="relatedAgreementsTab" label="Related Agreements" />
								{/* <StyledTab label="Related Info" /> */}
							</StyledTabs>
						</div>
						<div className={classes.metaActions}>
							{/* temp hide these buttons until we add the functionality -kc 20220520 */}
							{/* <Button
                startIcon={<RuleIcon />}
                className={classes.validationButton}
                onClick={() => setValidationCollapse(!validationCollapse)}
              >
                Validation
              </Button>
              <Button startIcon={<FlowIcon />} className={classes.flowlineButton} onClick={() => setFlowlineCollapse(!flowlineCollapse)}>
                Flowline
              </Button> */}
							<Button
								startIcon={<MapImgViewIcon />}
								className={classes.mapButton}
								onClick={() => {
									setButtonScroll(true);
									setTab(0);
									setMapCollapse(o => !o);
								}}
							>
								Map View
							</Button>
							<Button
								id="metaDataButton"
								startIcon={<InfoOutlinedIcon />}
								className={classes.metaButton}
								onClick={handleMetaToggle}
							>
								Metadata
							</Button>
							<IconButton size="small" component="span" className={classes.menuIcon} onClick={handleMenuClick}>
								<MoreHorizIcon id="moreHorizIcon" size="medium" />
							</IconButton>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justifyBetween alignStart w-100">
				<div className={classes.tabsDetailContainer}>
					{/**
					 * Detail tabs section
					 */}

					<div className={classes.tabsSection} style={{ display: stateApp.viewDoc ? 'none' : '' }}>
						<div id="parent-div" className={classes.tabsSectionDetails}>
							{mapCollapse ? (
								<div
									id="summary-div"
									className={classes.tabDetailSection}
									ref={el => sectionsRef.current.push(el)}
									style={{ backgroundColor: '#fff' }}
								>
									<Summary
										flexDirection={drawer ? 'column' : 'row'}
										agreementDetails={agreementDetails}
										activeAgreement={activeAgreement}
										agreementProvisions={get(agreementProvisions, 'getAgreementProvisions', [])}
										standardProvisions={get(standardProvisions, 'getStandardProvisions', [])}
										updateAgreement={updateAgreement}
										shapeSummaryDetails={dataShapeSummaryDetails?.shapeSummaryDetails}
									/>
								</div>
							) : (
								<div
									id="summary-div"
									ref={el => sectionsRef.current.push(el)}
									className={`${classes.mapProvider}  summary-div-small-map`}
								>
									<MapProvider
										match={{
											params: {
												expandedPanel: false,
												openSpeedDial: false,
												mapControls: false,
												hideShape: true,
												paramId: agreementId,
												layerPadding: { padding: { top: 50, bottom: 50, left: !drawer ? 300 : 700, right: 20 } },
											},
										}}
									></MapProvider>
								</div>
							)}
							<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
							<div
								id="related-parties-div"
								className={classes.tabDetailSection}
								ref={el => sectionsRef.current.push(el)}
							>
								<RelatedParties agreementDetails={agreementDetails} agreementId={agreementId} />
							</div>
							<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
							<div id="provisions-div" className={classes.tabDetailSection} ref={el => sectionsRef.current.push(el)}>
								<Provisions
									agreementDetails={agreementDetails}
									agreementId={agreementId}
									agreementProvisions={get(agreementProvisions, 'getAgreementProvisions', [])}
									standardProvisions={get(standardProvisions, 'getStandardProvisions', [])}
								/>
							</div>
							<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
							{isPaymentTenant && (
								<>
									<div id="payments-div" className={classes.tabDetailSection} ref={el => sectionsRef.current.push(el)}>
										<RelatedPayments />
									</div>
									<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
								</>
							)}
							<div
								id="legal-description-div"
								className={classes.tabDetailSection}
								ref={el => sectionsRef.current.push(el)}
							>
								<LegalDescription
									agreementDetails={agreementDetails}
									uniObj={uniObj}
									agreementId={agreementId}
									updateAgreement={updateAgreement}
								/>
							</div>
							<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
							<div id="related-wells-div" className={classes.tabDetailSection} ref={el => sectionsRef.current.push(el)}>
								<RelatedWells uniObj={uniObj} shapeSummaryDetails={dataShapeSummaryDetails?.shapeSummaryDetails} />
							</div>
							<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
							<div id="related-docs-div" className={classes.tabDetailSection} ref={el => sectionsRef.current.push(el)}>
								<RelatedDocumets uniObj={uniObj} setDrawer={setDrawer} />
							</div>
							<div style={{ backgroundColor: '#f3f3f3 !important', height: 24 }} />
							<div id="related-agrmt-div" className={classes.tabDetailSection} ref={el => sectionsRef.current.push(el)}>
								<RelatedAgreementsTable uniObj={uniObj} setDrawer={setDrawer} drawer={drawer} />
							</div>
						</div>
					</div>

					{/*** Component for viewing selected pdf file*/}
					{stateApp.viewDoc && <DocViewer divCondition={true} DocStyle={{ height: 'calc(100vh - 280px)' }} />}
				</div>

				{drawer === 'meta' && (
					<MetadataDrawer
						setCollapse={value => setDrawer(!value)}
						targetSourceId={agreementId}
						data={agreementDetails}
						targetLabel="Shape"
						showDescription={false}
						descriptionKey="description"
						ownerPlaceHolder="Assign Approver"
						ownerTitle="Approver"
						onUpdate={data => Object.keys(data).forEach(key => updateAgreement(key, data[key]))}
						isSource={false}
						shapeType="Agreement"
						shapeData={activeAgreement}
						isApproval
						showCommentType
					/>
				)}
				{drawer === 'agrmt' && (
					<AddNewRelatedAgreementDialog
						customLayerId={get(dataCustomLayer, 'customLayer._id')}
						setDrawer={setDrawer}
						parentType="Agreement"
					/>
				)}
			</div>

			{/**
			 * Menu for meta data
			 */}
			<Menu
				id="revStatementMenu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				className={classes.menu}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<MenuItem
					onClick={() => {
						setOpenDialog(true);
						setAnchorEl(null);
					}}
				>
					<ListItemIcon>
						<DeleteIcon size="medium" />
					</ListItemIcon>
					<ListItemText id="deleteItem">Delete</ListItemText>
				</MenuItem>
			</Menu>

			{/**
			 * Delete Custom Layer confirmation dialog
			 * */}
			{openDialog && (
				<DeleteConfirmationDialogContent
					header="Delete Agreement"
					onClose={() => setOpenDialog(false)}
					deleteFunc={handleDeleteAgreement}
					m1nSelectedRowsIds={null}
					setM1nSelectedRowsIndexes={() => {}}
				>
					Are you sure you want to delete this agreement?
				</DeleteConfirmationDialogContent>
			)}
		</NavHeader>
	);
}
