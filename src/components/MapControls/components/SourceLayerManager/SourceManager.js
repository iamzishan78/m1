import React, { useState, useEffect, Fragment, memo } from 'react';
import { useDispatch } from 'react-redux';

import {
	Collapse,
	Typography,
	Divider,
	MenuItem,
	Popper,
	ClickAwayListener,
	MenuList,
	Paper,
	Grow,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Close as ClearButton } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { useLazyQuery, useMutation } from '@apollo/client';
import update from 'immutability-helper';
import { sortBy } from 'lodash';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import PropTypes from 'prop-types';

import EditableTextField from 'components/Shared/components/Fields/EditableTextField';
import { copy, deepEqual } from 'components/Shared/functions';

import { UPDATE_DATASET } from 'graphQL/useMutationDataset';
import { UPDATE_MANY_LAYER } from 'graphQL/useMutationUpdateManyLayer';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';
import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';
import { LAYERS_BY_DATASET_ID } from 'graphQL/useQueryAllLayerSettingsByUser';

import { globalStateController } from 'stateManagement/globalStateController';
import { layerController } from 'stateManagement/layerStateController';
import { mapControlsController } from 'stateManagement/mapControlsController';

import { showInfoMessage } from 'actions';

import CategorySection from './CategorySection';
import DeleteSourceAndCategoryConfirmationDialog from './DeleteSourceAndCategoryConfirmationDialog';

const SPACING = 6;

const useStyles = makeStyles(theme => ({
	accordion: {
		'& .MuiAccordionSummary-content': {
			margin: '0px !important',
		},
	},
	subHeaderItem: {
		backgroundColor: '#011133 !important',
		minWidth: '350px',
	},
	list: {
		border: '2px solid #A9A9A9',
		padding: '0px',
		margin: '8px 0px',
		borderRadius: '8px',
	},
	nested: {
		paddingLeft: theme.spacing(SPACING),
		paddingRight: theme.spacing(SPACING),
	},
	disabledLayerTitle: {
		'& span': { color: 'rgb(127, 149, 199) !important' },
	},
	dropzoneClass: {
		'& .MuiDropzoneArea-text': {
			marginTop: 0,
			marginBottom: 0,
		},
		'& .MuiDropzoneArea-icon': {
			display: 'none',
		},
		minHeight: '0',
		marginBottom: '0px',
		border: 'none',
	},
	url: {
		textDecoration: 'underline',
		'&:hover': {
			color: 'darkblue',
		},
	},
	uploaderText: {
		color: '#828282',
		fontSize: '1rem',
		backgroundColor: '#e8edefe8',
		border: '2px dashed #999',
		padding: '10px',
		borderRadius: '5px',
	},
	multiSelectionTopBarButtons: {
		margin: '0px 5px',
		padding: '0px 5px',
		// fontWeight: "600",
		// backgroundColor: "rgba(1, 17, 51, 1)",
		// color: "#fff",
		border: '1px solid #B3B3B3',
		// "&:hover": {
		//   backgroundColor: "#263451",
		//   color: "#fff",
		// },
	},
	contentRoot: {
		padding: '15px',
		height: 'calc(100% - 111px)',
		position: 'absolute',
		overflow: 'overlay',
	},
	footer: {
		position: 'absolute',
		right: '0px',
		bottom: '0px',
		padding: '15px',
	},
	selectedType: {
		borderBottom: '4px solid #01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	moreIcon: {
		color: '#0000008a',
		marginRight: '15px',
		visibility: 'hidden',
	},
	moreSourceIcon: {
		color: '#0000008a',
		marginRight: '15px',
		visibility: 'hidden',
	},
}));

const StyledListItem2 = withStyles(theme => ({
	root: {
		fontFamily: 'Poppins',
		backgroundColor: theme.palette.common.white,
		color: '#827F7F',
		border: '2px solid #827F7F',
		borderRadius: '5px',
		marginTop: '15px',
		marginBottom: '5px',
		padding: '4px 0px 4px 0',
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: '#827F7F',
		},

		'&:hover, &.isOpen': {
			backgroundColor: '#00000014',
			color: '#263451',
			border: '2px solid #263451',
			'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
				color: '#263451',
			},
		},
		'&:hover': {
			'& .moreSourceIcon': {
				visibility: 'visible',
			},
		},
	},
}))(ListItem);

const StyledListItem = withStyles(theme => ({
	root: {
		fontFamily: 'Poppins',
		backgroundColor: theme.palette.common.white,
		borderBottom: '2px solid #ccc',
		padding: '0px',
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: 'dark gray',
		},
		'&:first-child': {
			borderTopLeftRadius: '5px',
			borderTopRightRadius: '5px',
		},
		'&:last-child': {
			borderBottomLeftRadius: '5px',
			borderBottomRightRadius: '5px',
			borderBottom: '0px',
		},

		'&:hover': {
			'& .moreIcon': {
				visibility: 'visible',
			},
		},
	},
}))(ListItem);

// Hook
function useOnClickOutside(ref, handler) {
	useEffect(() => {
		const listener = event => {
			if (!ref.current || ref.current?.contains(event.target)) {
				return;
			}
			handler(event);
		};
		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);
		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handler]);
}

function SourceManager(props) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const { globalStateValues } = globalStateController.useState(['user'], 'globalStateValues');
	const { layers, layerStateValues } = layerController.useState(
		['projectedLayers', 'layers', 'datasets'],
		'layerStateValues'
	);
	const [isOpenUserSources, setIsOpenUserSources] = React.useState(true);
	const [openDataSets, setOpenDataSets] = React.useState({});
	const [currentLayers, setCurrentLayers] = React.useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [actionItem, setActionItem] = React.useState(null);
	const [layerData, setLayerData] = useState([]);
	const [newLayerData, setNewLayerData] = useState([]);
	// const [selectAllMineralSources, setselectAllMineralSources] = React.useState(false);

	const [updateManyLayer] = useMutation(UPDATE_MANY_LAYER);
	const [updateDataset] = useMutation(UPDATE_DATASET, { refetchQueries: ['getDatasets'], awaitRefetchQueries: true });
	const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
	const [layersByDatasetId] = useLazyQuery(LAYERS_BY_DATASET_ID);
	const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, {
		refetchQueries: ['getUserMapSettings', 'getDatasets'],
		awaitRefetchQueries: true,
	});

	const layer_limit = 50;

	const updateStateLayers = currentLayers => {
		layerController.updateState({ layers: currentLayers });
	};

	useEffect(() => {
		if (layerController.getValue('projectedLayers').length === 0) {
			layerController.getProjectedLayers();
		}
	}, []);

	useEffect(() => {
		if (!deepEqual(currentLayers, layerStateValues.layers)) {
			setCurrentLayers(copy(layerStateValues.layers));
		}
	}, [currentLayers, layers]);

	const handleApplyChange = (currentLayers, allLayers) => {
		// Initialize arrays to hold layers and settings
		const layersToUpdate = [];
		const layersSettingsToUpdate = [];

		// Loop over each layer in the currentLayers array
		currentLayers.forEach(currentLayer => {
			// Add current layer's update data to layersToUpdate
			layersToUpdate.push({
				_id: currentLayer.layerId,
				layerName: currentLayer.layerName,
				groupName: currentLayer.groupName,
			});

			// Add layer settings data to layersSettingsToUpdate
			layersSettingsToUpdate.push({
				_id: currentLayer._id,
				user: globalStateValues.user._id,
				layer: currentLayer.layerId,
				layerSettings: currentLayer.layerSettings,
				layerPaintProps: currentLayer.layerPaintProps,
			});
		});

		// Save to stateApp
		updateStateLayers([...allLayers]);

		// Save to MongoDB
		if (layersToUpdate.length > 0) {
			updateManyLayer({
				variables: {
					layers: layersToUpdate,
				},
			});

			updateManyUserLayerSettings({
				variables: {
					manySettings: layersSettingsToUpdate,
				},
			}).then(({ data }) => {
				// Check if any settings were updated and update all layers
				if (data?.updateManyUserLayerSettings?.res?.length) {
					// Loop through each response and update the corresponding layers
					data.updateManyUserLayerSettings.res.forEach(res => {
						const updatedLayer = allLayers.find(l => l.layerId === res.layer);
						if (!updatedLayer?._id) {
							updatedLayer._id = res._id;
						}
					});
					// Update the state with the updated layers
					updateStateLayers([...allLayers]);
				}
			});
		}
	};

	const handleLayerSettingChange = (layers, changeValue) => {
		const isReplace = typeof changeValue !== 'undefined';
		const value = isReplace ? changeValue : !layers.some(l => l.layerSettings?.showable);
		if (layers?.filter(row => row?.layerSettings?.showable === true).length < layer_limit) {
			const updatefn = layerController.generateUpdateFn(layers, value, currentLayers, 'showable');
			const updatedLayers = update(currentLayers, updatefn);
			setCurrentLayers(updatedLayers);
			layers.forEach(layer => {
				layerController.handleDeckLayer({ ...layer, layerSettings: { ...layer.layerSettings, showable: value } });
			});
			const updatedIndexes = Object.keys(updatefn);
			const layersToPass = updatedIndexes.map(index => updatedLayers[index]);
			// Pass all updated layers to handleApplyChange
			handleApplyChange(layersToPass, updatedLayers);
		} else {
			dispatch(showInfoMessage('Cannot add additional layer. Number of active layers cannot exceed ' + layer_limit));
		}
	};

	useEffect(() => {
		if (layerData?.length) {
			const fileIds = layerData.map(l => l.file);
			// Check if all layers in layerIds exist in currentLayers
			const allLayersExist = fileIds.every(fileId => currentLayers.some(clayer => clayer.file === fileId));

			if (allLayersExist) {
				// If all layers exist, process them with handleLayerSettingChange
				handleLayerSettingChange(layerData);
			}
		}
		setLayerData(null);
	}, [currentLayers]);

	useEffect(() => {
		if (newLayerData?.length) {
			const layerIds = newLayerData.map(l => l.layerId);

			// Check if all layers in layerIds exist in currentLayers
			const allLayersExist = layerIds.every(layerId => currentLayers.some(clayer => clayer.layerId === layerId));

			if (allLayersExist) {
				// If all layers exist, process them with handleLayerSettingChange
				handleLayerSettingChange(newLayerData);
			}
		}
		setNewLayerData(null);
	}, [currentLayers]);

	// Common function added for User layer which uses handleLayerSettingChange internally
	const changeUserSources = async (sources, value) => {
		const settings = {};
		const datasetIds = sources
			.map(source => {
				const datasetIndex = layerStateValues.datasets.findIndex(d => d._id === source._id);
				source.visibility = value;
				layerStateValues.datasets[datasetIndex] = source;

				settings[source._id] = value;
				return source._id;
			})
			.filter(Boolean);
		const layers = currentLayers.filter(layer => datasetIds.includes(layer.dataset));
		const pLayers = layerStateValues.projectedLayers.filter(layer => datasetIds.includes(layer.dataset));
		layerController.updateProjectedLayers({ layer: pLayers, field: 'showable', value });

		let layersUpdated = false;

		if (value && layers.length == 0) {
			// If turning on, fetch missing layers
			let updatedLayers = await layersByDatasetId({
				variables: {
					datasetIds,
					userId: globalStateValues.user._id,
				},
			});

			if (updatedLayers?.data?.layersByDatasetId?.length) {
				setLayerData(updatedLayers.data.layersByDatasetId);
				setCurrentLayers(prevLayers => sortBy([...prevLayers, ...updatedLayers.data.layersByDatasetId], 'position'));
				layersUpdated = true;
			}
		}

		if (!layersUpdated) {
			handleLayerSettingChange(layers, value);
		}

		updateUserMapSettings({
			variables: {
				settings: {
					user: globalStateValues.user.mongoId,
					type: 'DatasetVisibility',
					settings,
				},
			},
		});
	};

	async function handleFileInput(fileObj) {
		if (!fileObj?.[0]?.file) {
			return;
		}

		const fileData = fileObj[0].file;
		const fileName = fileObj[0].file.name;
		const fileNameParsed = fileName.replace('.zip', '').replace('.geojson', '').replace('.json', '');
		const fileType = fileObj[0].file.type;

		mapControlsController.updateState({
			layerAddControl: 'addGroup',
			fileUploaded: { file: fileData, fileName, fileNameParsed, fileType },
			addLayer: false,
			manageSourceLayer: false,
			manageLayer: false,
		});
	}

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	useOnClickOutside({ current: anchorEl }, handleMenuClose);

	const datasetNameChange = (item, name) => {
		const isSource = !actionItem?.category;
		if (isSource) {
			actionItem.dataset.sourceName = name;
		} else {
			const category = actionItem.dataset.categories.find(category => category.name === actionItem.category.name);
			category.name = name;
			category.layerName = name;
		}
		const index = layerStateValues.datasets.findIndex(dataset => dataset._id === actionItem.dataset._id);
		layerStateValues.datasets[index] = actionItem.dataset;

		updateDataset({ variables: { dataset: actionItem.dataset } });
	};

	const openEditField = name => {
		const isSource = !actionItem?.category;
		if (isSource) {
			return actionItem?.type === 'editName' && actionItem?.dataset?.sourceName === name;
		} else {
			return (
				actionItem?.type === 'editName' &&
				(actionItem?.category?.layerName === name || actionItem?.category?.name === name)
			);
		}
	};

	return (
		<div id="sourceManagerDiv" style={{ height: '100%', display: 'flex', width: '100%' }}>
			<DropzoneAreaBase
				onAdd={handleFileInput}
				onDelete={() => {}}
				onAlert={() => {}}
				filesLimit={1}
				maxFileSize={104857600}
				dropzoneClass={classes.dropzoneClass}
				// acceptedFiles={[".geojson", ".zip", ".shp",]}
				dropzoneText={
					<>
						<div>
							<div className={classes.contentRoot}>
								<Typography
									varient="h5"
									style={{ textAlign: 'start', paddingBottom: '20px', fontWeight: 'bolder', fontFamily: 'sans-serif' }}
									onClick={e => e.stopPropagation()}
								>
									Add New Sources
								</Typography>
								<div className={classes.uploaderText}>
									<span>
										To add a new user-defined shape layer, drag and drop a GeoJSON or Shapefile anywhere on this screen
										or click here to select file from your local drive
									</span>
								</div>
								<Divider style={{ height: '2px', marginTop: '15px' }} />
								<Typography
									varient="h5"
									style={{ textAlign: 'start', marginTop: '5px', fontWeight: 'bolder', fontFamily: 'sans-serif' }}
									onClick={e => e.stopPropagation()}
								>
									Add Sources to Map View
								</Typography>
								<Typography
									varient="h6"
									style={{ textAlign: 'start', marginBottom: '10px' }}
									onClick={e => e.stopPropagation()}
								>
									Select one or more of the available sources below to add them to your current map view
								</Typography>
								<div onClick={e => e.stopPropagation()}>
									<CategorySection search={props.search} title="M1neral Platform Sources" layerCategory="M1 Layer" />

									<StyledListItem2
										button
										onClick={() => setIsOpenUserSources(!isOpenUserSources)}
										className={isOpenUserSources ? 'isOpen' : ''}
									>
										<ListItemText style={{ paddingLeft: '20px' }} primary="User Uploaded Sources" />
										<Button
											color="secondary"
											startIcon={<ClearButton />}
											className={classes.multiSelectionTopBarButtons}
											onClick={event => {
												event.stopPropagation();
												changeUserSources(
													layerStateValues.datasets.filter(d => d.file),
													false
												);
											}}
										>
											CLEAR ALL
										</Button>

										{isOpenUserSources ? <ExpandLess /> : <ExpandMore />}
									</StyledListItem2>
									<Collapse in={isOpenUserSources} timeout="auto" unmountOnExit>
										{layerStateValues.datasets
											?.filter(dataset => {
												const isDatasetLayer = dataset.categories.find(
													category =>
														category.name?.toLowerCase().includes(props.search?.toLowerCase()) ||
														category?.layerName?.toLowerCase().includes(props.search?.toLowerCase())
												);
												return (
													!props.search ||
													dataset?.name?.toLowerCase().includes(props.search?.toLowerCase()) ||
													dataset?.sourceName?.toLowerCase().includes(props.search?.toLowerCase()) ||
													isDatasetLayer
												);
											})
											?.map(dataset => (
												<Fragment key={dataset._id}>
													{dataset.sourceName !== 'M1 Platform' ? (
														<>
															<StyledListItem2
																data-testid={`source-${dataset.sourceName}`}
																className={openDataSets[dataset.sourceName] ? 'isOpen' : ''}
																style={{ paddingLeft: '0px' }}
																button
																onClick={() =>
																	setOpenDataSets({
																		...openDataSets,
																		[dataset.sourceName]: !openDataSets[dataset.sourceName],
																	})
																}
															>
																<Checkbox
																	id={'source-checkbox-' + dataset.sourceName}
																	checked={dataset.visibility}
																	color="darkgray"
																	onClick={e => e.stopPropagation()}
																	onChange={() => {
																		changeUserSources([dataset], !dataset.visibility);
																	}}
																	inputProps={{ 'aria-label': 'primary checkbox' }}
																/>
																<EditableTextField
																	onChange={datasetNameChange}
																	item={dataset}
																	name={dataset.sourceName}
																	isEditable={false}
																	isEditing={openEditField(dataset.sourceName)}
																	onEditEnd={() => setActionItem(null)}
																/>
																{/* <ListItemText primary={dataset.sourceName} /> */}
																<MoreHorizIcon
																	id={'more-horiz-' + dataset.sourceName}
																	aria-controls={'source-menu'}
																	className={'moreSourceIcon ' + classes.moreSourceIcon}
																	onClick={e => {
																		e.stopPropagation();
																		handleClick(e);
																		setActionItem({ dataset });
																	}}
																/>
																{openDataSets[dataset.sourceName] ? <ExpandLess /> : <ExpandMore />}
															</StyledListItem2>
															<Collapse in={openDataSets[dataset.sourceName]} timeout="auto" unmountOnExit>
																<List className={classes.list} data-testid={`source-ul-${dataset.sourceName}`}>
																	{dataset.categories?.map(layer => {
																		// const labelId = `m1layer-list-label-${index}`;
																		return (
																			<StyledListItem
																				key={layer.layerIdentifier || layer.name}
																				ContainerComponent="li"
																				style={{ padding: 10 }}
																			>
																				<EditableTextField
																					onChange={datasetNameChange}
																					item={layer}
																					name={layer.layerName || layer.name}
																					isEditable={false}
																					isEditing={openEditField(layer.layerName || layer.name)}
																					onEditEnd={() => setActionItem(null)}
																				/>

																				{/* <ListItemText style={{ padding: '5px 0px 5px 40px' }} id={labelId} primary={truncate(layer.layerName || layer.name, 30)} /> */}
																				<MoreHorizIcon
																					aria-controls={'more-source-menu'}
																					className={'moreIcon ' + classes.moreIcon}
																					onClick={e => {
																						handleClick(e);
																						setActionItem({ dataset, category: layer });
																					}}
																				/>
																			</StyledListItem>
																		);
																	})}
																</List>
															</Collapse>
														</>
													) : (
														<></>
													)}
												</Fragment>
											))}
									</Collapse>
								</div>
							</div>
						</div>
					</>
				}
			/>

			{/* //// delete confirmation dialog */}

			<Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
					>
						<Paper style={{ zIndex: 10 }}>
							<ClickAwayListener onClickAway={handleMenuClose}>
								<MenuList autoFocusItem={Boolean(anchorEl)} id="menu-list-grow">
									<MenuItem
										onClick={e => {
											e.stopPropagation();
											setActionItem(actionItem => ({ ...actionItem, type: 'editName' }));
											handleMenuClose();
										}}
									>
										<EditIcon /> Edit Name
									</MenuItem>
									<MenuItem
										id="deleteSource"
										onClick={e => {
											e.stopPropagation();
											setOpenDeleteDialog(actionItem);
											handleMenuClose();
										}}
									>
										<DeleteIcon /> Delete
									</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>

			{openDeleteDialog && (
				<Dialog
					className={classes.dialog}
					open={openDeleteDialog ? true : false}
					onClose={() => {
						setOpenDeleteDialog(false);
					}}
					fullWidth={true}
					maxWidth={'sm'}
				>
					<DeleteSourceAndCategoryConfirmationDialog
						openDialog={openDeleteDialog ? true : false}
						handleDialogClose={setOpenDeleteDialog}
						actionItem={openDeleteDialog}
					/>
				</Dialog>
			)}
		</div>
	);
}

SourceManager.propTypes = {
	stateApp: PropTypes.object,
	search: PropTypes.string,
};

export default memo(SourceManager);
