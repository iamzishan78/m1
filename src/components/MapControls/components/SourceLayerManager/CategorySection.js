import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Collapse, IconButton, Divider, Popper, Grow, Paper, MenuList, MenuItem } from '@material-ui/core';
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

import PropTypes from 'prop-types';

import EditableTextField from 'components/Shared/components/Fields/EditableTextField';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import UploadIcon from 'components/Shared/svgIcons/uploadIcon';

import { layerController } from 'hookstate/layerStateController';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

const useStyles = makeStyles(() => ({
	accordion: {
		'& .MuiAccordionSummary-content': {
			margin: '0px !important',
		},
	},
	list: {
		border: '2px solid #A9A9A9',
		padding: '0px',
		margin: '8px 0px',
		borderRadius: '8px',
	},
	multiSelectionTopBarButtons: {
		margin: '0px 5px',
		padding: '0px 5px',
		border: '1px solid #B3B3B3',
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

const StyledListHeader = withStyles(theme => ({
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

export default function CategorySection({ title, search, layerCategory }) {
	const classes = useStyles();
	let history = useHistory();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [actionItem, setActionItem] = React.useState(null);

	const [openM1, setOpenM1] = React.useState(true);
	const [selectAllMinerallayers, setSelectAllMinerallayers] = React.useState(false);
	const {
		layerStateValues: { projectedLayers },
	} = layerController.useState(['projectedLayers'], 'layerStateValues');

	const allowDelete = layerCategory === 'UD layer';

	const [openUDLayers, setUDLayersStates] = useState([]);

	const SectionLayers = React.useMemo(() => {
		// Filter layers
		const layers = projectedLayers?.filter(
			layer =>
				(layer.layerCategory === layerCategory && layerCategory === 'M1 Layer' && layer.identifier !== 'Land Grid') ||
				(layer.layerCategory === layerCategory && (layerCategory === 'UD layer' || layer.file))
		);
		return handleGroups(layers);
	}, [projectedLayers]);

	const handleCheckAllLayers = async (value, layerType) => {
		const categoryLayers = projectedLayers.filter(layer => layer.layerCategory === layerType);
		layerController.handleLayerChange({ layers: categoryLayers }, 'layerSettings.showable', value);

		if (layerType === 'M1 Layer') {
			setSelectAllMinerallayers(value);
		}
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
	useEffect(() => {
		checkAllLayers(SectionLayers, 'M1');
	}, [projectedLayers]);

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

	return (
		<>
			<StyledListHeader button onClick={() => setOpenM1(!openM1)}>
				{layerCategory === 'M1 Layer' && (
					<Checkbox
						checked={selectAllMinerallayers}
						color="darkgray"
						onClick={e => e.stopPropagation()}
						onChange={() => {
							handleCheckAllLayers(!selectAllMinerallayers, layerCategory);
						}}
						inputProps={{ 'aria-label': 'primary checkbox' }}
					/>
				)}

				<ListItemText style={{ paddingLeft: layerCategory === 'UD layer' ? '20px' : '0px' }} primary={title} />
				{layerCategory === 'UD layer' && (
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
				)}

				{openM1 ? <ExpandLess /> : <ExpandMore />}
			</StyledListHeader>
			<Collapse in={openM1} timeout="auto" unmountOnExit>
				<List className={classes.list}>
					{SectionLayers?.filter(
						layer =>
							!search ||
							layer.name?.toLowerCase().includes(search?.toLowerCase()) ||
							layer.layerName?.toLowerCase().includes(search?.toLowerCase())
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
													onChange={(layer, name) => layerController.handleLayerChange(layer, 'groupName', name)}
													item={layer}
													name={layer.name}
													isEditable={false}
													showExpandIcon
													openUd={openUDLayers.includes(index)}
													openEditField={layer?.id === actionItem?.group?.id && actionItem?.type === 'editName'}
												/>
												{allowDelete && (
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
															onChange={(layer, name) => layerController.handleLayerChange(layer, 'layerName', name)}
															item={groupLayer}
															name={groupLayer.layerName}
															isEditable={false}
															openEditField={
																groupLayer?.layerId === actionItem?.layer?.layerId && actionItem?.type === 'editName'
															}
														/>
														{allowDelete && (
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
										layerController.handleLayerChange(layer, 'layerSettings.showable', !layer.layerSettings.showable)
									}
									inputProps={{ 'aria-label': 'primary checkbox' }}
								/>
								{/* Group Layer */}
								<EditableTextField
									onChange={(layer, name) => layerController.handleLayerChange(layer, 'layerName', name)}
									item={layer}
									name={layer.layerName}
									isEditable={false}
									openEditField={layer?.layerId === actionItem?.layer?.layerId && actionItem?.type === 'editName'}
								/>

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

								{allowDelete && (
									<MoreHorizIcon
										aria-controls={'source-menu'}
										className={'moreSourceIcon ' + classes.moreSourceIcon}
										onClick={e => {
											e.stopPropagation();
											handleClick(e);
											setActionItem({ layer: layer });
										}}
									/>
								)}
							</StyledListItem>
						);
					})}
				</List>
			</Collapse>

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
	);
}

CategorySection.propTypes = {
	search: PropTypes.string,
	title: PropTypes.string,
	layerCategory: PropTypes.string,
};
