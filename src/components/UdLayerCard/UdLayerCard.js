import React, { useContext, useEffect, useMemo, useState } from 'react';

import { CircularProgress, Dialog, Menu, MenuItem } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Close, Delete, Layers, Sync } from '@material-ui/icons';

import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import $ from 'jquery';
import PropTypes from 'prop-types';

import M1neral_headers, { getCustomFieldHeaders } from 'components/BulkUpload/jobHeaders';
import { clearMapAndCloseShapeActionsPopup } from 'components/MapControls/commonHelper';
import { userDefinedInitialData } from 'components/MapGridCard/components/data';
import DeleteConfirmationDialogContent from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import FilterAltIcon from 'components/Shared/svgIcons/FilterAltIcon';

import { DELETE_SHAPEFILE_FEEATURE } from 'graphQL/useMutationShapeFile';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { GET_SHAPE_FEATURE } from 'graphQL/useQueryGetShapeFeature';

import { drawController } from 'stateManagement/drawStateController';
import { globalStateController } from 'stateManagement/globalStateController';
import { jobController } from 'stateManagement/jobStateController';
import { layerController } from 'stateManagement/layerStateController';
import { mapControlsController } from 'stateManagement/mapControlsController';
import { mapStateController } from 'stateManagement/mapStateController';
import { popupController } from 'stateManagement/popupStateController';

import { history } from 'store';

import { AppContext } from '../../AppContext';

const useStyles = makeStyles(() => ({
	root: {},
	card: {
		position: props => props.position,
		left: props => props.cardLeft,
		borderRadius: 0,
		top: props => props.cardTop,
		webkitTransform: 'translateZ(0)',
		transition: 'width 0.1s, height 0.1s, left 0.1s, top 0.1s',
		width: props => props.cardWidth,
		height: props => (props.expanded ? props.height : 'inherit'),
		background: '#112040',
		borderStyle: 'solid',
		borderWidth: 'thin',
		borderColor: '#112040',
		'& .MuiCardHeader-action': {
			alignSelf: 'left',
		},
		zIndex: 1250,
	},
	title: {
		fontFamily: 'Poppins',
		color: '#FFFFFF',
		fontSize: props =>
			['Contact', 'Contact Details', 'Add Activity', 'Activity Details'].includes(props.title) ? '20px' : '15px',
	},
	headerIcons: {
		'& .MuiBadge-anchorOriginTopRightRectangle': {
			right: '10px',
			top: '5px',
		},
	},
	subheader: {
		fontFamily: 'Poppins',
		color: '#FFFFFF',
		fontSize: '11px',
	},
	headerContainer: {
		wordBreak: 'break-word',
	},
	content: {
		backgroundColor: '#fffff',
		transition: 'height 0.1s',
		background: '#fff',
		padding: '0 !important',
		overflowY: 'auto',
		height: '325px',
		'&::-webkit-scrollbar': {
			width: '0.75em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 10,
		},
	},
	icons: {
		'&:hover': {
			backgroundColor: '#031d40',
		},
		color: 'white',
	},
	contentGrid: {
		padding: 20,
	},
}));

export const getUdLayerCardTitle = ({ layer, properties }) => {
	let { layerName, groupName, id } = layer;
	layerName = layerName || properties.Unit_Name || id;
	if (!layerName && !groupName) {
		return '--';
	}
	return groupName || layerName;
};

function UdLayerCard(props) {
	const classes = useStyles(props);
	// contexts
	const client = useApolloClient();
	const [stateApp, setStateApp] = useContext(AppContext);

	const [getShapeFeature, { data: shapeFeature, loading }] = useLazyQuery(GET_SHAPE_FEATURE);

	const [deleteShapeFeature] = useMutation(DELETE_SHAPEFILE_FEEATURE);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const isCreateParcelMenu = Boolean(anchorEl);

	useEffect(() => {
		getShapeFeature({
			variables: { id: props?.selectedUserDefinedLayer?._id },
		});
	}, [getShapeFeature]);

	const selectedUserDefinedLayer = useMemo(() => {
		return {
			...props.selectedUserDefinedLayer,
			...(shapeFeature?.getShapeFeature?.data || {}),
		};
	}, [props.selectedUserDefinedLayer, shapeFeature]);

	const handleCloseLeftSidePanel = () => {
		mapControlsController.setState({ expandedPanel: false });
	};

	const handleCloseShapeDrawer = () => {
		drawController.reset();

		const sourceId = globalStateController.getValue('abstract_geo')?.sourceId;

		if (!sourceId) {
			return;
		}

		// unselecting the grids
		const featuresList = window.mapRef?.getSource(sourceId)?._data?.features || [];
		for (let i = 0; i < featuresList.length; i++) {
			const id = featuresList[i].properties.Id;
			window.mapRef?.setFeatureState({ source: sourceId, id: id }, { click: false });
		}
	};

	const handleAddShapeClick = (e, action) => {
		if (popupController.getValue('expandedCard')) {
			handleCloseLeftSidePanel();
			handleCloseShapeDrawer();
		}

		if (e && action) {
			if (action === 'draw') {
				mapControlsController.updateState({ selectedMapControl: action });

				if (!drawController.getValue('editDraw')) {
					popupController.reset();

					drawController.updateState({ showAddShapePopup: true });
				} else {
					clearMapAndCloseShapeActionsPopup(stateApp, setStateApp);
				}
			}
		}
		const { toggle3d, toggleZoomOut } = mapStateController.getValues(['toggle3d', 'toggleZoomOut']);
		mapStateController.updateState({
			toggle3d: action === 'threed' ? !toggle3d : toggle3d,
			toggleZoomOut: action === 'zoomout' ? !toggleZoomOut : toggleZoomOut,
		});

		if (window.drawRef && window.drawRef.getMode() !== 'simple_select') {
			drawController.updateState({
				editDraw: false,
			});
			window.drawRef.changeMode('simple_select');
		}
	};

	const { parent } = props;
	const { selectedHex } = props;

	const disableProperties = ['pointIndices', 'points', 'position', 'row', 'col'];

	if (!selectedUserDefinedLayer && !selectedHex) {
		return <></>;
	}

	const { layer, properties } = selectedUserDefinedLayer;

	const handleClose = () => {
		if (parent === 'map') {
			if ($('#tempPopupHolder').length) {
				let popUps = document.getElementsByClassName('mapboxgl-popup');
				if (popUps[0]) {
					popUps[0].remove();
				}
			}

			popupController.reset();
			drawController.reset();

			setStateApp(state => ({
				...state,
				viewDoc: null,
			}));
		}
	};

	const getTitle = () => {
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
				{getUdLayerCardTitle({ layer, properties })}
			</div>
		);
	};

	const handleSync = async jobType => {
		let columns = [];

		const { data: metaDataRes } = await client.query({
			query: GET_META_DATA,
			variables: {},
		});
		const hits = [selectedUserDefinedLayer];

		hits.forEach(hit => {
			const currentColumns = Object.keys(hit.properties);
			if (currentColumns.length > columns.length) {
				columns = currentColumns;
			}
		});

		let m1neralHeaders = M1neral_headers[jobType] || [];

		const customFieldHeaders = getCustomFieldHeaders(jobType, metaDataRes?.getMetaData?.metaData);

		m1neralHeaders = [...m1neralHeaders, ...customFieldHeaders];

		for (let i = 0; i < columns.length; i++) {
			const columnName = columns[i];

			const matchedKey = m1neralHeaders.find(el => el?.label === columnName);

			const column = {
				mapped_key: columnName,
				required: !!matchedKey?.actual_key,
				actual_key: matchedKey?.actual_key || '',
				label: matchedKey?.label || '',
			};

			if (column?.actual_key === matchedKey?.actual_key) {
				matchedKey.mapped_key = column.mapped_key;
				matchedKey.required = column.required;
			}

			columns[i] = column;
		}

		const category = {
			AGREEMENT_SHAPE: userDefinedInitialData[0],
			TRACT_SHAPE: userDefinedInitialData[1],
			UNIT_SHAPE: userDefinedInitialData[2],
		};

		jobController.updateState({
			transferData: {
				selectedSourceCategory: {
					m1neralHeaders,
					mappedHeadersFromCSV: columns,
					hits,
				},
				selectedPlatformCategory: category[jobType],
			},
		});

		history.push('/bulkupload/shape_to_m1_layer');
	};

	return (
		<React.Fragment>
			{deleteDialogOpen && (
				<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth={true} maxWidth={'sm'}>
					<DeleteConfirmationDialogContent
						header={'Delete Feature'}
						onClose={() => setDeleteDialogOpen(false)}
						deleteFunc={() => {
							deleteShapeFeature({
								variables: { feature: selectedUserDefinedLayer },
								onCompleted: () => {
									layerController.resetBounds(selectedUserDefinedLayer.layer.identifier);
									handleClose();
								},
							});
						}}
					>
						{'Do you want to delete the selected shape file feature?'}
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}

			<Menu anchorEl={anchorEl} open={isCreateParcelMenu} onClose={() => setAnchorEl(null)}>
				<MenuItem onClick={() => handleSync('AGREEMENT_SHAPE')}>Agreement</MenuItem>

				<MenuItem onClick={() => handleSync('TRACT_SHAPE')}>Tract</MenuItem>

				<MenuItem onClick={() => handleSync('UNIT_SHAPE')}>Unit Boundary</MenuItem>
			</Menu>

			<Card className={classes.card}>
				{selectedHex ? (
					<CardContent className={classes.content}>
						<Grid
							container
							direction="row"
							alignItems={'flex-start'}
							justifyContent={'flex-start'}
							display="block"
							className={classes.contentGrid}
						>
							<>
								{Object.keys(selectedHex)
									.filter(prop => !disableProperties.includes(prop))
									.map(prop => (
										<React.Fragment key={prop}>
											<Grid item xs={5}>
												{prop}
											</Grid>
											<Grid item xs={7} style={{ fontWeight: 'bold' }}>
												{selectedHex[prop]}
											</Grid>
										</React.Fragment>
									))}
							</>
						</Grid>
					</CardContent>
				) : (
					<>
						<CardHeader
							data-testid="ud-layer-card-header"
							classes={{ title: classes.title, subheader: classes.subheader }}
							className={classes.headerContainer}
							action={
								<div className={classes.headerIcons}>
									{/* Filter support added back */}
									<Tooltip title="Delete" placement="top">
										<IconButton
											size="small"
											onClick={() => {
												setDeleteDialogOpen(true);
											}}
											aria-label="Delete"
											data-testid="delete-on-map"
										>
											<Delete color="secondary" />
										</IconButton>
									</Tooltip>
									<Tooltip title="Filter" placement="top">
										<IconButton
											size="small"
											onClick={() => {
												drawController.updateState({ editDraw: true });
												drawController.actionFilter();
												popupController.updateState({ popupOpen: false });
											}}
											aria-label="Filter"
											data-testid="filter-on-map"
										>
											<FilterAltIcon color="secondary" />
										</IconButton>
									</Tooltip>

									<Tooltip title={'Add + Sync'} placement="top">
										<IconButton
											size="small"
											aria-haspopup="true"
											aria-expanded={isCreateParcelMenu ? 'true' : undefined}
											className={classes.icons}
											onClick={event => setAnchorEl(event.currentTarget)}
										>
											<Sync color="secondary" />
										</IconButton>
									</Tooltip>
									<Tooltip title={'Add Shape to Layer'} placement="top">
										<IconButton
											size={'small'}
											onClick={e => handleAddShapeClick(e, 'draw')}
											aria-label="close"
											className={classes.icons}
										>
											<Layers color="secondary" />
										</IconButton>
									</Tooltip>
									<Tooltip title={'Close'} placement="top">
										<IconButton size={'small'} onClick={handleClose} aria-label="close" className={classes.icons}>
											<Close color="secondary" />
										</IconButton>
									</Tooltip>
								</div>
							}
							// Expandable Card Title
							title={getTitle()}
							// Expandable Card Secondary Header
							subheader={layer.groupName ? layer.layerName : ''}
						/>
						<CardContent className={classes.content}>
							<Grid
								container
								direction="row"
								alignItems={loading ? 'center' : 'flex-start'}
								justifyContent={loading ? 'center' : 'flex-start'}
								display="block"
								className={classes.contentGrid}
							>
								{loading ? (
									<Grid item>
										<CircularProgress color="secondary" />
									</Grid>
								) : (
									<>
										{Object.keys(properties)
											.filter(prop => prop !== 'shapeCenter' && prop !== 'originalProperties')
											.map(prop => (
												<React.Fragment key={prop}>
													<Grid item xs={5}>
														{prop}
													</Grid>
													<Grid item xs={7} style={{ fontWeight: 'bold' }}>
														{properties[prop]}
													</Grid>
												</React.Fragment>
											))}
									</>
								)}
							</Grid>
						</CardContent>
					</>
				)}
			</Card>
		</React.Fragment>
	);
}

UdLayerCard.whyDidYouRender = true;

UdLayerCard.propTypes = {
	parent: PropTypes.string,
	selectedUserDefinedLayer: PropTypes.object,
};

export default React.memo(UdLayerCard);
