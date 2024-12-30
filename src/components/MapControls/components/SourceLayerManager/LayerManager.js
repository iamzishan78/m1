import React, { useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography } from '@material-ui/core';
import { Collapse } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Popper, Grow, Paper, MenuList, MenuItem } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Close as ClearButton } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { useMutation } from '@apollo/client';
import update from 'immutability-helper';

import EditableTextField from 'components/Shared/components/Fields/EditableTextField';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { copy, deepEqual, deepEqualObjects } from 'components/Shared/functions';
import { truncate } from 'components/Shared/functions';
import UploadIcon from 'components/Shared/svgIcons/uploadIcon';

import { UPDATE_MANY_LAYER } from 'graphQL/useMutationUpdateManyLayer';
import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';

import { globalStateController } from 'hookstate/globalStateController';
import { layerController } from 'hookstate/layerStateController';

import { showInfoMessage } from 'actions';
import { AppContext } from 'AppContext';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

const useStyles = makeStyles(theme => ({
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
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
	},
	disabledLayerTitle: {
		'& span': { color: 'rgb(127, 149, 199) !important' },
	},
	dropzoneClass: {
		'& .MuiDropzoneArea-text': {
			marginTop: 0,
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
	uploaderText: {
		color: '#828282',
		fontSize: '1rem',
		backgroundColor: '#e8edefe8',
		border: '2px dashed #999',
		padding: '10px',
		borderRadius: '5px',
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

	moreIcon: {
		color: '#0000008a',
		marginRight: '15px',
		visibility: 'hidden',
	},
	moreSourceIcon: {
		color: '#0000008a',
		marginRight: '15px',
		visibility: 'hidden',
		cursor: 'pointer',
	},
}));

const StyledListItem2 = withStyles(theme => ({
	root: {
		fontFamily: 'Poppins',
		backgroundColor: theme.palette.common.white,
		color: '#263451',
		padding: '4px 0px 4px 0',
		border: '2px solid #263451',
		borderRadius: '5px',
		marginTop: '15px',
		marginBottom: '5px',
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: '#263451',
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
			'& .moreSourceIcon': {
				visibility: 'visible',
			},
			'& .moreIcon': {
				visibility: 'visible',
			},
		},
	},
}))(ListItem);

export default function AddLayer(props) {
	const dispatch = useDispatch();
	const classes = useStyles();
	let history = useHistory();
	const layer_limit = 50;

	const [stateApp] = useContext(AppContext);
	const { layers, globalStateValues } = globalStateController.useState(['layers'], 'globalStateValues');
	const [openM1, setOpenM1] = React.useState(true);
	const [isOpenUserDefinedLayers, setIsOpenUserDefinedLayers] = React.useState(true);
	const [currentLayers, setCurrentLayers] = React.useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openUDLayers, setUDLayersStates] = useState([]);
	const [selectAllMinerallayers, setSelectAllMinerallayers] = React.useState(false);
	const [updateManyLayer] = useMutation(UPDATE_MANY_LAYER);
	const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [actionItem, setActionItem] = React.useState(null);

	const updateStateLayers = currentLayers => {
		stateApp.layers = currentLayers;
		globalStateController.updateState({ layers: currentLayers });
	};

	useEffect(() => {
		checkAllLayers(M1Layers, 'M1');
		checkAllLayers(UdLayers, 'UD');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLayers]);

	useEffect(() => {
		if (!deepEqual(currentLayers, globalStateValues.layers)) {
			setCurrentLayers(copy(globalStateValues.layers));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentLayers, layers]);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = e => {
		setAnchorEl(null);
	};

	// Hook
	function useOnClickOutside(ref, handler) {
		useEffect(() => {
			const listener = event => {
				if (!ref.current || ref.current.contains(event.target)) {
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

	useOnClickOutside({ current: anchorEl }, handleMenuClose);

	const handleCurrentLayersChange = () => {
		setCurrentLayers(currentLayers => {
			handleApplyChange(currentLayers);
			return currentLayers;
		});
	};

	const handleLayerSettingChange = (layers, changeValue) => {
		const updatefn = {};
		const isReplace = typeof changeValue !== 'undefined';
		if (layers?.filter(row => row?.layerSettings?.showable === true).length < layer_limit) {
			layers.forEach(layer => {
				if (layer.type === 'group') {
					const value = isReplace ? changeValue : !layer.layers.find(l => l.layerSettings.showable);
					layer.layers.forEach(l => {
						const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === l.identifier);
						updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
						layerController.handleDeckLayer({ ...l, layerSettings: { ...l.layerSettings, showable: value } });
					});
				} else {
					const value = isReplace ? changeValue : !layer.layerSettings.showable;
					const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === layer.identifier);
					updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
					layerController.handleDeckLayer({ ...layer, layerSettings: { ...layer.layerSettings, showable: value } });
				}
			});

			setCurrentLayers(update(currentLayers, updatefn));
			handleCurrentLayersChange();
		} else {
			dispatch(showInfoMessage('Cannot add additional layer. Number of active layers cannot exceed ' + layer_limit));
		}
	};

	const changeShowAble = layer => {
		handleLayerSettingChange([layer]);
	};

	const checkAllLayers = (layers, layerType) => {
		let check = true;
		if (layers) {
			for (let index = 0; index < layers.length; index++) {
				if (layers[index].type === 'group') {
					if (layers[index].layers.find(layer => layer.layerSettings.showable === false)) {
						check = false;
					}
				} else if (layers[index].layerSettings.showable === false) {
					check = false;
				}
			}
		}
		if (layerType === 'M1') {
			setSelectAllMinerallayers(check);
		}
	};

	const handleCheckAllLayers = (layers, value, layerType) => {
		const updatedLayers = layers.map(layer => {
			const updatefn = {};
			if (layer.type === 'group') {
				layer.layers.forEach(l => {
					const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === l.identifier);
					updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
				});
			} else {
				const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === layer.identifier);
				updatefn[layerIndex] = { layerSettings: { showable: { $set: value } } };
			}
			return updatefn;
		});

		let result = currentLayers;
		for (let index = 0; index < updatedLayers.length; index++) {
			result = update(result, updatedLayers[index]);
		}

		setCurrentLayers(result);
		if (layerType === 'M1') {
			setSelectAllMinerallayers(value);
		}

		handleCurrentLayersChange();
	};

	const changeLayerName = (layer, name) => {
		const updatefn = {};
		if (layer.type === 'group') {
			layer.layers.forEach(l => {
				const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === l.identifier);
				updatefn[layerIndex] = { groupName: { $set: name } };
			});
		} else {
			const layerIndex = currentLayers.findIndex(clayer => clayer.identifier === layer.identifier);
			updatefn[layerIndex] = { layerName: { $set: name } };
		}

		setCurrentLayers(update(currentLayers, updatefn));
		handleCurrentLayersChange();
	};

	const handleApplyChange = currentLayers => {
		if (!deepEqual(currentLayers, globalStateValues.layers)) {
			const layersToUpdate = [];
			const layersSettingsToUpdate = [];
			for (let i = 0; i < currentLayers.length; i++) {
				if (!deepEqualObjects(currentLayers[i], globalStateValues.layers[i])) {
					layersSettingsToUpdate.push({
						_id: currentLayers[i]._id,
						layerSettings: currentLayers[i].layerSettings,
					});
					layersToUpdate.push({
						_id: currentLayers[i].layerId,
						layerName: currentLayers[i].layerName,
						groupName: currentLayers[i].groupName,
					});
				}
			}

			// //// saving to stateApp
			updateStateLayers([...currentLayers]);

			//// saving to mongo
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
				});
			}
		}
	};

	const checkIfDeleteAllow = layer => {
		if (layer.name === 'Agreements' || layer.groupName === 'Agreements') {
			return false;
		}
		return true;
	};

	const checkIfcustomLayerCopy = layer => {
		const customLayers = ['Units', 'Parcels', 'Tracts', 'Agreements', 'Deeds', 'Leases', 'Contracts', 'Surfaces'];
		if (customLayers.includes(layer.identifier)) {
			return false;
		}
		// Checking if layer.layerName starts with any customLayers
		return customLayers.some(customLayer => layer.identifier.startsWith(customLayer));
	};

	const M1Layers = React.useMemo(() => {
		return currentLayers.filter(layer => layer.layerCategory === 'M1 Layer');
	}, [currentLayers]);

	const UdLayers = React.useMemo(() => {
		const layers = currentLayers.filter(layer => layer.layerCategory === 'UD layer' || layer.file);
		const groupHandled = [];
		for (let index = 0; index < layers.length; index++) {
			const UdLayer = layers[index];
			if (UdLayer.groupId && !groupHandled.includes(UdLayer.groupId)) {
				groupHandled.push(UdLayer.groupId);
				const groupLayers = layers.filter(ul => ul.groupId === UdLayer.groupId);
				layers.splice(index, 0, {
					type: 'group',
					collapsed: true,
					name: UdLayer.groupName,
					id: UdLayer.groupId,
					layers: groupLayers,
				});
				index = 0;
			}
		}
		return layers.filter(
			UdLayer => !((UdLayer.layerType === 'file layer' || UdLayer.groupName === 'Agreements') && UdLayer.groupId)
		);
	}, [currentLayers]);

	return (
		<ClickAwayListener onClickAway={() => {}}>
			<>
				<div style={{ height: '100%', display: 'flex', width: '100%' }}>
					<div>
						<div className={classes.contentRoot}>
							<Typography
								varient="h5"
								style={{ textAlign: 'start', paddingBottom: '20px', fontWeight: 'bolder', fontFamily: 'sans-serif' }}
								onClick={e => e.stopPropagation()}
							>
								Add Layers to Map View
							</Typography>

							<Typography
								varient="h6"
								style={{ textAlign: 'start', marginBottom: '10px' }}
								onClick={e => e.stopPropagation()}
							>
								Select one or more of the available layers below to add them to your current map view
							</Typography>

							<div onClick={e => e.stopPropagation()}>
								<StyledListItem2 button onClick={() => setOpenM1(!openM1)}>
									<Checkbox
										checked={selectAllMinerallayers}
										color="darkgray"
										onClick={e => e.stopPropagation()}
										onChange={e => {
											handleCheckAllLayers(M1Layers, !selectAllMinerallayers, 'M1');
										}}
										inputProps={{ 'aria-label': 'primary checkbox' }}
									/>
									<ListItemText primary="M1neral Platform Layers" />
									{openM1 ? <ExpandLess /> : <ExpandMore />}
								</StyledListItem2>
								<Collapse in={openM1} timeout="auto" unmountOnExit>
									<List className={classes.list}>
										{M1Layers?.filter(
											layer =>
												(!props.search || layer.layerName?.toLowerCase().includes(props.search)) &&
												!['Land Grid', 'TX GLO Units', 'TX GLO Active Leases', 'Rig Activity'].includes(layer.layerName)
										)?.map((layer, index) => {
											const labelId = `m1layer-list-label-${index}`;
											if (layer.layerName === 'Recent Submitted Permits') {
												return (
													<FeatureFlag feature={FEATURES.RECENTPERMITLAYER}>
														<StyledListItem key={index} ContainerComponent="li">
															<Checkbox
																checked={layer.layerSettings.showable}
																color="dark gray"
																onChange={() => changeShowAble(layer)}
																inputProps={{ 'aria-label': 'primary checkbox' }}
															/>
															<ListItemText id={labelId} primary={truncate(layer.layerName, 30)} />
														</StyledListItem>
													</FeatureFlag>
												);
											} else if (layer.layerName !== 'Recent Submitted Permits') {
												return (
													<StyledListItem key={index} ContainerComponent="li">
														<Checkbox
															checked={layer.layerSettings.showable}
															color="dark gray"
															onChange={() => changeShowAble(layer)}
															inputProps={{ 'aria-label': 'primary checkbox' }}
														/>
														{/* Override layer manager name of Wells */}
														<ListItemText
															id={labelId}
															primary={layer.layerName === 'Wells' ? 'Platform Wells' : truncate(layer.layerName, 30)}
														/>
													</StyledListItem>
												);
											} else {
												return null;
											}
										})}
									</List>
								</Collapse>
								<StyledListItem2 button onClick={() => setIsOpenUserDefinedLayers(!isOpenUserDefinedLayers)}>
									{/* <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCheckAllLayers(UdLayers, false, "UD")
                      }}
                    >
                  <ClearButton />
                  </IconButton> */}
									<ListItemText style={{ paddingLeft: '20px' }} primary="Client Specific Layers" />
									<Button
										color="secondary"
										startIcon={<ClearButton />}
										className={classes.multiSelectionTopBarButtons}
										onClick={event => {
											event.stopPropagation();
											handleCheckAllLayers(UdLayers, false, 'UD');
										}}
									>
										CLEAR ALL
									</Button>
									{isOpenUserDefinedLayers ? <ExpandLess /> : <ExpandMore />}
								</StyledListItem2>

								{/* Custom */}
								<Collapse in={isOpenUserDefinedLayers} timeout="auto" unmountOnExit>
									<List className={classes.list}>
										{UdLayers?.filter(
											layer =>
												!props.search ||
												layer.name?.toLowerCase().includes(props.search) ||
												layer.layerName?.toLowerCase().includes(props.search)
										)?.map((layer, index) => {
											const labelId = `udlayer-list-label-${index}`;
											if (layer.type === 'group') {
												return (
													<Accordion>
														<AccordionSummary
															// expandIcon={<ExpandMoreIcon />}
															aria-controls="panel1a-content"
															id="panel1a-header"
															style={{ paddingLeft: 0, marginTop: 0, marginBottom: 0 }}
															onClick={() => {
																const _index = openUDLayers.findIndex(l => l === index);
																if (_index === -1) {
																	setUDLayersStates([...openUDLayers, index]);
																} else {
																	setUDLayersStates(openUDLayers.filter(l => l !== index));
																}
															}}
														>
															<StyledListItem>
																<Checkbox
																	checked={!!layer.layers.find(l => l.layerSettings.showable)}
																	color="dark gray"
																	onClick={event => event.stopPropagation()}
																	onChange={e => changeShowAble(layer)}
																	inputProps={{ 'aria-label': 'primary checkbox' }}
																/>
																{/* Group */}
																<EditableTextField
																	onChange={changeLayerName}
																	item={layer}
																	name={layer.name}
																	isEditable={false}
																	showExpandIcon
																	openUd={openUDLayers.includes(index)}
																	openEditField={layer?.id === actionItem?.group?.id && actionItem?.type === 'editName'}
																/>
																{checkIfDeleteAllow(layer) && (
																	<MoreHorizIcon
																		aria-controls={'source-menu'}
																		className={'moreIcon ' + classes.moreIcon}
																		onClick={e => {
																			e.stopPropagation();
																			handleClick(e);
																			setActionItem({ group: layer });
																		}}
																	/>
																)}
															</StyledListItem>
														</AccordionSummary>
														<Box paddingLeft={2} paddingRight={2}>
															<List className={classes.list}>
																{layer.layers.map((groupLayer, index) => (
																	<StyledListItem key={index} ContainerComponent="li">
																		<Checkbox
																			checked={groupLayer.layerSettings.showable}
																			color="dark gray"
																			onChange={() => changeShowAble(groupLayer)}
																			inputProps={{ 'aria-label': 'primary checkbox' }}
																		/>
																		{/* Group Layer */}
																		<EditableTextField
																			onChange={changeLayerName}
																			item={groupLayer}
																			name={groupLayer.layerName}
																			isEditable={false}
																			openEditField={
																				groupLayer?.layerId === actionItem?.layer?.layerId &&
																				actionItem?.type === 'editName'
																			}
																		/>
																		{checkIfDeleteAllow(groupLayer) && (
																			<MoreHorizIcon
																				aria-controls={'source-menu'}
																				className={'moreSourceIcon ' + classes.moreSourceIcon}
																				onClick={e => {
																					e.stopPropagation();
																					handleClick(e);
																					setActionItem({ layer: groupLayer });
																				}}
																			/>
																		)}
																	</StyledListItem>
																))}
															</List>
														</Box>
													</Accordion>
												);
											}
											//// remove the (layer.identifier!="Tracked Owners") if statement to show the tracked owers layer
											if (layer.identifier !== 'Tracked Owners') {
												if (layer.layerName === 'Tracked Wells' || layer.layerName === 'User Tags') {
													let layerName = '';
													if (props?.data?.layerName === 'Tracked Wells') {
														layerName = FEATURES.TRACKEDWELLSLAYER;
													} else if (props?.data?.layerName === 'User Tags') {
														layerName = FEATURES.USERTAGSLAYER;
													}
													return (
														<FeatureFlag feature={layerName}>
															<StyledListItem key={index} ContainerComponent="li">
																<Checkbox
																	checked={layer.layerSettings.showable}
																	color="dark gray"
																	onChange={() => changeShowAble(layer)}
																	inputProps={{ 'aria-label': 'primary checkbox' }}
																/>
																<ListItemText id={labelId} primary={layer.layerName} />
															</StyledListItem>
														</FeatureFlag>
													);
												} else {
													return (
														<StyledListItem key={index} ContainerComponent="li">
															<Checkbox
																checked={layer.layerSettings.showable}
																color="dark gray"
																onChange={() => changeShowAble(layer)}
																inputProps={{ 'aria-label': 'primary checkbox' }}
															/>
															{layer.layerType === 'file layer' || checkIfcustomLayerCopy(layer) ? (
																<>
																	{/* Layer */}
																	<EditableTextField
																		onChange={changeLayerName}
																		item={layer}
																		name={layer.layerName}
																		isEditable={false}
																		openEditField={
																			layer?.layerId === actionItem?.layer?.layerId && actionItem?.type === 'editName'
																		}
																	/>

																	{checkIfDeleteAllow(layer) && (
																		<MoreHorizIcon
																			aria-controls={'source-menu'}
																			className={'moreSourceIcon ' + classes.moreSourceIcon}
																			onClick={e => {
																				e.stopPropagation();
																				handleClick(e);
																				setActionItem({ layer });
																			}}
																		/>
																	)}
																</>
															) : (
																<ListItemText
																	id={labelId}
																	primary={layer.layerName === 'Parcels' ? 'Tracts' : layer.layerName}
																/>
															)}

															{layer.layerName === 'Units' && (
																<FeatureFlag feature={FEATURES.UNITIMPORT}>
																	<ListItemSecondaryAction>
																		<IconButton
																			edge="end"
																			size="small"
																			onClick={() => {
																				history.push('/bulkupload/units');
																			}}
																		>
																			<UploadIcon opacity="1.0" small />
																		</IconButton>
																	</ListItemSecondaryAction>
																</FeatureFlag>
															)}

															{layer.layerName === 'Parcels' && (
																<FeatureFlag feature={FEATURES.TRACTIMPORT}>
																	<ListItemSecondaryAction>
																		<IconButton
																			edge="end"
																			size="small"
																			onClick={() => {
																				history.push('/bulkupload/tracts');
																			}}
																		>
																			<UploadIcon opacity="1.0" small />
																		</IconButton>
																	</ListItemSecondaryAction>
																</FeatureFlag>
															)}
														</StyledListItem>
													);
												}
											}
											return null;
										})}
									</List>
								</Collapse>
							</div>
						</div>
					</div>
					{/* //// delete confirmation dialog */}
					{openDeleteDialog && (
						<Dialog
							className={classes.dialog}
							open={openDeleteDialog}
							onClose={() => {
								setOpenDeleteDialog(false);
							}}
							fullWidth={true}
							maxWidth={'sm'}
						>
							<DeleteConfirmationDialog
								openDialog={openDeleteDialog}
								handleDialogClose={setOpenDeleteDialog}
								layer={actionItem.layer || actionItem.group}
							/>
						</Dialog>
					)}
				</div>

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
											onClick={e => {
												e.stopPropagation();
												setOpenDeleteDialog(Boolean(actionItem.layer || actionItem.group));
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
			</>
		</ClickAwayListener>
	);
}
