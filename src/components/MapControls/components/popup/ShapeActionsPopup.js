import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Menu, MenuItem, Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBox';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import GridOnIcon from '@material-ui/icons/GridOn';
import LayerIcon from '@material-ui/icons/Layers';
import OfflineBoltIcon from '@material-ui/icons/OfflineBoltOutlined';

import { Dialog } from '@mui/material';

import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { isEmpty } from 'lodash';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import LimitExceedPopUp from 'components/MapControls/components/popup/LimitExceedPopup';
import ShapeEditActions from 'components/MapControls/components/popup/ShapeEditActions';
import DeleteConfirmationDialogContent from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { getPolygonString } from 'components/Shared/functions';
import { shapeTypeLayers, calculateLandArea } from 'components/Shared/functions/shapeLayer';
import ConvertContact from 'components/Shared/svgIcons/convert_contact';

import { ADD_RECORD_IN_RUN_TIME_MODEL, UPDATE_RECORD_IN_RUN_TIME_MODEL } from 'graphQL/useMutationRunTimeModel';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { UPSERTCUSTOMLAYER } from 'graphQL/useMutationUpsertCustomLayer';
import { ABSTRACTGEOQUERY } from 'graphQL/useQueryAbstractGeo';
import { ALL_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';

import { drawController } from 'hookstate/drawStateController';
import { globalStateController } from 'hookstate/globalStateController';
import { layerController } from 'hookstate/layerStateController';
import { mapControlsController } from 'hookstate/mapControlsController';

import { resetShapeOwnerAction } from 'store/actions/ownerActions';
import { ConvertTaxOwnerToContactContainer, ExportWellsOwnersContainer } from 'store/containers';

import ShapeTypeMenu from './ShapeTypeMenu';
import CheckCircle from '../../../Shared/svgIcons/check-circle';
import FilterAltIcon from '../../../Shared/svgIcons/FilterAltIcon';
import { drawBoundary, clearSelectedAbstracts } from '../DrawShapes/drawShapesHelpers';
import { tableGlobalController } from 'hookstate/tableController';
import AddCustomAssetDialog from 'components/Shared/components/common/DetailCard/RightDialogs/AddCustomAssetDialog';
import { detailCardController } from 'hookstate/detailCardController';

const ShapeActionsPopup = props => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { classes, children, onlyAddShape } = props;

	const { mapControlsStateValues } = mapControlsController.useState(['mapGridCardActivated'], 'mapControlsStateValues');
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, isOpen } = stateValues.dialog || {};

	const drawState = drawController.useState([
		'currentFeature',
		'shapeEdit',
		'shapeEditMode',
		'showAddShapePopup',
		'featureToEdit',
		'selectedAoi',
		'shapeActionsFilterSelected',
		'selectedAction',
		'shapeToExtend',
	]);
	const {
		featureToEdit,
		selectedAoi,
		currentFeature,
		shapeEdit,
		shapeEditMode,
		showAddShapePopup,
		shapeActionsFilterSelected,
		selectedAction,
		shapeToExtend,
	} = drawState.stateValues;

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord'], 'stateValues');

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const [isDeleteModal, setDeleteModal] = useState(false);
	const [error, setError] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorConvertEl, setAnchorConvertEl] = useState(null);
	const [limitExceed, setLimitExceed] = useState(false);
	const [convertTaxOwnerModal, setConvertTaxOwnerModal] = useState(false);
	const [exportCSVModal, setExportCSVModal] = useState(false);
	const [showConvertMenu, setShowConvertMenu] = useState(false);
	const [agreementAnchorEl, setAgreementAnchorEl] = useState(null);
	const [tractAnchorEl, setTractAnchorEl] = useState(null);
	const [unitAnchorEl, setUnitAnchorEl] = useState(null);
	const [mapCreationAsset, setMapCreationAsset] = useState([]);

	// Query for fetching all custom assets
	const [getAllCustomAsset, { data: allCustomAsset }] = useLazyQuery(ALL_CUSTOM_ASSET_INFO, {
		fetchPolicy: 'no-cache',
	});

	const [getAbstractGeo, { data: abstractData }] = useLazyQuery(ABSTRACTGEOQUERY);
	const [upsertCustomLayer, { data: customLayerInsertedData }] = useMutation(UPSERTCUSTOMLAYER, {
		update(
			cache,
			{
				data: {
					upsertCustomLayer: { customLayer },
				},
			}
		) {
			cache.modify({
				fields: {
					allCustomLayers(existingCustomLayers = [], { readField }) {
						const newCustomLayerRef = cache.writeFragment({
							data: customLayer,
							fragment: gql`
								fragment NewCustomLayer on CustomLayer {
									_id
									shape
									name
									layer
									user {
										_id
										name
										email
									}
								}
							`,
						});

						// Quick safety check - if the new comment is already
						// present in the cache, we don't need to add it again.
						if (existingCustomLayers.some(ref => readField('id', ref) === customLayer._id)) {
							return existingCustomLayers;
						}

						return [...existingCustomLayers, newCustomLayerRef];
					},
				},
			});
			// dwarController.updateSelectedLayerFeature(dispatch,customLayer);
			globalStateController.updateState({ reFetchLayer: customLayer });
		},
	});

	const [addRecordInRunTimeModel] = useMutation(ADD_RECORD_IN_RUN_TIME_MODEL, {
		fetchPolicy: 'no-cache',
		awaitRefetchQueries: true,
	});

	const [updateRecordInRunTimeModel] = useMutation(UPDATE_RECORD_IN_RUN_TIME_MODEL, {
		fetchPolicy: 'no-cache',
		awaitRefetchQueries: true,
	});

	const addShapeToLayerButton = useRef();

	useEffect(() => {
		if (!currentFeature) {
			return;
		}

		getAbstractGeo({
			variables: {
				polygon: getPolygonString(currentFeature),
			},
		});
	}, [drawState.currentFeature]);

	useEffect(() => {
		if (!onlyAddShape) {
			return;
		}

		setAnchorEl(addShapeToLayerButton.current);
	}, [onlyAddShape]);

	const [deleteCustomLayer] = useMutation(UPDATECUSTOMLAYER, {
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

	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

	const layerType =
		featureToEdit?.properties?.layerType ||
		featureToEdit?.properties?.sdType ||
		featureToEdit?.properties?.layerSubType;

	const enableEditOnly = shapeTypeLayers.includes(layerType);
	const isAoi = selectedAoi?.properties?.sdType === 'interest';
	const isCreateParcelMenu = Boolean(anchorEl);
	const isShapeResizeMode = shapeTypeLayers.includes(layerType);

	useEffect(() => {
		// if (get(customLayerInsertedData, 'upsertCustomLayer.customLayer')) {
		// 	dwarController.updateSelectedLayerFeature(dispatch, customLayerInsertedData.upsertCustomLayer.customLayer);
		// }
		if (
			get(customLayerInsertedData, 'upsertCustomLayer.customLayer') &&
			!customLayerInsertedData.upsertCustomLayer.success
		) {
			setError(true);
		}
	}, [customLayerInsertedData]);

	/**
	 * Disabling filter on Cross Button / Unmounting
	 */
	useEffect(
		() => () => {
			drawController.clearFilter();
		},
		[]
	);

	useEffect(() => {
		// USE EFFECT for applying filter to new shape
		if (drawController.getValue('shapeActionsFilterSelected')) {
			// drawController.applyFilter();
		}
	}, [drawState.currentFeature]);

	useEffect(() => {
		// Get all custom assets
		getAllCustomAsset({
			variables: {
				type: 'Custom',
			},
		});
	}, [getAllCustomAsset]);

	useEffect(() => {
		if (allCustomAsset) {
			// Set map assets
			const asset = allCustomAsset?.getAllCustomAssetInfo?.res?.filter(item => item.creationPlace === 'onMap');
			setMapCreationAsset(asset);
		}
	}, [allCustomAsset]);

	const saveAndOpenShapeDetail = useCallback(
		(...props) => drawController.saveAndOpenShapeDetail(upsertCustomLayer, dispatch, history, abstractData, ...props),
		[upsertCustomLayer, dispatch, history, abstractData]
	);

	const updateAndOpenShapeDetail = useCallback(
		(...props) => drawController.updateAndOpenShapeDetail(updateCustomLayer, dispatch, history, abstractData, ...props),
		[updateCustomLayer, dispatch, history, abstractData]
	);

	const saveAndOpenParcelDetail = useCallback(
		() => drawController.saveAndOpenParcelDetail(upsertCustomLayer, dispatch, history, abstractData),
		[upsertCustomLayer, dispatch, history, abstractData]
	);

	const saveAndOpenMapAssetShapeDetail = useCallback(
		({ currentAsset, customAssetData }) => {
			drawController.saveAndOpenMapAssetShapeDetail({
				addRecordInRunTimeModel,
				dispatch,
				history,
				abstractData,
				currentAsset,
				customAssetData,
			});
		},
		[addRecordInRunTimeModel, dispatch, history, abstractData]
	);

	const updateAndOpenMapAssetShape = useCallback(() => {
		if (currentAssetRecord) {
			drawController.confirmShapeEditing({
				dispatch,
				history,
				updateRecordInRunTimeModel,
				currentAssetRecord,
				currentAsset,
				isEditCustomAsset: true,
			});
		}
	}, [addRecordInRunTimeModel, dispatch, history, abstractData, currentAssetRecord]);

	const deleteAOI = () => {
		// Turning off the confirmation modal
		setDeleteModal(false);

		// Delete request for actual AOI
		deleteCustomLayer({
			variables: {
				customLayerId: selectedAoi.id || selectedAoi._id,
				customLayer: {
					IsDeleted: true,
				},
			},
		}).then(() => {
			layerController.resetBounds('Area of Interest'); // reset bounds as AOI
		});

		// Deleting Shape from map
		window.drawRef?.delete(currentFeature?.id);

		// Popup Close Action
		drawController.actionClose(dispatch);
	};

	const handleDeleteAoiModal = () => {
		setDeleteModal(!isDeleteModal);
		drawBoundary();
	};

	const convertMenuAction = action => {
		setShowConvertMenu(false);
		const area = parseInt(calculateLandArea(currentFeature).replace(/,/g, ''));
		if (area > 500000) {
			setLimitExceed(true);
		} else if (action === 'convert') {
			setConvertTaxOwnerModal(true);
		} else if (action === 'export') {
			setExportCSVModal(true);
		}
	};

	return (
		<>
			<Menu
				id="parcel-button"
				anchorEl={anchorEl}
				open={isCreateParcelMenu}
				onClose={() => setAnchorEl(null)}
				MenuListProps={{
					'aria-labelledby': 'parcel-button',
				}}
				className={classes.parcelPopover}
			>
				<MenuItem disabled>Shape Layer Type</MenuItem>

				{!drawController.isLine() && !drawController.isPoint() && (
					<>
						<FeatureFlag feature={FEATURES.AGREEMENT_LAYER}>
							<MenuItem
								id="agreementItem"
								onClick={event => {
									clearSelectedAbstracts();
									setAgreementAnchorEl(event.currentTarget);
								}}
							>
								Agreement
							</MenuItem>
						</FeatureFlag>

						<MenuItem
							id="tractItem"
							onClick={e => {
								if (showAddShapePopup) {
									setTractAnchorEl(e.currentTarget);
								} else {
									clearSelectedAbstracts();
									saveAndOpenParcelDetail(upsertCustomLayer, dispatch, history);
								}
							}}
						>
							Tract
						</MenuItem>

						<MenuItem
							id="unitBoundaryItem"
							onClick={e => {
								if (showAddShapePopup) {
									setUnitAnchorEl(e.currentTarget);
								} else {
									clearSelectedAbstracts();
									saveAndOpenShapeDetail('unit');
								}
							}}
						>
							Unit Boundary
						</MenuItem>
					</>
				)}

				{/* Dynamic related map assets */}
				{mapCreationAsset
					?.filter(asset => asset?.shapeType === currentFeature?.geometry?.type)
					?.map(option => (
						<MenuItem
							key={option._id}
							value={option.name}
							onClick={e => {
								e.stopPropagation();
								globalStateController.updateState({
									currentAsset: option,
								});
								setAnchorEl(null);
								tableGlobalController.updateState({
									dialog: {
										type: 'addCustomAsset',
										tableName: option?.tableName,
										isOpen: true,
									},
								});
							}}
						>
							{option.name}
						</MenuItem>
					))}
			</Menu>

			<Menu
				id="convert-button"
				anchorEl={anchorConvertEl}
				open={showConvertMenu}
				onClose={() => {
					setShowConvertMenu(false);
					setAnchorConvertEl(null);
				}}
				MenuListProps={{
					'aria-labelledby': 'convert-button',
				}}
				className={classes.convertPopover}
			>
				<MenuItem onClick={() => convertMenuAction('convert')}>
					<Grid container spacing={0} className={classes.convertPopoverGrid}>
						<Grid container item xs={2} alignItems="center" className={classes.hoverGrid}>
							<ConvertContact width="35" height="20" color="black" />
						</Grid>
						<Grid container item xs={10} alignItems="center">
							<span className={classes.convertMenuColor}>Convert tax owners to contacts</span>
						</Grid>
					</Grid>
				</MenuItem>

				<MenuItem onClick={() => convertMenuAction('export')}>
					<Grid container spacing={0} className={classes.convertPopoverGrid}>
						<Grid container item xs={2} alignItems="center">
							<CloudDownloadOutlinedIcon className={classes.downloadIcon} />
						</Grid>
						<Grid container item xs={10} alignItems="center">
							<span className={classes.convertMenuColor}>Export selected data to CSV</span>
						</Grid>
					</Grid>
				</MenuItem>
			</Menu>

			<ShapeTypeMenu
				type="agreement"
				classes={classes}
				shapeAnchorEl={agreementAnchorEl}
				saveAndOpenShapeDetail={saveAndOpenShapeDetail}
				updateAndOpenShapeDetail={updateAndOpenShapeDetail}
				setShapeAnchorEl={setAgreementAnchorEl}
			/>

			<ShapeTypeMenu
				type="tract"
				classes={classes}
				shapeAnchorEl={tractAnchorEl}
				saveAndOpenShapeDetail={() => saveAndOpenParcelDetail(upsertCustomLayer, dispatch, history)}
				updateAndOpenShapeDetail={updateAndOpenShapeDetail}
				setShapeAnchorEl={setTractAnchorEl}
			/>

			<ShapeTypeMenu
				type="unit"
				classes={classes}
				shapeAnchorEl={unitAnchorEl}
				saveAndOpenShapeDetail={saveAndOpenShapeDetail}
				updateAndOpenShapeDetail={updateAndOpenShapeDetail}
				setShapeAnchorEl={setUnitAnchorEl}
			/>

			<>
				<span className={classes.label}>
					{drawController.isLine() ? 'Calc. Dist' : isAoi ? 'AOI Area' : 'Calc. Area'}
				</span>{' '}
				{calculateLandArea(currentFeature)}
				<span className={`${classes.actions}`}>
					{isShapeResizeMode ? (
						<ShapeEditActions
							shapeEdit={shapeEdit}
							shapeEditMode={shapeEditMode}
							actionFullEdit={(...props) => drawController.actionClose(dispatch, ...props)}
						/>
					) : (
						<>
							{!drawController.isLine() && !drawController.isPoint() && (
								<>
									<FeatureFlag feature={FEATURES.MAPSHAPEEXPORT}>
										<Tooltip
											title="Bulk Actions"
											className={onlyAddShape || enableEditOnly ? classes.disableAction : ''}
										>
											<IconButton
												size="small"
												disabled={onlyAddShape ? true : enableEditOnly}
												aria-label="Parcel"
												id="convert-button"
												aria-controls="convert-button"
												aria-haspopup="true"
												onClick={event => {
													setAnchorConvertEl(event.currentTarget);
													setShowConvertMenu(true);
												}}
											>
												<OfflineBoltIcon />
											</IconButton>
										</Tooltip>
									</FeatureFlag>

									<Tooltip title="Grid" className={onlyAddShape || enableEditOnly ? classes.disableAction : ''}>
										<IconButton
											disabled={onlyAddShape ? true : enableEditOnly}
											size="small"
											onClick={() => drawController.actionShowWellsAndOwners(dispatch)}
											aria-label="Grid"
											data-testid="filter-on-grid"
										>
											<GridOnIcon className={mapControlsStateValues.mapGridCardActivated ? 'selected' : ''} />
										</IconButton>
									</Tooltip>

									<Tooltip title="Filter" className={onlyAddShape || enableEditOnly ? classes.disableAction : ''}>
										<IconButton
											size="small"
											disabled={onlyAddShape ? true : enableEditOnly}
											onClick={drawController.actionFilter}
											aria-label="Filter"
											data-testid="filter-on-map"
										>
											<FilterAltIcon className={shapeActionsFilterSelected ? 'selected' : ''} />
										</IconButton>
									</Tooltip>
								</>
							)}

							<Tooltip
								title="Add Shape to Layer"
								className={
									enableEditOnly
										? classes.disableAction
										: anchorEl?.getAttribute('id') === 'parcel-button'
											? classes.selectedAction
											: ''
								}
							>
								<IconButton
									size="small"
									disabled={enableEditOnly}
									data-testid="add-shape-to-layer"
									aria-label="Parcel"
									id="parcel-button"
									aria-controls="parcel-button"
									aria-haspopup="true"
									aria-expanded={isCreateParcelMenu ? 'true' : undefined}
									ref={addShapeToLayerButton}
									onClick={event => {
										setAnchorEl(event.currentTarget);
									}}
								>
									<LayerIcon color="secondary" />
								</IconButton>
							</Tooltip>

							{!drawController.isLine() && !drawController.isPoint() && (
								<Tooltip
									title="Area of Interest"
									className={onlyAddShape || enableEditOnly ? classes.disableAction : ''}
								>
									<IconButton
										size="small"
										disabled={onlyAddShape ? true : enableEditOnly}
										onClick={drawController.actionAOI}
										aria-label="Area of Interest"
									>
										<span style={{ color: 'white' }}>AOI</span>
									</IconButton>
								</Tooltip>
							)}
						</>
					)}

					<span className={classes.divider} />
					{currentFeature && !drawController.isLine() && !drawController.isPoint() && (
						<Tooltip
							title="Add shape"
							className={onlyAddShape || selectedAction === 'edit-aoi' ? classes.disableAction : ''}
						>
							<IconButton
								size="small"
								aria-label="Add shape"
								disabled={onlyAddShape}
								data-testid="add-shape"
								onClick={() => {
									window.drawRef?.changeMode('static');
									drawController.updateState({ addShape: true });
								}}
							>
								<AddBox className={''} />
							</IconButton>
						</Tooltip>
					)}

					{(isEmpty(currentFeature?.properties) || isAoi) && (
						<Tooltip
							title="Edit Active Shape"
							className={onlyAddShape || selectedAction === 'edit-aoi' ? classes.disableAction : ''}
						>
							<IconButton
								size="small"
								aria-label="Edit Active Shape"
								disabled={onlyAddShape}
								onClick={() => {
									if (!isShapeResizeMode) {
										drawController.actionEdit(false);
									}
								}}
							>
								<EditIcon className={''} />
							</IconButton>
						</Tooltip>
					)}
					{currentFeature?.properties.shapeLabel && !enableEditOnly && (
						<Tooltip
							title="Delete Active Shape"
							className={onlyAddShape || !currentFeature?.properties.shapeLabel ? classes.disableAction : ''}
						>
							<IconButton
								size="small"
								aria-label="Delete Active Shape"
								disabled={onlyAddShape}
								onClick={() => {
									if (currentFeature?.properties.shapeLabel) {
										handleDeleteAoiModal();
									}
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					)}

					{(selectedAction === 'edit-aoi' ||
						selectedAction === 'edit-shape' ||
						shapeEditMode === 'redraw' ||
						(shapeEditMode === 'fullEdit' && (shapeToExtend?.geometry?.type || featureToEdit?.geometry?.type))) && (
						<span className={classes.multiSelectCheck}>
							<Tooltip title="Confirm Editing">
								<IconButton
									size="small"
									aria-label="Set Boundary"
									disabled={onlyAddShape}
									onClick={() => {
										if (selectedAction === 'edit-aoi') {
											drawController.handleSaveAOIToShape({ updateCustomLayer, dispatch });
										} else if (
											selectedAction === 'edit-shape' ||
											shapeEditMode === 'redraw' ||
											shapeEditMode === 'fullEdit'
										) {
											if (currentAssetRecord) updateAndOpenMapAssetShape();
											else drawController.confirmShapeEditing({ updateCustomLayer, dispatch, history });
										}
									}}
								>
									<CheckCircle />
								</IconButton>
							</Tooltip>
						</span>
					)}
				</span>
				{children}
				{error && (
					<div className={classes.footer}>
						<Typography color="error" align="center" />
					</div>
				)}
			</>

			{/*  new dialog used and removed old one */}
			<Dialog
				className={classes.dialog}
				open={isDeleteModal}
				onClose={handleDeleteAoiModal}
				fullWidth={false}
				maxWidth="sm"
			>
				<DeleteConfirmationDialogContent
					header={'Delete AOI Shape'}
					onClose={handleDeleteAoiModal}
					deleteFunc={deleteAOI}
					m1nSelectedRowsIds={null}
					setM1nSelectedRowsIndexes={() => {}}
				>
					Are you sure want to delete the selected shape?
				</DeleteConfirmationDialogContent>
			</Dialog>

			<LimitExceedPopUp open={limitExceed} onClose={() => setLimitExceed(false)} />

			{convertTaxOwnerModal && (
				<ConvertTaxOwnerToContactContainer
					open={convertTaxOwnerModal}
					onClose={() => {
						setConvertTaxOwnerModal(false);
						dispatch(resetShapeOwnerAction());
					}}
				/>
			)}

			{exportCSVModal && (
				<ExportWellsOwnersContainer
					open={exportCSVModal}
					onClose={() => {
						setExportCSVModal(false);
						dispatch(resetShapeOwnerAction());
					}}
				/>
			)}

			{type === 'addCustomAsset' && isOpen && (
				<AddCustomAssetDialog
					onClose={() => {
						tableGlobalController.updateState({
							dialog: {
								type: 'addCustomAsset',
								isOpen: false,
							},
						});
					}}
					onClickAddHandler={saveAndOpenMapAssetShapeDetail}
				/>
			)}
		</>
	);
};

ShapeActionsPopup.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.node,
	onlyAddShape: PropTypes.bool,
};

export default ShapeActionsPopup;
