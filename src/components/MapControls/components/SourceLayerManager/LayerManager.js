import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, Collapse, IconButton, Divider, Popper, Grow, Paper, MenuList, MenuItem } from '@material-ui/core';
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

import EditableTextField from 'components/Shared/components/Fields/EditableTextField';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import { copy, deepEqual, truncate } from 'components/Shared/functions';
import UploadIcon from 'components/Shared/svgIcons/uploadIcon';

import { globalStateController } from 'hookstate/globalStateController';
import { layerController } from 'hookstate/layerStateController';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

const paddingLeft = 6;
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
		paddingLeft: theme.spacing(paddingLeft),
		paddingRight: theme.spacing(paddingLeft),
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

const THIRTY = 30;

export default function AddLayer(props) {
	const classes = useStyles();
	let history = useHistory();
	const { globalStateValues } = globalStateController.useState(['layers', 'user'], 'globalStateValues');
	const {
		layerStateValues: { projectedLayers },
	} = layerController.useState(['projectedLayers'], 'layerStateValues');
	const [openM1, setOpenM1] = React.useState(true);
	const [isOpenUserDefinedLayers, setIsOpenUserDefinedLayers] = React.useState(true);
	const [currentLayers, setCurrentLayers] = React.useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openUDLayers, setUDLayersStates] = useState([]);
	const [selectAllMinerallayers, setSelectAllMinerallayers] = React.useState(false);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [actionItem, setActionItem] = React.useState(null);

	useEffect(() => {
		layerController.getProjectedLayers();
	}, []);

	useEffect(() => {
		if (!deepEqual(currentLayers, globalStateValues.layers)) {
			setCurrentLayers(copy(globalStateValues.layers));
		}
	}, [currentLayers, globalStateValues.layers]);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
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

	const handleCheckAllLayers = async (value, layerType) => {
		const categoryLayers = projectedLayers.filter(layer => layer.layerCategory === layerType);
		layerController.handleLayerChange({ layers: categoryLayers }, 'layerSettings.showable', value);

		if (layerType === 'M1 Layer') {
			setSelectAllMinerallayers(value);
		}
	};
	const checkIfDeleteAllow = layer => {
		if (layer.name === 'Agreements' || layer.groupName === 'Agreements') {
			return false;
		}
		return true;
	};

	const checkIfcustomLayerCopy = layer => {
		const customLayers = ['Units', 'Parcels', 'Agreements', 'Deeds', 'Leases', 'Contracts', 'Surfaces'];
		if (customLayers.includes(layer.identifier)) {
			return false;
		}
		return true;
		// Checking if layer.layerName starts with any customLayers
		// return customLayers.some(customLayer => layer.identifier.startsWith(customLayer));
	};

	const handleGroups = layers => {
		const groupHandled = [];
		for (let index = 0; index < layers.length; index++) {
			const UdLayer = layers[index];
			if (UdLayer.groupId && !groupHandled.includes(UdLayer.groupId)) {
				groupHandled.push(UdLayer.groupId);
				const groupLayers = layers?.filter(ul => ul.groupId === UdLayer.groupId);
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
		return layers?.filter(ul => !ul.groupId);
	};

	const M1Layers = React.useMemo(() => {
		// Filter layers
		const layers = projectedLayers?.filter(
			layer => layer.layerCategory === 'M1 Layer' && layer.identifier !== 'Land Grid'
		);
		return handleGroups(layers);
	}, [projectedLayers]);

	const UdLayers = React.useMemo(() => {
		const layers = projectedLayers.filter(layer => layer.layerCategory === 'UD layer' || layer.file);
		return handleGroups(layers);
	}, [projectedLayers]);

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
	useEffect(() => {
		checkAllLayers(M1Layers, 'M1');
		checkAllLayers(UdLayers, 'UD');
	}, [projectedLayers]);

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
										onChange={() => {
											handleCheckAllLayers(!selectAllMinerallayers, 'M1 Layer');
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
												!props.search ||
												layer.name?.toLowerCase().includes(props?.search?.toLowerCase()) ||
												layer.layerName?.toLowerCase().includes(props?.search?.toLowerCase())
										)?.map((layer, index) => {
											const labelId = `m1layer-list-label-${index}`;

											if (layer.type === 'group') {
												return (
													<>
														<Accordion key={labelId} className={classes.accordion}>
															<AccordionSummary
																// expandIcon={<ExpandMoreIcon />}
																aria-controls="panel1a-content"
																id="panel1a-header"
																style={{ padding: 0, margin: 0, marginBottom: 0 }}
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
																		onChange={() =>
																			layerController.handleLayerChange(
																				layer,
																				'layerSettings.showable',
																				!layer.layers.find(l => l.layerSettings.showable)
																			)
																		}
																		inputProps={{ 'aria-label': 'primary checkbox' }}
																	/>
																	{/* Group */}
																	<EditableTextField
																		onChange={(layer, name) =>
																			layerController.handleLayerChange(layer, 'groupName', name)
																		}
																		item={layer}
																		name={layer.name}
																		isEditable={false}
																		showExpandIcon
																		openUd={openUDLayers.includes(index)}
																		openEditField={
																			layer?.id === actionItem?.group?.id && actionItem?.type === 'editName'
																		}
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
																		<StyledListItem key={`${groupLayer.layerName - index}`} ContainerComponent="li">
																			<Checkbox
																				checked={groupLayer.layerSettings.showable}
																				color="dark gray"
																				onChange={() =>
																					layerController.handleLayerChange(
																						groupLayer,
																						'layerSettings.showable',
																						!groupLayer.layerSettings.showable
																					)
																				}
																				inputProps={{ 'aria-label': 'primary checkbox' }}
																			/>
																			{/* Group Layer */}
																			<EditableTextField
																				onChange={(layer, name) =>
																					layerController.handleLayerChange(layer, 'layerName', name)
																				}
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
														<Divider style={{ height: '2px' }} />
													</>
												);
											}

											return (
												<StyledListItem ContainerComponent="li" key={labelId}>
													<Checkbox
														checked={layer.layerSettings.showable}
														color="dark gray"
														onChange={() =>
															layerController.handleLayerChange(
																layer,
																'layerSettings.showable',
																!layer.layerSettings.showable
															)
														}
														inputProps={{ 'aria-label': 'primary checkbox' }}
													/>
													{/* Override layer manager name of Wells */}
													<ListItemText id={labelId} primary={truncate(layer.layerName, THIRTY)} />

													{layer.identifier === 'Units' && (
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

													{layer.identifier === 'Parcels' && (
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
										})}
									</List>
								</Collapse>
								<StyledListItem2 button onClick={() => setIsOpenUserDefinedLayers(!isOpenUserDefinedLayers)}>
									<ListItemText style={{ paddingLeft: '20px' }} primary="Client Specific Layers" />
									<Button
										color="secondary"
										startIcon={<ClearButton />}
										className={classes.multiSelectionTopBarButtons}
										onClick={event => {
											event.stopPropagation();
											handleCheckAllLayers(false, 'UD layer');
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
												layer.name?.toLowerCase().includes(props?.search?.toLowerCase()) ||
												layer.layerName?.toLowerCase().includes(props?.search?.toLowerCase())
										)?.map((layer, index) => {
											const labelId = `udlayer-list-label-${index}`;
											if (layer.type === 'group') {
												return (
													<>
														<Accordion key={labelId} className={classes.accordion}>
															<AccordionSummary
																// expandIcon={<ExpandMoreIcon />}
																aria-controls="panel1a-content"
																id="panel1a-header"
																style={{ padding: 0, margin: 0, marginBottom: 0 }}
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
																		onChange={() =>
																			layerController.handleLayerChange(
																				layer,
																				'layerSettings.showable',
																				!layer.layers.find(l => l.layerSettings.showable)
																			)
																		}
																		inputProps={{ 'aria-label': 'primary checkbox' }}
																	/>
																	{/* Group */}
																	<EditableTextField
																		onChange={(layer, name) =>
																			layerController.handleLayerChange(layer, 'groupName', name)
																		}
																		item={layer}
																		name={layer.name}
																		isEditable={false}
																		showExpandIcon
																		openUd={openUDLayers.includes(index)}
																		openEditField={
																			layer?.id === actionItem?.group?.id && actionItem?.type === 'editName'
																		}
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
																		<StyledListItem key={`${groupLayer.layerName - index}`} ContainerComponent="li">
																			<Checkbox
																				checked={groupLayer.layerSettings.showable}
																				color="dark gray"
																				onChange={() =>
																					layerController.handleLayerChange(
																						groupLayer,
																						'layerSettings.showable',
																						!groupLayer.layerSettings.showable
																					)
																				}
																				inputProps={{ 'aria-label': 'primary checkbox' }}
																			/>
																			{/* Group Layer */}
																			<EditableTextField
																				onChange={(layer, name) =>
																					layerController.handleLayerChange(layer, 'layerName', name)
																				}
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
														<Divider style={{ height: '2px' }} />
													</>
												);
											}

											return (
												<StyledListItem ContainerComponent="li" key={labelId}>
													<Checkbox
														checked={layer.layerSettings.showable}
														color="dark gray"
														onChange={() =>
															layerController.handleLayerChange(
																layer,
																'layerSettings.showable',
																!layer.layerSettings.showable
															)
														}
														inputProps={{ 'aria-label': 'primary checkbox' }}
													/>
													{layer.layerType === 'file layer' || checkIfcustomLayerCopy(layer) ? (
														<>
															{/* Layer */}
															<EditableTextField
																onChange={(layer, name) => layerController.handleLayerChange(layer, 'layerName', name)}
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
														<ListItemText id={labelId} primary={layer.layerName} />
													)}
												</StyledListItem>
											);
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
