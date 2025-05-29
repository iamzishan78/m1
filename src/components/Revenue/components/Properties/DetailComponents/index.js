import React, { useState, useRef, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

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
	Dialog,
} from '@material-ui/core';
import {
	DescriptionOutlined as DocumentIcon,
	InfoOutlined as InfoOutlinedIcon,
	MoreHoriz as MoreHorizIcon,
	Delete as DeleteIcon,
} from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/styles';

import { useLazyQuery, useMutation } from '@apollo/client';
import { get } from 'lodash';

import AddNewRelatedAgreementDialog from 'components/Land/components/Agreements/detailComponents/relatedAgreements/AddNewRelatedAgreementDialog';
import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import MetadataDrawer from 'components/Revenue/components/Common/MetadataDrawer';
import NavHeader from 'components/Revenue/components/Common/NavHeader';
import Validation from 'components/Revenue/components/Properties/DetailComponents/Validation';
import DocViewer from 'components/Shared/DocViewer';
import { copy } from 'components/Shared/functions';
import Tags from 'components/Shared/Tagger';

import { UPDATE_PROPERTY } from 'graphQL/useMutationUpdateProperty';
import { UPSERT_USER_DESCRIPTOR } from 'graphQL/useMutationUserDescriptor';
import { GET_PROPERTY } from 'graphQL/useQueryGetProperty';
import { IFARECONTACTS } from 'graphQL/useQueryIfOwnersAreContacts';

import { detailCardController } from 'stateManagement/detailCardController';

import { MultipleOwnerToContactDrawerContainer } from 'store/containers';
import { ConvertOwnerToContactContainer } from 'store/containers/entity';

import { getIdFromPath } from 'utils/helper';

import { AppContext } from 'AppContext';

import HeaderSection from './HeaderSection';
import InterestDetailForm from './InterestDetailForm';
import PropertyInterestDetailsSection from './PropertyInterestDetailsSection';

const useStyles = makeStyles(() => ({
	root: {
		height: '100vh',
		backgroundColor: '#f3f3f3',
		width: '100%',
	},
	navSection: {
		minHeight: '52px',
		padding: '10px 20px',
		backgroundColor: '#fff',
	},
	detailHeader: {
		backgroundColor: '#fff',
		padding: '20px 27px 0px 45px',
		marginTop: '7px',
	},
	title: {
		display: 'flex',
	},
	titleText: {
		marginLeft: 16,
		width: 'calc(65vw - 10px)',
	},
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	highlighter: {
		background: '#263451',
		padding: '5px 16px',
		borderRadius: 5,
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
	headerSection: {
		padding: '20px 30px',
		backgroundColor: '#fff',
		marginBottom: '20px',
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
	},
	tabsDetailContainer: ({ showInterestDetails, collapse, isNewAgmt }) => ({
		padding: 20,
		width: showInterestDetails || !collapse || isNewAgmt ? 'calc(100% - 644px)' : '100%',
	}),
	menuIcon: {
		background: 'transparent',
		align: 'center',
		'& svg': {
			fill: '#808080 !important',
		},
	},
	sideModal: {
		marginTop: 24,
		padding: '16px 10px',
		background: '#ffffff',
		borderRadius: 8,
		overflow: 'auto',
		height: 'calc(100vh - 280px)',
		maxHeight: 'calc(100vh - 280px)',
		maxWidth: 360,
		width: '100%',
	},
	tags: {
		'& fieldset': {
			border: 'none',
		},
		width: '100%',
	},
	actionsContainer: {
		display: 'flex',
		direction: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
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
	metaActions: ({ collapse }) => ({
		marginTop: '2px',
		'& button': {
			backgroundColor: !collapse ? '#eceded' : '#fff',
			color: 'grey',
			fontWeight: 'bold',
			textTransform: 'capitalize',
			padding: '6px 12px',
			'&:hover': {
				backgroundColor: !collapse ? '#eceded' : '#fff',
			},
		},
	}),
	tabsSectionDetails: {
		maxHeight: 'calc(100vh - 280px)',
		overflow: 'overlay',
		backgroundColor: '#f3f3f3',
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

const THEME_SPACING = 4;
const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(THEME_SPACING),
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

export default function DetailComponents(props) {
	const history = useHistory();
	const [stateApp, setStateApp] = useContext(AppContext);

	const { stateValues } = detailCardController.useState(['summaryData']);
	const propertyData = stateValues.summaryData;

	const propertyId = getIdFromPath(history.location.pathname);
	const [propertyOwnerContact, setPropertyOwnerContacts] = useState([]);
	const [showInterestDetails, setShowInterestDetails] = useState(false);
	const [showOwnerDialog, setShowOwnerDialog] = useState(false);
	const [selectedInterest, setSelectedInterest] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [tab, setTab] = useState(0);
	const [refetchContacts, setRefetchContacts] = useState(false);
	const selectedTabRef = useRef(null);
	const [collapse, setCollapse] = useState(true);
	const [anchorEl, setAnchorEl] = useState();
	const [propertyDetails, setProperty] = useState(null);
	const [entityToConvert, setEntityToConvert] = useState(null);
	const [isNewAgmt, setNewAgmtState] = useState(false);

	const classes = useStyles({ ...props, showInterestDetails, collapse, isNewAgmt });

	const [updateMetaOwner] = useMutation(UPSERT_USER_DESCRIPTOR);
	const [updateProperty] = useMutation(UPDATE_PROPERTY);

	const [getProperty, { data: getPropertyResult }] = useLazyQuery(GET_PROPERTY, {
		fetchPolicy: 'no-cache',
	});

	const [checkIfOwnersAreContacts, { data: checkIfOwnersAreContactsData }] = useLazyQuery(IFARECONTACTS, {
		fetchPolicy: 'cache-and-network',
	});

	useEffect(() => {
		getProperty({
			variables: { id: propertyId },
		});
	}, [getProperty, propertyId]);

	useEffect(() => {
		if (getPropertyResult) {
			setProperty(getPropertyResult?.getProperty.property);
			const propertyData = getPropertyResult?.getProperty.property;

			detailCardController.updateState({
				summaryData: copy({ ...propertyData, systemId: propertyData?._id }),
			});

			const idsArray = [];
			if (propertyData?.owner) {
				idsArray.push(propertyData.owner?._id);
			}
			if (propertyData?.operator) {
				idsArray.push(propertyData?.operator?._id);
			}
			if (idsArray.length > 0) {
				checkIfOwnersAreContacts({
					variables: { idsArray },
				});
			}
		}
		setStateApp(state => ({
			...state,
			selectedRevenueProperty: getPropertyResult?.getProperty.property,
		}));
	}, [getPropertyResult]);

	useEffect(() => {
		selectedTabRef.current &&
			selectedTabRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'start',
			});
	}, [tab]);

	useEffect(() => {
		const idsArray = [];
		if (propertyDetails?.owner) {
			idsArray.push(propertyDetails.owner._id);
		}
		if (propertyDetails?.operator) {
			idsArray.push(propertyDetails.operator._id);
		}
		if (idsArray.length > 0) {
			checkIfOwnersAreContacts({
				variables: { idsArray },
			});
		}
	}, [propertyDetails, refetchContacts]);

	useEffect(() => {
		if (checkIfOwnersAreContactsData?.ifAreContacts?.length > 0) {
			setPropertyOwnerContacts(
				checkIfOwnersAreContactsData?.ifAreContacts.map(c => ({
					_id: c.isContact,
					name: c.name,
					entityId: c._id,
				}))
			);
			const owner = checkIfOwnersAreContactsData?.ifAreContacts.map(c => ({
				contactId: c.isContact,
				name: c.name,
				_id: c._id,
			}));
			const updatePropertyData = {
				...propertyData,
				owner: owner[0],
			};

			detailCardController.updateState({
				summaryData: updatePropertyData,
			});
		}
	}, [checkIfOwnersAreContactsData]);

	const deleteFunc = () => {
		updateProperty({
			variables: {
				property: {
					_id: propertyDetails._id,
					IsDeleted: true,
				},
			},
		}).then(() => {
			history.push('/revenue/properties');
		});
	};

	const onUpdateMetaData = data => {
		if (data.owner) {
			updateMetaOwner({
				variables: {
					descriptorObject: data.owner,
					userId: stateApp.user.mongoId,
					relatedObject: propertyDetails._id,
					relatedObjectType: 'Property',
				},
			});
		} else {
			updateProperty({
				variables: {
					property: {
						_id: propertyId,
						...data,
					},
				},
				refetchQueries: ['getProperty'],
				awaitRefetchQueries: true,
			});
		}
	};

	return (
		<NavHeader title={`${get(propertyDetails, 'number', '')}-${get(propertyDetails, 'name', '')}`}>
			{/**
			 * Detail title section
			 */}
			<div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
				<div className="flex column alignStart justifyStart w-100">
					<div className={classes.title}>
						<IconButton className={classes.icon}>
							<DocumentIcon />
						</IconButton>
						<div className={classes.titleText}>
							{propertyDetails && (
								<Typography style={{ fontWeight: 'bold', fontSize: 'large', marginLeft: 8 }}>
									{propertyDetails.name}
								</Typography>
							)}
							<div className={classes.tagsContainer}>
								<div className={classes.highlighter}>
									<Typography className={classes.highlight} variant="highlight">
										Property
									</Typography>
								</div>
								<div className={classes.tags}>
									<Tags targetSourceId={propertyId} width="100%" targetLabel="check" publicLeftBottom onlyTags />
								</div>
							</div>
						</div>
					</div>

					<div className={classes.actionsContainer}>
						<div className={classes.tabsHeader}>
							<StyledTabs
								value={tab}
								onChange={(event, tab) => {
									// setButtonScroll(true);
									setTab(tab);
								}}
								aria-label="ant example"
							>
								<StyledTab label="Details" />
								<StyledTab label="Validation" />
							</StyledTabs>
						</div>
						<div className={classes.metaActions}>
							<Button startIcon={<InfoOutlinedIcon />} onClick={() => setCollapse(!collapse)}>
								Metadata
							</Button>
							<IconButton
								size="small"
								component="span"
								className={classes.menuIcon}
								onClick={event => setAnchorEl(event.currentTarget)}
							>
								<MoreHorizIcon size="medium" />
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
						{tab === 0 && (
							<div className={classes.tabsSectionDetails}>
								<div className={classes.headerSection}>
									<HeaderSection
										propertyId={propertyId}
										propertyDetails={propertyDetails}
										propertyOwnerContact={propertyOwnerContact}
										setEntityToConvert={setEntityToConvert}
									/>
								</div>
								<div>
									<PropertyInterestDetailsSection
										propertyId={propertyId}
										setSelectedInterest={setSelectedInterest}
										showInterestDetails={showInterestDetails}
										onClickAdd={() => setShowInterestDetails(true)}
										setNewAgmtState={setNewAgmtState}
									/>
								</div>
							</div>
						)}
						{tab === 1 && <Validation propertyId={propertyId} />}
					</div>
					{stateApp.viewDoc && <DocViewer divCondition={true} DocStyle={{ height: 'calc(100vh - 280px)' }} />}
				</div>
				{showOwnerDialog && (
					<ConvertOwnerToContactContainer
						propertyDetails={propertyDetails}
						onClose={() => setShowOwnerDialog(false)}
						onSuccess={() => setRefetchContacts(!refetchContacts)}
					/>
				)}
				{showInterestDetails && (
					<InterestDetailForm
						propertyDetails={propertyDetails}
						selectedInterest={selectedInterest}
						setShowOwnerDialog={setShowOwnerDialog}
						propertyOwnerContact={propertyOwnerContact?.find(owner => owner.entityId === propertyDetails?.owner?._id)}
						onClose={() => setShowInterestDetails(false)}
					/>
				)}

				{entityToConvert && (
					<MultipleOwnerToContactDrawerContainer
						onClose={() => setEntityToConvert(null)}
						rows={[entityToConvert]}
						setM1nSelectedRowsIndexes={() => {}}
						onSuccess={() => setRefetchContacts(!refetchContacts)}
						setRows={() => {}}
					/>
				)}

				{((!collapse && !showInterestDetails && !showOwnerDialog) || isNewAgmt) && (
					<div
						style={{
							marginTop: 20,
							marginRight: 24,
							height: 'calc(100vh - 270px)',
							width: '620px',
							maxWidth: '620px',
							overflowY: 'auto',
						}}
					>
						{!isNewAgmt ? (
							<MetadataDrawer
								data={propertyDetails}
								onUpdate={onUpdateMetaData}
								setCollapse={setCollapse}
								targetLabel="Property"
								targetSourceId={propertyId}
								setStateApp={setStateApp}
								ownerTitle="Approver"
								isApproval={true}
								height="100vh"
								showCommentType
							/>
						) : (
							<AddNewRelatedAgreementDialog
								customLayerId={propertyId}
								setDrawer={value => setNewAgmtState(value === 'agrmt')}
								parentType="Property"
							/>
						)}
					</div>
				)}
			</div>
			<Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth={true} maxWidth={'sm'}>
				<DeleteConfirmationDialog
					header={'Delete Property'}
					onClose={() => setOpenDeleteDialog(false)}
					deleteFunc={deleteFunc}
				>
					{'Do you want to delete this property?'}
				</DeleteConfirmationDialog>
			</Dialog>
			{/**
			 * Menu for meta data
			 */}
			<Menu
				id="revPropertyMenu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				className={classes.menu}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<MenuItem onClick={() => setOpenDeleteDialog(true)}>
					<ListItemIcon>
						<DeleteIcon size="medium" />
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
		</NavHeader>
	);
}
