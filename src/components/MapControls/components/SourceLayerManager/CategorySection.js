import React, { useState, useEffect } from 'react';

import { Collapse, Popper, Grow, Paper, MenuList, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Close as ClearButton } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import PropTypes from 'prop-types';

import { layerController } from 'stateManagement/layerStateController';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
import CategorySectionList from './CategorySectionList';

const useStyles = makeStyles(() => ({
	multiSelectionTopBarButtons: {
		margin: '0px 5px',
		padding: '0px 5px',
		border: '1px solid #B3B3B3',
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
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [actionItem, setActionItem] = React.useState(null);

	const [openM1, setOpenM1] = React.useState(true);
	const [selectAllMinerallayers, setSelectAllMinerallayers] = React.useState(false);
	const {
		layerStateValues: { projectedLayers },
	} = layerController.useState(['projectedLayers'], 'layerStateValues');

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
				<CategorySectionList
					search={search}
					loading={!projectedLayers || projectedLayers.length === 0}
					SectionLayers={SectionLayers}
					actionItem={actionItem}
					layerCategory={layerCategory}
					handleClick={handleClick}
					setActionItem={setActionItem}
				/>
			</Collapse>

			{openDeleteDialog && (
				<Dialog
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
