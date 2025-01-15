import React, { useMemo } from 'react';

import { Tooltip, FormControlLabel, Switch } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { layerController } from 'hookstate/layerStateController.js';
import { mapControlsController } from 'hookstate/mapControlsController.js';

import { deepEqualObjects } from '../../../functions';
import { ifLayerHaveData } from '../common';

const useStyles = makeStyles(() => ({
	disabledLayerTitle: {
		'& span': { color: 'rgb(127, 149, 199) !important' },
	},
	formControl: {
		'& .MuiFormControlLabel-root': {
			margin: '0px !important',
			// backgroundColor: 'red',
		},
	},
}));

const LayerStylingControl = ({ isHover, layer }) => {
	const handleColorPicker = layer => {
		setTimeout(() => {
			mapControlsController.updateState({
				selectedLayer: layer,
				selectedLayerControl: layer,
				map: window.mapRef,
				addLayer: false,
				manageSourceLayer: false,
				manageLayer: false,
			});
		}, 0);
	};

	return (
		<IconButton size="small" data-testid="layer-settings">
			<Tooltip title="Layer Styling">
				<KeyboardArrowRightIcon
					fontSize="small"
					htmlColor={isHover ? 'white' : '#808ba3'}
					onClick={() => handleColorPicker(layer)}
				/>
			</Tooltip>
		</IconButton>
	);
};

const LayerControls = ({ layer, updateLayer, isHover }) => {
	const classes = useStyles();

	layerController.useState(['wellListFromSearch']);

	const handleToggleVisibilty = layer => {
		const updatedLayer = {
			...layer,
			layerSettings: {
				...layer.layerSettings,
				visiable: !layer.layerSettings.visiable,
			},
		};
		layerController.updateLayer(updatedLayer, { visiable: !layer.layerSettings.visiable });
		updateLayer(updatedLayer);
	};

	const isChecked = useMemo(() => layer.layerSettings?.visiable !== false, [layer.layerSettings?.visiable]);

	return (
		<>
			<Grid
				container
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Grid item xs={4} className={classes.formControl}>
					<FormControlLabel
						control={
							<Switch
								data-testid={`layer-${layer.name}-toggle`}
								disabled={!ifLayerHaveData(layer) ? !!classes.disabledLayerTitle : false}
								checked={isChecked}
								onChange={() => handleToggleVisibilty(layer)}
								size="small"
							/>
						}
					/>
				</Grid>
				<Grid item xs={4}>
					{(layer.layerSettings?.colorable || layer.layerSettings?.interaction?.interactionAble) && (
						<LayerStylingControl isHover={isHover} layer={layer} />
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default React.memo(LayerControls, deepEqualObjects);
