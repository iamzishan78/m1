import React, { useState } from 'react';
import { FixedSizeList } from 'react-window';

import { Box, Typography, ListItem, ListItemText, Collapse } from '@material-ui/core';

import { ChevronRight } from '@mui/icons-material';
import { ListItemButton } from '@mui/material';

import { layerStylingController } from 'stateManagement/layersStylingController';
import { layerController } from 'stateManagement/layerStateController';

import { styleImageMap } from './components/Layer/Common';

export default function LegendCollapse({ layer, basedOnKey, basedOnDict, typography, isImage, isColor, isAggLayer }) {
	const [open, setOpen] = useState(false);

	const { layerGeometry, layerIdentifier } = layer;
	const legendData = Object.keys(basedOnDict?.[basedOnKey?.label] || {});

	const handleToggle = () => setOpen(!open);

	const attroptions = (layerController.getValue('bins') || []).map((key, index) => {
		if (isAggLayer) {
			const hexColors = layerStylingController
				?.getValue('selectedPalette')
				?.map(rgb => `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`);

			return {
				label: key,
				color: hexColors[index],
			};
		}
		return null;
	});

	const Row = ({ index, style }) => {
		const item = !isAggLayer ? legendData[index] : attroptions[index];
		return (
			<div style={style}>
				<ListItem
					sx={{
						py: 1,
						px: 2,
						display: 'flex',
						gap: 2,
						alignItems: 'center',
					}}
				>
					<Box
						sx={{
							width: 24,
							height: 24,
							background:
								isImage && !isAggLayer
									? `url(${styleImageMap[basedOnDict?.[basedOnKey?.label]?.[item]]}) center/cover`
									: !isAggLayer
										? basedOnDict?.[basedOnKey?.label]?.[item]
										: item.color,
							flexShrink: 0,
							marginRight: 8,
						}}
					/>
					<Typography variant="body2">{!isAggLayer ? item : item.label}</Typography>
				</ListItem>
			</div>
		);
	};

	return (
		<>
			<ListItem
				sx={{
					color: '#b0b0b0',
					py: 1.5,
					px: 2,
					borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
				}}
			>
				<ListItemText primary={`${layerGeometry ? layerGeometry : 'Polygon'} ${layerIdentifier}`} />
			</ListItem>

			<ListItemButton
				onClick={handleToggle}
				sx={{
					py: 1.5,
					px: 2,
					display: 'flex',
					justifyContent: 'space-between',
					borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
				}}
			>
				<Typography>
					<b>
						{basedOnKey?.label} ( {typography} )
					</b>
				</Typography>
				<ChevronRight
					sx={{
						transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
						transition: 'transform 0.3s',
					}}
				/>
			</ListItemButton>

			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ maxHeight: 300, overflow: 'hidden' }}>
					<FixedSizeList
						height={300}
						itemCount={!isAggLayer ? legendData.length : attroptions.length}
						itemSize={48} // Adjust based on item height
						width="100%"
					>
						{Row}
					</FixedSizeList>
				</Box>
			</Collapse>
		</>
	);
}
