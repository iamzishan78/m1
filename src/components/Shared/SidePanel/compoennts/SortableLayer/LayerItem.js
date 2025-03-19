import React, { useState } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { useSelector } from 'react-redux';
import { useDrag, useDrop, useIsClosestDragging } from 'react-sortly';

import { Box, Grid, ListItemIcon, FormControlLabel, Switch } from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { makeStyles } from '@material-ui/styles';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Badge, IconButton } from '@mui/material';

import PropTypes from 'prop-types';

// Internal imports
import { viewStateController } from 'components/MRTTable/Common/GridView/ViewController';

import { globalStateController } from 'controllers/globalStateController';
import { mapControlsController } from 'controllers/mapControlsController';
import { mapStateController } from 'controllers/mapStateController';

import LayerControls from './LayerControls';
import { getLayerColor } from '../common';
import NameWithTooltip from '../Common/NameWithTooltip';

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;
const EIGHTEEN = 18;
const TWENTY = 20;
const FOURTY = 40;
const FIVE_HUNDRED = 500;
const SIX_HUNDRED = 600;

const useStyles = makeStyles(theme => ({
	root: props => ({
		fontFamily: 'Poppins',
		// backgroundColor: props.data.type === "group" ? "#2c3148" : "#040e24",
		backgroundColor: props.data.type === 'group' ? '#2c3148' : '#0e111a',

		// marginLeft: theme.spacing(props.depth * 2),
		color: props.muted ? theme.palette.primary.dark : 'inherit',
		zIndex: props.muted ? ONE : ZERO,
		fontWeight: props.data.type === 'group' ? SIX_HUNDRED : FIVE_HUNDRED,
		fontSize: props.data.type === 'group' ? TWENTY : EIGHTEEN,
		position: 'relative',
		height: (props.data.collapsed && props.data.type === 'layer') || !props.data.showable ? ZERO : '50px',
		overflow: 'hidden',
		disabledLayerTitle: {
			'& span': { color: 'rgb(127, 149, 199) !important' },
		},
		'& .zoom-section': {
			display: 'none',
		},
		'&:hover': {
			background: '#506187',
			'& .zoom-section': {
				display: 'flex',
				cursor: 'pointer',
			},
		},
		'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
			color: theme.palette.common.white,
			minWidth: '40px', // for some reason controls the icon spacing
		},
		'& .MuiTypography-root': {
			color: theme.palette.common.white,
		},
		paddingLeft: '10px',
		justifyContent: 'center',
		alignItems: 'center',
	}),
	subContainer: props => ({
		marginLeft: theme.spacing(props.depth * TWO),
	}),
}));

const LayerItem = React.memo(props => {
	const [hoverItemIndex, setHoverItem] = useState(-1);
	const colors = useSelector(({ MainMap }) => MainMap);

	const { id, depth, data, onToggleCollapse, onToggleGroup, updateLayer, onDragEnd, onDragBegin } = props;
	const itemRef = React.useRef({ id: -1, depth: -1, data: {} });
	const { type, collapsed, name } = data;

	const {
		stateValues: { selectedView },
	} = viewStateController('MapView').useState(['selectedView']);
	const {
		stateValues: { emptyGroups },
	} = globalStateController.useState(['emptyGroups']);

	const [{ isDragging }, drag, preview] = useDrag({
		collect: monitor => {
			return {
				isDragging: monitor.isDragging(),
			};
		},
		begin() {
			itemRef.current = data;
			onDragBegin(data);
		},
		end() {
			onDragEnd(itemRef.current, data);
		},
	});
	const [, drop] = useDrop();

	const handleClick = () => {
		if (type === 'file') {
			return;
		}
		onToggleCollapse(id);
	};

	const classes = useStyles({
		...props,
		depth,
		muted: useIsClosestDragging() || isDragging,
	});

	const handleLayerZoomClick = bbox => {
		window.mapRef?.fitBounds(
			[
				[bbox[ZERO], bbox[ONE]], // southwestern corner of the bounds
				[bbox[TWO], bbox[THREE]], // northeastern corner of the bounds
			],
			{ padding: { top: FOURTY, bottom: FOURTY, left: FOURTY, right: FOURTY }, easing: () => ONE }
		);
		mapStateController.moved();
	};

	const layerFilters = selectedView?.filters.filter(filter => {
		const { dataSourceName } = filter || {};

		// In case of shape files
		const fileId = dataSourceName.substring(0, dataSourceName.indexOf('_'));
		const layerIdentifier = dataSourceName.substring(dataSourceName.indexOf('_') + 1);
		if (fileId === data?.file && layerIdentifier === data?.layerIdentifier) {
			return true;
		}

		return (
			[data?.identifier, data?.layerName, data?.name].includes(dataSourceName) ||
			data?.identifier?.startsWith(dataSourceName)
		);
	});

	return (
		<Flipped flipId={id}>
			<div
				data-testid={`${type}-${name}`}
				ref={ref => drop(preview(ref))}
				onMouseEnter={() => setHoverItem(id)}
				onMouseLeave={() => setHoverItem(null)}
			>
				{props?.data?.emptyLayer === true ? (
					<Box padding={props.data.collapsed ? '0px' : '20px'}></Box>
				) : (
					<Grid container className={classes.root} direction="row">
						<Grid
							item
							xs={8}
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
							}}
						>
							<Grid
								container
								direction="row"
								wrap="nowrap"
								className={classes.subContainer}
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-start',
									// marginLeft: '20px',
									alignItems: 'center',
								}}
							>
								<Box borderLeft={4} style={{ borderColor: getLayerColor(data, 'layer', colors) }}>
									{hoverItemIndex === id ? (
										<ListItemIcon ref={drag}>
											<DragIndicator style={{ cursor: 'move', justifyContent: 'center' }} />
										</ListItemIcon>
									) : (
										<ListItemIcon />
									)}
								</Box>
								<NameWithTooltip
									style={{
										color: 'secondary',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
									index={hoverItemIndex}
									title={name}
									height={'18px'}
								/>
								<Box paddingLeft={1} display="flex">
									{type === 'group' && (
										<ListItemIcon onClick={handleClick}>
											{!collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
										</ListItemIcon>
									)}
								</Box>
								<div className="zoom-section">
									{type !== 'group' &&
										data.visiable &&
										data.file &&
										data.defaultSettings?.bbox &&
										data.defaultSettings.bbox.length >= 4 && (
											<ListItemIcon onClick={() => handleLayerZoomClick(data.defaultSettings.bbox)}>
												<ZoomInIcon htmlColor="#ffff" />
											</ListItemIcon>
										)}
								</div>
								{layerFilters?.length ? (
									<IconButton>
										<Badge
											onClick={() => mapControlsController.updateState({ selectedControl: 'filter' })}
											badgeContent={layerFilters?.length}
											color="primary"
											overlap="circular"
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											sx={{
												'& .MuiBadge-badge': {
													minWidth: '18px', // Adjust as needed
													height: '18px', // Adjust as needed
													fontSize: '0.75rem', // Adjust to make text smaller
												},
											}}
										>
											<FilterAltIcon style={{ color: '#FFFFFF' }} />
										</Badge>
									</IconButton>
								) : null}
							</Grid>
						</Grid>

						<Grid
							item
							xs={4}
							styles={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								flexGrow: 1,
							}}
						>
							{type === 'layer' && (
								<LayerControls
									type={'layer'}
									layer={data}
									labelId={id}
									updateLayer={updateLayer}
									isHover={hoverItemIndex === id}
								/>
							)}

							{type === 'group' && (
								<Grid
									container
									spacing={1}
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'flex-end',
										alignItems: 'center',
									}}
								>
									<Grid item style={{ paddingRight: '40px' }}>
										<FormControlLabel
											control={
												<Switch
													disabled={!!emptyGroups?.includes?.(data.id)}
													checked={data.visiable}
													onChange={() => onToggleGroup(id)}
													size="small"
												/>
											}
										/>
									</Grid>
								</Grid>
							)}
						</Grid>
					</Grid>
				)}
			</div>
		</Flipped>
	);
});

LayerItem.displayName = 'LayerItem';

LayerItem.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	depth: PropTypes.number.isRequired,
	data: PropTypes.shape({
		type: PropTypes.string,
		collapsed: PropTypes.bool,
		name: PropTypes.string,
		file: PropTypes.string,
		layerIdentifier: PropTypes.string,
		identifier: PropTypes.string,
		layerName: PropTypes.string,
		emptyLayer: PropTypes.bool,
		visiable: PropTypes.bool,
		defaultSettings: PropTypes.shape({
			bbox: PropTypes.arrayOf(PropTypes.number),
		}),
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}).isRequired,
	onToggleCollapse: PropTypes.func.isRequired,
	onToggleGroup: PropTypes.func.isRequired,
	updateLayer: PropTypes.func.isRequired,
	onDragEnd: PropTypes.func.isRequired,
	onDragBegin: PropTypes.func.isRequired,
};

export default LayerItem;
