import React, { useMemo } from 'react';


import { Tooltip, FormControlLabel, Switch, Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import PropTypes from 'prop-types';

import { layerController } from 'stateManagement/layerStateController.js';
import { mapControlsController } from 'stateManagement/mapControlsController.js';

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
					onClick={() => {
						mapControlsController.updateState({ selectedDataset: null, mapGridCardActivated: false });
						handleColorPicker(layer);
					}}
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

LayerStylingControl.propTypes = {
	isHover: PropTypes.bool,
	layer: PropTypes.shape({
		layerSettings: PropTypes.shape({
			colorable: PropTypes.bool,
			interaction: PropTypes.shape({
				interactionAble: PropTypes.bool,
			}),
			visiable: PropTypes.bool,
		}),
		name: PropTypes.string,
	}).isRequired,
};

LayerControls.propTypes = {
	layer: PropTypes.shape({
		name: PropTypes.string,
		layerSettings: PropTypes.shape({
			colorable: PropTypes.bool,
			visiable: PropTypes.bool,
			interaction: PropTypes.shape({
				interactionAble: PropTypes.bool,
			}),
		}),
	}).isRequired,
	updateLayer: PropTypes.func.isRequired,
	isHover: PropTypes.bool,
};

export default React.memo(LayerControls, deepEqualObjects);
