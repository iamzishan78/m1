import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Grid, IconButton, Divider, FormControlLabel, Switch, Tooltip, ClickAwayListener } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { UPDATELAYERSETTINGS } from '../../../../graphQL/useMutationUpdateLayerSettings';
import GridOnIcon from '@material-ui/icons/GridOn';
import { getLayerColor } from 'components/Shared/SidePanel/compoennts/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent.js';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import { LAYERS_FEATURES_COUNT } from 'graphQL/useQueryLayerFeaturesCount';
import { useLayerStyle, useStyles, WidthPicker } from './Common';
import { globalStateController } from 'hookstate/globalStateController';
import { mapControlsController } from 'hookstate/mapControlsController';
import { layerController } from 'hookstate/layerStateController';
import { Typography } from '@mui/material';
import { Slider, TextField, Box } from '@mui/material';
import { colorBasedAttributes } from './LayerAttributes/ColorBasedAttributes';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { AppContext } from 'AppContext';
import AttrsAutocomplete from './LayerAttributes/AttrsAutocomplete';
import AttrsValuesDropdown from './LayerAttributes/AttrsValuesDropdown';
import { getLayerKey } from 'hookstate/helpers';
import _ from 'lodash';

function LayerStyling() {
	const classes = useStyles();
	const { mapControlsStateValues, ...mapControlStates } = mapControlsController.useState(
		['selectedLayer'],
		'mapControlsStateValues'
	);
	const selectedLayer = mapControlsStateValues.selectedLayer;

	const layerType = selectedLayer.layerPaintProps[0]?.paintType;
	const {
		width,
		setWidth,
		fillColor,
		setFillColor,
		enablefillColor,
		setEnableFillColor,
		enableStrokeColor,
		setEnableStrokeColor,
		selectedValue,
		setSelectedValue,
		selectedStrokeValue,
		setSelectedStrokeValue,
		attributeBasedColors,
		setAttributeBasedColors,
		attributeBasedStrokeColors,
		setAttributeBasedStrokeColors,
		layerLabelVisibility,
		setLayerLabelVisibility,
		layerClickability,
		setLayerClickability,
		strokeColor,
		setStrokeColor,
		handleLayerChange,
		strokeWidth,
		setStrokeWidth,
	} = useLayerStyle(selectedLayer);

	const [rows, setRows] = useState(0);
	const [stateApp] = useContext(AppContext);

	const [layerFeaturesCount, { data: layerDataCount }] = useLazyQuery(LAYERS_FEATURES_COUNT);

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

	// Getting meta data for selected layer
	useEffect(() => {
		if (colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.layerKey)
			getMetaData({
				variables: {
					user: stateApp.user?.mongoId,
					category: colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.layerKey,
				},
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setRows(layerDataCount?.layerFeaturesCount || 0);
	}, [layerDataCount]);

	useEffect(() => {
		setRows(0);
		if (selectedLayer.file) {
			layerFeaturesCount({ variables: { fileId: selectedLayer.file } });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapControlStates.selectedLayer.file, layerFeaturesCount]);

	const handleClose = () => {
		mapControlsController.updateState({ selectedLayerControl: null });
	};

	const handleApplyChanges = () => {
		const hookStateAppLayers = globalStateController.getValue('layers');

		// Checks to check if we wanted to run handleApplyChnages
		if (
			(hookStateAppLayers &&
				selectedLayer &&
				((fillColor && fillColor.rgb && (fillColor.alpha || fillColor.alpha === 0)) ||
					(strokeColor && strokeColor.rgb && (strokeColor.alpha || strokeColor.alpha === 0)))) ||
			width ||
			selectedLayer.layerPaintProps[0]?.labelProps?.visibility !== layerLabelVisibility ||
			parseInt(selectedLayer.layerPaintProps[0]?.paintProps?.strokeWidth) !== parseInt(strokeWidth) ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.click !== layerClickability ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.enablefillColor !== enablefillColor ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.enableStrokeColor !== enableStrokeColor ||
			!_.isEqual(selectedLayer.layerSettings?.attributeBasedColors, attributeBasedColors) ||
			!_.isEqual(selectedLayer.layerSettings?.attributeBasedStrokeColors, attributeBasedStrokeColors) ||
			selectedLayer.layerSettings?.selectedAttribute?.label !== selectedValue?.label ||
			selectedLayer.layerSettings?.selectedStrokeAttribute?.label !== selectedStrokeValue?.label
		) {
			let { currentLayer } = handleLayerChange();
			//// saving to stateApp
			const currentLayers = [...hookStateAppLayers];
			const index = currentLayers.findIndex(l => l._id === currentLayer._id);
			currentLayers[index] = currentLayer;
			globalStateController.updateState({ layers: currentLayers });
			layerController.handleDeckLayer(currentLayer);

			//// saving to mongo
			updateLayerSettings({
				variables: {
					settings: {
						_id: currentLayer._id,
						layerPaintProps: currentLayer.layerPaintProps,
						layerSettings: currentLayer.layerSettings,
					},
				},
			});
			layerController.resetBounds(selectedLayer?.identifier);
			////
		}
		handleClose();
	};

	// Merging summaryfield keys and custom data keys of selected  layer
	const options = useMemo(() => {
		const colorAttributes =
			colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.keys || [];
		const metaDataOptions =
			metaDataRes?.getMetaData?.metaData?.map(md => ({
				label: md.name,
				value: md.esKey,
			})) || [];

		return [...colorAttributes, ...metaDataOptions];
	}, [selectedLayer, metaDataRes]);

	return (
		<ClickAwayListener onClickAway={handleApplyChanges}>
			<div style={{ width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
				<Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: '15px' }}>
					<Grid item md={11}>
						{/* Override layer styling names of Parcel and Wells */}
						<Typography variant="h5" noWrap>
							{selectedLayer.layerName === 'Parcels'
								? 'Tracts'
								: selectedLayer.layerName === 'Wells'
									? 'Platform Wells'
									: selectedLayer.layerName}
						</Typography>
					</Grid>
					<Grid item>
						<IconButton size="small" onClick={handleApplyChanges} data-testid="close">
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Divider />
				<FeatureFlag feature={FEATURES.SHAPEELASTIC}>
					{selectedLayer.file && (
						<>
							<Grid container spacing={3} style={{ padding: '10px 20px 10px 17px', justifyContent: 'space-between' }}>
								<Grid item style={{ display: 'flex' }}>
									<Box
										borderColor={getLayerColor(selectedLayer, 'layer', {})}
										borderLeft={4}
										style={{ padding: '0 0 0 16px' }}
									></Box>
									<Box display="inline">
										<Typography className={classes.fileName} variant="h6" noWrap>
											{selectedLayer.fileName}
										</Typography>
										<Typography id={selectedLayer.fileName} noWrap>
											{rows} rows
										</Typography>
									</Box>
								</Grid>
								<Grid style={{ padding: '5px 27px 4px 0px' }}>
									<Tooltip title="Grid">
										<IconButton
											size="small"
											aria-label="Grid"
											className={classes.gridOnIcon}
											onClick={() => {
												mapControlsController.updateState({
													layerGridCard: true,
													mapGridCardActivated: true,
													selectedLayer,
												});
												handleClose();
											}}
										>
											<GridOnIcon fontSize="large" />
										</IconButton>
									</Tooltip>
								</Grid>
							</Grid>
							<Divider />
						</>
					)}
				</FeatureFlag>
				<Grid container spacing={3} style={{ padding: '20px' }}>
					{selectedLayer.layerSettings?.colorable && (
						<Grid item xs={12}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant="h6">Layer label visibility</Typography>
								<FormControlLabel
									control={
										<Switch
											checked={layerLabelVisibility === 'visible'}
											onChange={() => setLayerLabelVisibility(layerLabelVisibility === 'visible' ? 'none' : 'visible')}
											size="small"
											data-testid="layer-label-visibility-toggle"
										/>
									}
								/>
							</div>
						</Grid>
					)}

					{(selectedLayer.layerSettings?.interaction?.interactionAble || selectedLayer.layerType === 'file layer') && (
						<Grid item xs={12}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant="h6">Layer clickable</Typography>
								<FormControlLabel
									control={
										<Switch
											checked={layerClickability}
											onChange={e => setLayerClickability(!layerClickability)}
											size="small"
											data-testid="layer-pickability-toggle"
										/>
									}
								/>
							</div>
						</Grid>
					)}

					{selectedLayer.layerSettings?.colorable && (
						<>
							<Grid item xs={12}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Typography variant="h6">Fill Color</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={enablefillColor}
												onChange={e => setEnableFillColor(!enablefillColor)}
												size="small"
												data-testid="layer-fill-toggle"
											/>
										}
									/>
									{layerType === 'line' && <WidthPicker width={width} setWidth={setWidth} layerType={layerType} />}
								</div>
								{enablefillColor && (
									<>
										<AttrsAutocomplete
											options={options}
											selectedValue={selectedValue}
											setSelectedValue={setSelectedValue}
										/>
										<AttrsValuesDropdown
											selectedValue={selectedValue}
											selectedLayer={selectedLayer}
											fillColor={fillColor}
											setFillColor={setFillColor}
											attributeBasedColors={attributeBasedColors}
											setAttributeBasedColors={setAttributeBasedColors}
										/>
									</>
								)}
							</Grid>
							{strokeColor && (
								<Grid item xs={12}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Typography variant="h6">Stroke Color</Typography>
										<FormControlLabel
											control={
												<Switch
													checked={enableStrokeColor}
													onChange={e => setEnableStrokeColor(!enableStrokeColor)}
													size="small"
													data-testid="layer-stroke-toggle"
												/>
											}
										/>
									</div>
									{layerType === 'circle' && <WidthPicker width={width} setWidth={setWidth} layerType={layerType} />}
									{enableStrokeColor && (
										<>
											<AttrsAutocomplete
												options={options}
												selectedValue={selectedStrokeValue}
												setSelectedValue={setSelectedStrokeValue}
											/>
											<AttrsValuesDropdown
												selectedValue={selectedStrokeValue}
												selectedLayer={selectedLayer}
												fillColor={strokeColor}
												setFillColor={setStrokeColor}
												attributeBasedColors={attributeBasedStrokeColors}
												setAttributeBasedColors={setAttributeBasedStrokeColors}
											/>
										</>
									)}
									<Typography variant="h6" style={{ margin: '14px 0px 10px 0px' }}>
										Stroke Width
									</Typography>
									<Box display="flex" alignItems="center" justifyContent="space-between">
										<Slider
											value={strokeWidth}
											onChange={(e, val) => setStrokeWidth(val)}
											aria-labelledby="continuous-slider"
											className={classes.slider}
											valueLabelDisplay="auto" // Shows the value above the thumb
										/>
										<TextField
											value={strokeWidth !== '' ? Number(strokeWidth).toString() : ''}
											variant="outlined"
											type="number"
											onChange={e => {
												let width = e.target.value ? Number(parseInt(e.target.value)) : 0;
												if (width > 100) width = 100;
												if (width < 0) width = 0;
												setStrokeWidth(width);
											}}
											size="small"
											className={classes.valueBox}
											inputProps={{
												inputMode: 'numeric',
												pattern: '[0-9]*',
											}}
										/>
									</Box>
								</Grid>
							)}
						</>
					)}
				</Grid>
			</div>
		</ClickAwayListener>
	);
}

export default LayerStyling;
