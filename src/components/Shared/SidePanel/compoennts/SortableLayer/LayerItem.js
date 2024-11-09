import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Grid, ListItemIcon } from '@material-ui/core';

import { Flipped } from 'react-flip-toolkit';
import { useSelector } from 'react-redux';
import { getLayerColor } from '../common';
import { useDrag, useDrop, useIsClosestDragging } from 'react-sortly';
import { DragIndicator } from '@material-ui/icons';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { Badge, IconButton } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LayerControls from './LayerControls';
import { FormControlLabel } from '@material-ui/core';
import { Switch } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

// icons
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { mapStateController } from 'hookstate/mapStateController';
import { globalStateController } from 'hookstate/globalStateController';

const useStyles = makeStyles(theme => ({
	root: props => ({
		fontFamily: 'Poppins',
		// backgroundColor: props.data.type === "group" ? "#2c3148" : "#040e24",
		backgroundColor: props.data.type === 'group' ? '#2c3148' : '#0e111a',

		// marginLeft: theme.spacing(props.depth * 2),
		color: props.muted ? theme.palette.primary.dark : 'inherit',
		zIndex: props.muted ? 1 : 0,
		fontWeight: props.data.type === 'group' ? 600 : 500,
		fontSize: props.data.type === 'group' ? 20 : 18,
		position: 'relative',
		height: (props.data.collapsed && props.data.type === 'layer') || !props.data.showable ? 0 : '50px',
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
		marginLeft: theme.spacing(props.depth * 2),
	}),
}));

const LayerItem = React.memo(props => {
	const [hoverItemIndex, setHoverItem] = useState(-1);
	const colors = useSelector(({ MainMap }) => MainMap);

	const { id, depth, data, onToggleCollapse, onToggleGroup, updateLayer, onDragEnd, onDragBegin } = props;
	const itemRef = React.useRef({ id: -1, depth: -1, data: {} });
	const { type, collapsed, name } = data;

	const {
		stateValues: { emptyGroups, mapView },
	} = globalStateController.useState(['emptyGroups', 'mapView']);

	const [{ isDragging }, drag, preview] = useDrag({
		collect: monitor => {
			return {
				isDragging: monitor.isDragging(),
			};
		},
		begin(f) {
			itemRef.current = data;
			onDragBegin(data);
		},
		end(f) {
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
				[bbox[0], bbox[1]], // southwestern corner of the bounds
				[bbox[2], bbox[3]], // northeastern corner of the bounds
			],
			{ padding: { top: 40, bottom: 40, left: 40, right: 40 }, easing: () => 1 }
		);
		mapStateController.moved();
	};

	const layerFilters = mapView?.selectedMapView?.filters.filter(
		filter => filter?.dataSourceName === data?.identifier || filter?.dataSourceName === data?.layerName
	);

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

								<Typography id={id} color="secondary" noWrap>
									{name === 'Wells' ? 'Platform Wells' : name}
								</Typography>
								<Box paddingLeft={1} display="flex">
									{type === 'group' && (
										<ListItemIcon onClick={handleClick}>
											{!collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
										</ListItemIcon>
									)}
								</Box>
								<div className="zoom-section">
									{type !== 'group' && data.visiable && data.file && data.defaultSettings?.bbox && (
										<ListItemIcon onClick={() => handleLayerZoomClick(data.defaultSettings.bbox)}>
											<ZoomInIcon htmlColor="#ffff" />
										</ListItemIcon>
									)}
								</div>
								{layerFilters?.length ? (
									<IconButton>
										<Badge
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

export default LayerItem;
