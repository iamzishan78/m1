import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { IconButton, Divider, withStyles, ListItem, makeStyles } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { Skeleton } from '@mui/material';

import { useVirtualizer } from '@tanstack/react-virtual';
import { min } from 'lodash';
import PropTypes from 'prop-types';

import EditableTextField from 'components/Shared/components/Fields/EditableTextField';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent';
import UploadIcon from 'components/Shared/svgIcons/uploadIcon';

import { layerController } from 'stateManagement/layerStateController';

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

const CategorySectionList = ({
	search,
	loading,
	SectionLayers,
	actionItem,
	layerCategory,
	handleClick,
	setActionItem,
}) => {
	const classes = useStyles();
	let history = useHistory();
	const parentRef = useRef();

	const allowDelete = layerCategory === 'UD layer';

	const [openUDLayers, setUDLayersStates] = useState([]);

	const filteredLayers = useMemo(
		() =>
			SectionLayers?.filter(
				layer =>
					!search ||
					layer.name?.toLowerCase().includes(search?.toLowerCase()) ||
					layer.layerName?.toLowerCase().includes(search?.toLowerCase())
			),
		[SectionLayers, search]
	);

	const rowVirtualizer = useVirtualizer({
		count: filteredLayers.length,
		getScrollElement: () => parentRef.current,
		estimateSize: index => {
			if (openUDLayers.includes(index)) {
				const rowCount = filteredLayers[index]?.layers?.length ?? 0;
				return 112 + rowCount * 42;
			}

			return 50;
		},
	});

	useEffect(() => {
		setUDLayersStates([]);
		rowVirtualizer.measure();
	}, [filteredLayers]);

	const maxHeight = 454.5;
	const itemHeight = 54;

	const calculatedHeight = useMemo(() => {
		const hasSingleLayerWithSubLayers =
			filteredLayers.length === 1 && openUDLayers.length > 0 && filteredLayers[0]?.layers?.length;

		if (hasSingleLayerWithSubLayers) {
			return 42 * filteredLayers[0].layers.length + 116;
		}

		return min([maxHeight, filteredLayers.length * itemHeight]);
	}, [filteredLayers, openUDLayers, maxHeight, itemHeight]);

	if (loading) {
		return (
			<List
				className={classes.list}
				ref={parentRef}
				style={{ overflowY: 'auto', overflowX: 'hidden', height: maxHeight }}
			>
				{Array.from({ length: 6 }, (_, i) => i + 1).map(i => (
					<Skeleton key={i} variant="rounded" height={i === 6 ? 30 : 50} style={{ margin: '1rem' }} />
				))}
			</List>
		);
	}

	return (
		<List
			className={classes.list}
			ref={parentRef}
			style={{
				overflowY: 'auto',
				overflowX: 'hidden',
				height: calculatedHeight,
			}}
		>
			<div
				style={{
					height: `${rowVirtualizer.getTotalSize()}px`,
					position: 'relative',
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
					const layer = filteredLayers[virtualRow.index];
					const labelId = `m1layer-list-label-${virtualRow.index}`;

					if (layer.type === 'group') {
						return (
							<StyledListItem
								ContainerComponent="li"
								key={labelId}
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.start}px)`,
								}}
							>
								<Accordion className={classes.accordion}>
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
											rowVirtualizer.measure();
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
											{layer.layers.map(groupLayer => (
												<StyledListItem key={groupLayer.layerId || groupLayer.layerName} ContainerComponent="li">
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
							</StyledListItem>
						);
					}

					return (
						<StyledListItem
							ContainerComponent="li"
							key={labelId}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
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
			</div>
		</List>
	);
};

CategorySectionList.propTypes = {
	search: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	SectionLayers: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			layerName: PropTypes.string,
			type: PropTypes.string,
			layers: PropTypes.arrayOf(
				PropTypes.shape({
					layerId: PropTypes.string,
					layerName: PropTypes.string,
					layerSettings: PropTypes.shape({
						showable: PropTypes.bool,
					}),
				})
			),
		})
	).isRequired,
	actionItem: PropTypes.shape({
		group: PropTypes.object,
		layer: PropTypes.object,
		type: PropTypes.string,
	}),
	layerCategory: PropTypes.string.isRequired,
	handleClick: PropTypes.func.isRequired,
	setActionItem: PropTypes.func.isRequired,
};

export default CategorySectionList;
