import React, { useEffect, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
	Avatar,
	Box,
	Grid,
	Breadcrumbs,
	Typography,
	Card,
	CardHeader,
	CardContent,
	IconButton,
	Tooltip,
	Dialog,
	CircularProgress,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import DrawPoly from '@material-ui/icons/EditLocationOutlined';
import FolderIcon from '@material-ui/icons/Folder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { useLazyQuery, useMutation } from '@apollo/client';
import $ from 'jquery';

import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import { agreementTypes } from 'components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import { modifyExandableCardStyle } from 'components/Shared/functions/shapeLayer';

import { UPDATE_ASSET_SHAPE_LABEL } from 'graphQL/useMutationRunTimeModel';

import { detailCardController } from 'stateManagement/detailCardController';
import { drawController } from 'stateManagement/drawStateController';
import { globalStateController } from 'stateManagement/globalStateController';
import { layerController } from 'stateManagement/layerStateController';
import { popupController } from 'stateManagement/popupStateController';

import { showInfoMessage } from 'actions';

import ReportBugModal from './components/ReportBugModal';
import { ExpandableCardContext } from './ExpandableCardContext';
import { UPDATECUSTOMLAYER } from '../../graphQL/useMutationUpdateCustomLayer';
import { TRACKBYOBJECTID } from '../../graphQL/useQueryTrackByObjectId';
import CommentsWithIcon from '../Shared/CommentsWithIcon';
import LinkWithIcon from '../Shared/LinkWithIcon';
import TaggerWithIcon from '../Shared/TaggerWithIcon';
import TrackToggleButton from '../Shared/TrackToggleButton';
import ContactSearch from './components/ContactSearch';
import ExpandIcon from './components/svgIcons/ExpandIcon';
import ShrinkIcon from './components/svgIcons/ShrinkIcon';

import 'material-icons/iconfont/material-icons.css';

function ExpandableCard(props) {
	// initials
	const history = useHistory();
	const dispatch = useDispatch();

	const [stateExpandableCard, setStateExpandableCard, handleCloseExpandableCard] = useContext(ExpandableCardContext);

	// States
	const [openBugModal, setOpenBugModal] = useState(false);
	const [toggleExpand, setToggleExpand] = useState(false);
	const [isExpanded, setExpanded] = useState([]);
	const [cardWidthExpanded] = useState(props.cardWidthExpanded);
	const [breadcrumbs, setBreadcrumbs] = useState(null);
	const [cardLeft, setCardLeft] = useState(props.cardLeft);
	const [cardTop, setCardTop] = useState(props.cardTop);
	const [width, setWidth] = useState(props.cardWidth);
	const [target, setTarget] = useState({});

	const [openDialog, setOpenDialog] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState();

	const { title, targetLabel, subTitle, parent, targetSourceId, mouseX, mouseY, position, cardWidth } = props;

	const {
		stateValues: { selectedShape, selectedWell },
	} = popupController.useState(['selectedShape', 'selectedWell']);

	const { globalState } = globalStateController.useState(['user', 'currentAsset'], 'globalState');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord'], 'stateValues');

	const handleMenuClick = event => {
		setAnchorEl(event.currentTarget);
	};
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	// Mutation
	const [, { loading: isDeletingCustomLayer }] = useMutation(UPDATECUSTOMLAYER, {
		update(
			cache,
			{
				data: {
					updateCustomLayer: { customLayer },
				},
			}
		) {
			cache.modify({
				_id: cache.identify(customLayer),
				fields: {
					allCustomLayers(existingCustomLayerRefs, { readField }) {
						return existingCustomLayerRefs.filter(
							customLayerRef => customLayer._id !== readField('_id', customLayerRef)
						);
					},
				},
			});
		},
	});

	// Queries
	const [trackByObjectId, { data: dataTrack }] = useLazyQuery(TRACKBYOBJECTID);
	const [updateAssetShapeLabel] = useMutation(UPDATE_ASSET_SHAPE_LABEL, {
		onCompleted: () => {
			layerController.resetBounds(
				currentAssetRecord?.assetShape?.shapeJson?.identifier || currentAssetRecord?.assetShape?.shapeJson?.layer?.id,
				true
			);
		},
	});

	const { backgroundColor, headerIcons, icons, headerLabelColor } = modifyExandableCardStyle(selectedShape);

	const useStyles = makeStyles(() => ({
		root: {
			// zIndex: 88888,
		},

		card: {
			position: position,
			left: cardLeft,
			borderRadius: 0,
			top: cardTop,
			webkitTransform: 'translateZ(0)',
			transition: 'width 0.1s, height 0.1s, left 0.1s, top 0.1s',
			height: props => (props.expanded ? props.height : 'inherit'),
			width: width,
			background: backgroundColor,
			borderStyle: 'solid',
			borderWidth: 'thin',
			borderColor: backgroundColor,
			'& .MuiCardHeader-action': {
				alignSelf: 'left',
			},
			'& .MuiCardHeader-root': {
				borderBottom: '1px solid rgba(224, 224, 224, 1)',
				// padding: "25px 16px !important",
			},
			zIndex: 1222,
		},
		title: {
			fontFamily: 'Poppins',
			color: '#FFFFFF',

			fontSize: ['Contact', 'Contact Details', 'Add Activity', 'Activity Details'].includes(title) ? '20px' : '15px',
		},
		headerIcons: {
			'& .MuiBadge-anchorOriginTopRightRectangle': {
				right: '10px',
				top: '5px',
			},
			...headerIcons,
		},
		subheader: {
			fontFamily: 'Poppins',
			color: '#FFFFFF',
			fontSize: '11px',
		},
		breadcrumb: {
			backgroundColor: '#F2F2F2',
			padding: '15px 20px',
		},
		breadcrumbDiv: {
			display: 'flex',
			color: '#18AADD',
			fontSize: '16px',
			cursor: 'pointer',
		},
		agreementLink: {
			cursor: 'pointer',
			'&:hover': {
				textDecoration: 'underline',
			},
		},
		content: {
			transition: 'height 0.1s',
			background: '#fff',
			padding: '0 !important',
			overflowX: 'hidden',
			overflowY: 'auto',
			'&::-webkit-scrollbar': {
				width: '0.4em',
			},
			'&::-webkit-scrollbar-track': {
				'-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
			},
			'&::-webkit-scrollbar-thumb': {
				backgroundColor: '#929292',
				borderRadius: 5,
			},
			height: stateExpandableCard.expanded ? 'calc(100% - 72px)' : 'fit-content',
		},
		icons: {
			'&:hover': {
				backgroundColor: '#031d40',
			},
			...icons,
			color: 'white',
		},
		iconPolygon: {
			color: '#FFFFFF',
			stroke: '#FFFFFF',
			fill: '#FFFFFF',
			// , marginRight: '10px'
		},
		unitTitle: {
			flexWrap: 'nowrap',
			'& .name': {
				color: '#1a2341',
				textTransform: 'capitalize',
				fontWeight: 'bold',
				fontSize: '19px',
			},
			'& .description': {
				color: headerLabelColor,
			},
			'& .type': {
				color: headerLabelColor,
				fontWeight: 'bold',
			},
			'& .MuiAvatar-root': {
				width: '65px',
				height: '65px',
			},
			'& .MuiSvgIcon-root': {
				color: '#1a2341',
				fontSize: '2.3rem',
			},
		},
		breadcrumContainer: {
			padding: '15px',
			background: 'white',
			color: 'lightgrey',
		},
		unClickable: {
			marginLeft: '10px',
			fontSize: '16px',
		},
		prevlocation: {
			marginLeft: '10px',
			fontSize: '16px',
			cursor: 'pointer',
			'&:hover': {
				color: '#18AADD',
				textDecoration: 'underline',
			},
		},
		currentLocation: {
			color: '#18AADD',
			fontSize: '16px',
		},
		menu: {
			'& .MuiPaper-root': {
				marginTop: '33px',
				marginLeft: '-77px',
				'& .MuiListItemIcon-root': {
					minWidth: '30px',
					'& .MuiSvgIcon-root': {
						fill: 'red !important',
					},
				},
			},
		},
		assetShapeLabel: {
			'& .MuiOutlinedInput-root': {
				borderRadius: '8px',
				backgroundColor: '#ffffff',
				width: '350px',
				'& fieldset': {
					borderColor: '#e0e0e0',
				},
				'&:hover fieldset': {
					borderColor: '#18AADD',
				},
				'&.Mui-focused fieldset': {
					borderColor: '#18AADD',
				},
			},
			'& .MuiInputLabel-root': {
				color: '#666666',
				'&.Mui-focused': {
					color: '#18AADD',
				},
			},
			'& .MuiOutlinedInput-input': {
				padding: '10px 14px',
				fontSize: '14px',
				color: '#333333',
			},
		},
	}));

	const classes = useStyles(props);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search?.replace('?', ''));
		const paramBreadCrumbs = searchParams.get('breadcrumbs');

		if (paramBreadCrumbs === 'Documents') {
			setBreadcrumbs([{ title: 'Documents', url: '/documents' }]);
		} else if (history.location?.state?.showWellBreadcrumb) {
			setBreadcrumbs(history.location?.state?.breadcrumbs);
		}
	}, [history.location?.state?.breadcrumbs, history?.location?.state?.showWellBreadcrumb]);

	useEffect(() => {
		if (globalState.user && globalState.user.mongoId && targetSourceId) {
			trackByObjectId({
				variables: {
					userId: globalState.user.mongoId,
					objectId: targetSourceId.toLowerCase(),
				},
			});
		}
	}, [globalState.user.mongoId, targetSourceId]);

	useEffect(() => {
		if (dataTrack) {
			setTarget({ isTracked: dataTrack.trackByObjectId ? true : false });
		}
	}, [dataTrack]);

	// useEffect(() => { setZidx(props.zIndex); }, [props.zIndex]);

	useEffect(() => {
		setWidth(cardWidth);
		if (props.expanded) {
			handleExpand();
		} else {
			handleShrink();
		}
	}, [props.expanded]);

	useEffect(() => {
		///Set body style overflow hidden when card is fully expanded
		const disableBodyScrollBarIfExpanded = () => {
			if (width === '100%') {
				document.body.style.overflow = 'hidden';
			}
		};

		disableBodyScrollBarIfExpanded();
		if (document.getElementById('side-panel-pullout-btn')) {
			document.getElementById('side-panel-pullout-btn').style.display = 'none';
		} // hide pullout button from the sidebar when details card is opened
		return () => {
			if (document.getElementById('side-panel-pullout-btn')) {
				document.getElementById('side-panel-pullout-btn').style.display = 'flex';
			} // Show pullout button from the sidebar when details card get closed
			document.body.style.overflow = 'auto';
		};
	}, [openDialog, props.targetLabel, isExpanded, width]);

	// functions
	const handleExpand = () => {
		if (toggleExpand === false) {
			setToggleExpand(true);
			setExpanded(false);
			setWidth(cardWidthExpanded);
		} else {
			setToggleExpand(false);
			setExpanded(true);
			if (parent === 'table' && targetLabel === 'well') {
				setWidth('50vw');
			} else {
				setWidth('100%');
			}
		}

		if (props.targetLabel === 'well' || props.targetLabel === 'expandedWell') {
			const newPath = `/map/wells/${selectedWell.id}`;
			history.location.pathname !== newPath &&
				history.replace({ pathname: newPath, search: window.location?.search }, { ...history.location.state });
			popupController.updateState({
				popupOpen: false,
				expandedCard: true,
			});
			popupController.fitWellBounds();
		} else if (props.targetLabel === 'parcel' || props.targetLabel === 'expandedParcel') {
			popupController.updateState({
				popupOpen: false,
				expandedCard: true,
			});
			popupController.fitParcelBounds();
			const newPath = `/map/parcels/${selectedShape?.id}`;
			history.location.pathname !== newPath && history.replace(newPath);
		}
		setStateExpandableCard(state => ({ ...state, expanded: true }));
	};

	const handleShrink = () => {
		setCardTop(mouseY);
		setCardLeft(mouseX);
		setStateExpandableCard(state => ({ ...state, expanded: false }));
		setWidth(cardWidth);
		popupController.updateState({
			expandedCard: false,
		});
	};

	const handleClose = reset => {
		if (parent === 'map') {
			if (selectedShape?.type === 'agreement' && !selectedShape?.agreementNumber) {
				if (globalStateController.getValue('testCase') !== 'AgreementDraw') {
					dispatch(showInfoMessage('Agreement Number is required'));
					return;
				}
			} else if (selectedShape?.type === 'unit' && !selectedShape?.feature?.properties?.uName) {
				dispatch(showInfoMessage('Unit Name is required'));
				return;
			} else if (selectedShape?.sdType === 'parcel' && !selectedShape?.feature?.properties?.shapeLabel) {
				dispatch(showInfoMessage('Tract Name is required'));
				return;
			}

			if ($('#tempPopupHolder').length) {
				let popUps = document.getElementsByClassName('mapboxgl-popup');
				if (popUps[0]) {
					popUps[0].remove();
				}
			}

			if (reset !== 'noreset') {
				popupController.reset();
			}

			window.setStateApp(state => ({
				...state,
				viewDoc: null,
				rotateableFeature: null,
			}));
			// Extract the current search query from the location object
			const currentSearch = location.search;
			// Replace the pathname but retain the query parameters
			history.replace({
				pathname: '/', // Set the new path
				search: currentSearch, // Retain the current search parameters
			});
		}
		handleCloseExpandableCard();
		//if EC is inside map popup you need to close it
	};

	const setDefaulTab = () => {
		if (props.targetLabel === 'parcel') {
			popupController.updateState({
				parcelDetailCardTabIndex: 0,
			});
		}
	};

	const handleUpdateAssetShapeLabel = async shapeLabel => {
		if (currentAssetRecord && globalState?.currentAsset) {
			updateAssetShapeLabel({
				variables: { tableName: globalState.currentAsset.tableName, shapeLabel, recordId: currentAssetRecord._id },
				refetchQueries: ['getRecordFromRunTimeModel'],
				awaitRefetchQueries: true,
			});
		}
	};

	const getTitle = () => {
		if (!title) {
			return '--';
		}
		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					width: '100%',
					marginRight: '48px',
				}}
			>
				{selectedShape ? (
					<>
						<Grid container spacing={2} alignItems="center" className={classes.unitTitle}>
							{selectedShape?.isGenericAssetShape && (
								<Grid item xs={12} sm={6} md={4}>
									<CustomTextField
										fieldAttributes={{
											name: 'assetShape.shapeJson.properties.shapeName',
											value: selectedShape.shapeLabel || '',
											placeholder: 'Enter shape label',
											size: 'small',
										}}
										fieldConfig={{
											variant: 'outlined',
											customStyleClass: classes.assetShapeLabel,
										}}
										fieldEvents={{
											onBlur: value => {
												handleUpdateAssetShapeLabel(value);
											},
										}}
									/>
								</Grid>
							)}
							{!selectedShape?.isGenericAssetShape && (
								<Grid item>
									<Avatar color="#1a2341">
										<FolderIcon fontColor="#1a2341" />
									</Avatar>
								</Grid>
							)}
							<Grid item>
								{!selectedShape?.isGenericAssetShape && (
									<>
										<Box className="name">
											{title.length > 70 ? `${title.substr(0, 75).toUpperCase()}...` : title.toUpperCase()}
										</Box>
										<Box className="description">{subTitle}</Box>
									</>
								)}
								{targetLabel === 'unit' && <Box className="type">Unit</Box>}
								{targetLabel === 'agreement' && (
									<Box className="type">
										{agreementTypes.find(at => at.value === selectedShape?.agreementType)?.label || ''}
									</Box>
								)}
								{targetLabel === 'parcel' && <Box className="type">Tract</Box>}
							</Grid>
						</Grid>
						{targetLabel === 'parcel' && props.expanded === false && (
							<Grid container spacing={2} alignItems="center" className={classes.unitTitle}>
								<Box
									className="name"
									style={{
										fontSize: 14,
										marginTop: -6,
									}}
								>
									{title.length > 70 ? `${title.substr(0, 75).toUpperCase()}...` : title.toUpperCase()}
								</Box>
							</Grid>
						)}
					</>
				) : (
					<>
						{' '}
						{targetLabel !== 'contact' && targetLabel !== 'parcel' && (
							<div>{title.length > 70 ? `${title.substr(0, 75)}...` : title}</div>
						)}
						{targetLabel === 'contact' && parent !== 'table' && <ContactSearch />}
						{targetLabel === 'contact' && parent !== 'table' && (
							<div>{title.length > 70 ? `${title.substr(0, 75)}...` : title}</div>
						)}
					</>
				)}
			</div>
		);
	};

	const openConfirmationDialog = () => {
		setOpenDialog(true);
	};

	const deleteFunc = async () => {
		if (targetLabel === 'parcel' || selectedShape || targetLabel === 'expandedParcel') {
			setDeleteLoading(true);
			const layer = targetLabel === 'parcel' ? { layerType: targetLabel } : selectedShape;
			await deleteCustomLayer(layer);
			setDeleteLoading(false);

			// For clearing out selected abstract land grids
			let popUps = document.getElementsByClassName('mapboxgl-popup');
			if (popUps[0]) {
				popUps[0].remove();
			}

			const selectedAbstracts = drawController.getValue('selectedAbstracts');

			for (let i = 0; i < selectedAbstracts.length; i++) {
				const id = selectedAbstracts[i].properties.Id;
				const sourceId = globalStateController.getValue('abstract_geo')?.sourceId;
				if (sourceId) {
					window.mapRef?.setFeatureState({ source: sourceId, id }, { click: false });
				}
			}

			drawController.updateState({
				selectedAbstracts: [],
			});
		} else if (targetLabel === 'activity') {
			setDeleteLoading(true);
			await deleteActivity();
			setDeleteLoading(false);
		}
	};

	const deleteCustomLayer = async layer => {
		await props.deleteCustomLayer(targetSourceId, layer);
		handleClose();
	};

	const deleteActivity = async () => {
		await props.handleDelete();
	};

	const handleEditParcelAndShape = () => {
		handleClose('noreset');
		drawController.updateState({
			featureToEdit: selectedShape?.feature,
			currentFeature: selectedShape?.feature,
			shapeToExtend: selectedShape?.feature,
			showDrawShapesPopup: true,
			showShapeActionsPopup: true,
			editDraw: true,
			shapeEditMode: 'fullEdit',
			isEditingShape: true,
		});

		popupController.setState({
			popupOpen: false,
			expandedCard: false,
		});

		setTimeout(() => {
			drawController.actionEdit();
		}, 10);
	};

	// BreadCrum for Document's well
	const DisplayBreadCrums = () => {
		return (
			<div className={classes.breadcrumContainer}>
				{history.location?.state?.fromShapeDetail && (
					<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
						<Typography className={classes.unClickable} color="inherit">
							{history.location?.state?.shapeType}
						</Typography>
						<Typography
							className={classes.prevlocation}
							color="inherit"
							onClick={() => {
								popupController.reset();
								history.push(history.location?.state?.link);
							}}
						>
							{history.location?.state?.shapeName}
						</Typography>
						<Typography className={classes.unClickable} color="inherit">
							Wells
						</Typography>
						<Typography className={classes.currentLocation}> {title.toUpperCase()}</Typography>
					</Breadcrumbs>
				)}
				{breadcrumbs && (
					<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
						{breadcrumbs.map((breadcrumb, index) => (
							<Typography
								key={index}
								className={classes.prevlocation}
								color="inherit"
								onClick={() => {
									history.push(breadcrumb.url);
								}}
							>
								{breadcrumb.title}
							</Typography>
						))}
						<Typography color="inherit">Wells</Typography>
						<Typography className={classes.currentLocation}> {title.toUpperCase()}</Typography>
					</Breadcrumbs>
				)}
			</div>
		);
	};

	const subHeader =
		subTitle === ', '
			? `${selectedShape?.state} - ${selectedShape?.county}`
			: subTitle
				? subTitle.length > 35
					? `${subTitle.substr(0, 35)}...`
					: subTitle
				: '';
	return (
		<React.Fragment>
			{/* Dialog for deleting parcel  */}
			{openDialog && (
				<Dialog
					className={classes.dialog}
					open={openDialog ? true : false}
					onClose={() => setOpenDialog(false)}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialog
						header={`Delete ${targetLabel === 'expandedParcel' ? 'parcel' : targetLabel}`}
						onClose={() => setOpenDialog(false)}
						deleteFunc={deleteFunc}
					>
						Are you sure you want to delete the selected {targetLabel === 'expandedParcel' ? 'parcel' : targetLabel}?
					</DeleteConfirmationDialog>
				</Dialog>
			)}

			<Card id="expandableCard" className={classes.card}>
				{/* Modal popup for reporting bugs on expandable card  */}
				<ReportBugModal open={openBugModal} onClose={() => setOpenBugModal(false)} />
				{(history.location?.state?.fromShapeDetail || breadcrumbs) && <DisplayBreadCrums />}

				{(history.location?.state?.showAgreementBreadcrumb || history.location?.state?.showTractsBreadcrumb) && (
					<Grid container spacing={2} alignItems="center" className={classes.breadcrumb}>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Typography
								style={{
									marginLeft: '10px',
									fontSize: '16px',
								}}
								color="inherit"
							>
								{history.location?.state?.showAgreementBreadcrumb && (
									<div className={classes.agreementLink} onClick={() => history.push('/land/agreements')}>
										Agreements
									</div>
								)}
								{history.location?.state?.showTractsBreadcrumb && (
									<div className={classes.agreementLink} onClick={() => history.push('/land/tracts')}>
										Tracts
									</div>
								)}
							</Typography>
							<Typography
								style={{
									marginLeft: '10px',
									fontSize: '16px',
								}}
								color="inherit"
							>
								<div className={classes.breadcrumbDiv}>{title}</div>
							</Typography>
						</Breadcrumbs>
					</Grid>
				)}
				<CardHeader
					classes={{ title: classes.title, subheader: classes.subheader }}
					action={
						<div className={classes.headerIcons}>
							{(targetLabel === 'parcel' || selectedShape) && (
								<Tooltip title={'Edit shape boundary'} data-testid="edit-shape-boundary" placement="top">
									<IconButton
										// size="small"
										onClick={() => {
											handleEditParcelAndShape();
										}}
										aria-label={`Edit ${targetLabel}`}
									>
										<DrawPoly />
									</IconButton>
								</Tooltip>
							)}
							{targetLabel !== 'activity' &&
								targetLabel !== 'contact' &&
								targetLabel !== 'parcel' &&
								!selectedShape && (
									<CommentsWithIcon
										objectId={targetSourceId?.toLowerCase()}
										targetLabel={props?.targetLabel}
										iconZiseSmall={!stateExpandableCard?.expanded}
									/>
								)}

							{targetLabel !== 'activity' &&
								targetLabel !== 'contact' &&
								targetLabel !== 'parcel' &&
								!selectedShape &&
								targetLabel !== 'recent_submitted_permits' && (
									<TaggerWithIcon
										objectId={targetSourceId?.toLowerCase()}
										targetLabel={props?.targetLabel}
										iconZiseSmall={!stateExpandableCard.expanded}
									/>
								)}

							{targetLabel === 'contact' && parent !== 'table' && (
								<LinkWithIcon
									objectId={targetSourceId?.toLowerCase()}
									targetLabel={props?.targetLabel}
									iconZiseSmall={!stateExpandableCard.expanded}
								/>
							)}

							{!props.noTrackAvailable &&
								targetLabel !== 'recent_submitted_permits' &&
								targetLabel !== 'parcel' &&
								targetLabel !== 'unit' &&
								targetLabel !== 'agreement' && (
									<TrackToggleButton
										target={target}
										targetLabel={targetLabel}
										targetSourceId={targetSourceId?.toLowerCase()}
										iconZiseSmall={!stateExpandableCard.expanded}
									/>
								)}

							{stateExpandableCard.expanded &&
							targetLabel !== 'activity' &&
							targetLabel !== 'contact' &&
							parent !== 'table' ? (
								parent !== 'table' &&
								targetLabel !== 'well' &&
								targetLabel !== 'expandedWell' &&
								targetLabel !== 'parcel' &&
								!selectedShape &&
								targetLabel !== 'expandedParcel' &&
								targetLabel !== 'recent_submitted_permits' ? (
									<Tooltip title={'Shrink'} placement="top">
										<IconButton color="secondary" onClick={handleShrink} aria-label="shrink" className={classes.icons}>
											<ShrinkIcon viewBox="0 0 64 64" color="secondary" />
										</IconButton>
									</Tooltip>
								) : isExpanded === false && targetLabel !== 'activity' ? (
									<Tooltip title={'Expand'} placement="top">
										<IconButton
											// size="small"
											onClick={handleExpand}
											aria-label="expand"
											className={classes.icons}
											id="expandIcon"
										>
											<ExpandIcon viewBox="0 0 64 64" color="secondary" />
										</IconButton>
									</Tooltip>
								) : (
									<Tooltip title={'Shrink'} placement="top">
										<IconButton color="secondary" onClick={handleExpand} aria-label="shrink" className={classes.icons}>
											<ShrinkIcon viewBox="0 0 64 64" color="secondary" />
										</IconButton>
									</Tooltip>
								)
							) : (
								parent !== 'table' &&
								targetLabel !== 'activity' &&
								targetLabel !== 'recent_submitted_permits' && (
									<Tooltip title={'Expand'} placement="top">
										<IconButton
											size="small"
											onClick={() => {
												handleExpand();
												setDefaulTab();
											}}
											aria-label="expand"
											className={classes.icons}
										>
											<ExpandIcon viewBox="0 0 64 64" color="secondary" />
										</IconButton>
									</Tooltip>
								)
							)}
							{stateExpandableCard.expanded &&
								(['activity', 'parcel', 'expandedParcel'].includes(targetLabel) || selectedShape) &&
								title !== 'Add Activity' && (
									<Tooltip title={`Delete ${targetLabel}`} placement="top">
										{isDeletingCustomLayer || deleteLoading ? (
											<CircularProgress size={20} color="secondary" />
										) : (
											<>
												{' '}
												{(targetLabel === 'parcel' ||
													targetLabel === 'unit' ||
													targetLabel === 'agreement' ||
													targetLabel === 'activity') && (
													<>
														{' '}
														<IconButton size="small" component="span" onClick={handleMenuClick}>
															<MoreVertIcon id="expandCardVertIcon" color="secondary" size="medium" />
														</IconButton>
														<Menu
															id="dealMenu"
															anchorEl={anchorEl}
															open={Boolean(anchorEl)}
															onClose={handleMenuClose}
															className={classes.menu}
														>
															<MenuItem onClick={openConfirmationDialog} data-testid="delete-icon">
																<ListItemIcon>
																	<DeleteIcon size="medium" />
																</ListItemIcon>
																<ListItemText>Delete</ListItemText>
															</MenuItem>
														</Menu>
													</>
												)}
											</>
										)}
									</Tooltip>
								)}
							<Tooltip title={'Close'} placement="top">
								<IconButton
									size={stateExpandableCard.expanded ? 'medium' : 'small'}
									aria-label="close"
									className={classes.icons}
									onClick={handleClose}
								>
									<CloseIcon id="closeIcon" color="secondary" />
								</IconButton>
							</Tooltip>
						</div>
					}
					// Expandable Card Title
					title={getTitle()}
					// Expandable Card Secondary Header
					subheader={subHeader}
				/>

				<CardContent className={classes.content}>
					<div id="cardContentData">{props.component}</div>
				</CardContent>
			</Card>
		</React.Fragment>
	);
}

export default React.memo(ExpandableCard);
