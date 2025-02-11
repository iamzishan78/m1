import React, { useState, useEffect, useContext, useMemo } from 'react';

import { Grid, IconButton, Divider, FormControlLabel, Switch, Tooltip, ClickAwayListener } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import GridOnIcon from '@material-ui/icons/GridOn';

import { Typography, Slider, TextField, Box } from '@mui/material';

import { useLazyQuery, useMutation } from '@apollo/client';
import _ from 'lodash';

import { FEATURES } from 'components/Shared/FeatureFlag/common';
import FeatureFlag from 'components/Shared/FeatureFlag/FeatureFlagComponent.js';
import { getLayerColor } from 'components/Shared/SidePanel/compoennts/common';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { GET_SHAPE_FILE_SCHEMA } from 'graphQL/useQueryGetShapeFileSchema';
import { LAYERS_FEATURES_COUNT } from 'graphQL/useQueryLayerFeaturesCount';

import { getLayerKey } from 'hookstate/helpers';
import { layerStylingController } from 'hookstate/layersStylingController';
import { layerController } from 'hookstate/layerStateController';
import { mapControlsController } from 'hookstate/mapControlsController';

import { AppContext } from 'AppContext';

import { ifRgbaConvt, useStyles, WidthPicker } from './Common';
import AttrsAutocomplete from './LayerAttributes/AttrsAutocomplete';
import AttrsFillStyleDropdown from './LayerAttributes/AttrsFillStyleDropdown';
import AttrsValuesDropdown from './LayerAttributes/AttrsValuesDropdown';
import { colorBasedAttributes } from './LayerAttributes/ColorBasedAttributes';
import { UPDATELAYERSETTINGS } from '../../../../graphQL/useMutationUpdateLayerSettings';

function LayerStyling() {
	const classes = useStyles();
	const { mapControlsStateValues, ...mapControlStates } = mapControlsController.useState(
		['selectedLayer'],
		'mapControlsStateValues'
	);

	const layerStylingState = layerStylingController.useCompleteState();
	const layerStylingStateValues = layerStylingState?.get({ noproxy: true });

	const {
		width,
		fillColor,
		fillStyle,
		lineStyle,
		enablefillColor,
		enableStrokeColor,
		enableStrokeStyle,
		enableColorStyle,
		selectedValue,
		selectedStrokeValue,
		selectedFillStyle,
		selectedLineStyle,
		attributeBasedColors,
		attributeBasedStrokeColors,
		attributeBasedStyles,
		attributeBasedLineStyles,
		layerLabelVisibility,
		layerClickability,
		strokeColor,
		strokeWidth,
	} = layerStylingStateValues;

	const selectedLayer = mapControlsStateValues.selectedLayer;

	const layerType = selectedLayer.layerPaintProps?.[0]?.paintType;

	const initialFillColor =
		layerType === 'fill'
			? ifRgbaConvt(selectedLayer.layerPaintProps?.[0]?.paintProps['fill-color'])
			: layerType === 'line'
				? ifRgbaConvt(selectedLayer.layerPaintProps?.[0]?.paintProps['line-color'])
				: ifRgbaConvt(selectedLayer.layerPaintProps?.[0]?.paintProps['circle-color']);
	const initialStrokeColor =
		layerType === 'fill'
			? ifRgbaConvt(selectedLayer.layerPaintProps?.[0]?.paintProps['fill-outline-color'])
			: layerType === 'line'
				? undefined
				: ifRgbaConvt(selectedLayer.layerPaintProps?.[0]?.paintProps['circle-stroke-color']);

	let initialWidth;
	if (layerType === 'circle') {
		initialWidth = selectedLayer.layerPaintProps?.[0]?.paintProps['circle-stroke-width']
			? selectedLayer.layerPaintProps?.[0]?.paintProps['circle-stroke-width']
			: 0;
	}
	if (layerType === 'line') {
		initialWidth = selectedLayer.layerPaintProps?.[0]?.paintProps['line-width']
			? selectedLayer.layerPaintProps?.[0]?.paintProps['line-width']
			: 1;
	}

	const [rows, setRows] = useState(0);
	const [stateApp] = useContext(AppContext);

	const [layerFeaturesCount, { data: layerDataCount }] = useLazyQuery(LAYERS_FEATURES_COUNT);

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	const [getShapeFileSchema, { data: shapeFileSchema }] = useLazyQuery(GET_SHAPE_FILE_SCHEMA);

	const [updateLayerSettings] = useMutation(UPDATELAYERSETTINGS);

	// Getting meta data for selected layer
	useEffect(() => {
		layerStylingController.initializeLayerStyling(selectedLayer);
		if (selectedLayer?._id) {
			getShapeFileSchema({
				variables: {
					layerId: selectedLayer?.layerId,
				},
			});
		}

		if (colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.layerKey) {
			getMetaData({
				variables: {
					user: stateApp.user?.mongoId,
					category: colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.layerKey,
				},
			});
		}
	}, []);

	useEffect(() => {
		setRows(layerDataCount?.layerFeaturesCount || 0);
	}, [layerDataCount]);

	useEffect(() => {
		const hookStateAppLayers = layerController.getValue('layers');
		if (!layerStylingStateValues?.layerInitialized) {
			return null;
		}
		if (
			(hookStateAppLayers &&
				selectedLayer &&
				((fillColor && fillColor.rgb && (fillColor.alpha || fillColor.alpha === 0)) ||
					(strokeColor && strokeColor.rgb && (strokeColor.alpha || strokeColor.alpha === 0)))) ||
			width ||
			selectedLayer.layerPaintProps?.[0]?.labelProps?.visibility !== layerLabelVisibility ||
			parseInt(selectedLayer.layerPaintProps?.[0]?.paintProps?.strokeWidth) !== parseInt(strokeWidth) ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.click !== layerClickability ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.enablefillColor !== enablefillColor ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.enableStrokeColor !== enableStrokeColor ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.enableStrokeStyle !== enableStrokeStyle ||
			selectedLayer.layerSettings?.interaction?.interactionDetail?.enableColorStyle !== enableColorStyle ||
			!_.isEqual(selectedLayer.layerSettings?.attributeBasedColors, attributeBasedColors) ||
			!_.isEqual(selectedLayer.layerSettings?.attributeBasedStrokeColors, attributeBasedStrokeColors) ||
			!_.isEqual(selectedLayer.layerSettings?.attributeBasedStyles, attributeBasedStyles) ||
			!_.isEqual(selectedLayer.layerSettings?.attributeBasedLineStyles, attributeBasedLineStyles) ||
			selectedLayer.layerSettings?.selectedAttribute?.label !== selectedValue?.label ||
			selectedLayer.layerSettings?.selectedStrokeAttribute?.label !== selectedStrokeValue?.label ||
			selectedLayer.layerSettings?.selectedFillStyle?.label !== selectedFillStyle?.label ||
			selectedLayer.layerSettings?.selectedLineStyle?.label !== selectedLineStyle?.label ||
			selectedLayer.layerSettings?.fillStyle !== fillStyle ||
			selectedLayer.layerSettings?.lineStyle !== lineStyle
		) {
			let { currentLayer } = layerStylingController.handleLayerChange(selectedLayer);
			const currentLayers = [...hookStateAppLayers];
			const index = currentLayers.findIndex(l => l.layerId === currentLayer.layerId);
			currentLayers[index] = currentLayer;

			const TWOFIFTY = 250;
			const debouncedUpdate = _.debounce(() => {
				layerController.updateState({ layers: [...currentLayers] });
				layerController.resetBounds(selectedLayer?.identifier, true);
				updateLayerSettings({
					variables: {
						settings: {
							_id: currentLayer._id,
							user: stateApp.user.mongoId,
							layer: selectedLayer.layerId,
							layerPaintProps: currentLayer.layerPaintProps,
							layerSettings: currentLayer.layerSettings,
						},
					},
				}).then(({ data }) => {
					if (data?.updateUserLayerSettings?.res && !currentLayer._id) {
						mapControlsController.updateState({
							selectedLayer: { ...selectedLayer, _id: data.updateUserLayerSettings.res._id },
						});
					}
				});
				// layerController.handleDeckLayer(currentLayer, true);
			}, TWOFIFTY); // Adjust the debounce delay as needed

			debouncedUpdate();

			return () => {
				debouncedUpdate.cancel(); // Clean up on unmount or dependencies change
			};
		}
		return null;
	}, [
		layerClickability,
		layerLabelVisibility,
		enablefillColor,
		enableStrokeColor,
		enableStrokeStyle,
		enableColorStyle,
		attributeBasedColors,
		attributeBasedStyles,
		attributeBasedLineStyles,
		attributeBasedStrokeColors,
		selectedValue,
		selectedStrokeValue,
		selectedFillStyle,
		selectedLineStyle,
		strokeWidth,
		fillColor,
		fillStyle,
		lineStyle,
		strokeColor,
		width,
	]);

	useEffect(() => {
		setRows(0);
		if (selectedLayer.file) {
			selectedLayer.layerShapeName = selectedLayer.layerShapeName || selectedLayer.layerCategory;
			layerFeaturesCount({ variables: { fileId: selectedLayer.file, layerShapeName: selectedLayer.layerShapeName } });
		}
	}, [mapControlStates.selectedLayer.file, layerFeaturesCount]);

	useEffect(() => {
		layerStylingController.setFillColor(initialFillColor);
		layerStylingController.setStrokeColor(initialStrokeColor);
		layerStylingController.setFillStyle(selectedLayer.layerSettings?.fillStyle);
		layerStylingController.setLineStyle(selectedLayer.layerSettings?.lineStyle);
	}, [selectedValue, selectedStrokeValue, selectedFillStyle, selectedLineStyle]);

	useEffect(() => {
		layerStylingController.setWidth(initialWidth);
		layerStylingController.setFillColor(initialFillColor);
		layerStylingController.setStrokeColor(initialStrokeColor);
		layerStylingController.setFillStyle(selectedLayer.layerSettings?.fillStyle);
		layerStylingController.setLineStyle(selectedLayer.layerSettings?.lineStyle);
	}, [initialFillColor, initialStrokeColor, initialWidth, selectedLayer]);

	const handleClose = () => {
		mapControlsController.updateState({ selectedLayerControl: null });
	};

	// Merging summaryfield keys and custom data keys of selected  layer
	const options = useMemo(() => {
		const colorAttributes =
			colorBasedAttributes[getLayerKey(selectedLayer?.identifier, colorBasedAttributes)]?.keys ||
			shapeFileSchema?.getShapeFileSchema ||
			[];
		const metaDataOptions =
			metaDataRes?.getMetaData?.metaData?.map(md => ({
				label: md.name,
				value: md.esKey,
			})) || [];

		return [...colorAttributes, ...metaDataOptions];
	}, [selectedLayer, metaDataRes, shapeFileSchema]);

	return (
		<ClickAwayListener onClickAway={handleClose}>
			<div style={{ width: '100%', height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
				<Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: '15px' }}>
					<Grid item md={11}>
						{/* Override layer styling names of Parcel and Wells */}
						<Typography variant="h5" noWrap>
							{selectedLayer.layerName}
						</Typography>
					</Grid>
					<Grid item>
						<IconButton size="small" onClick={handleClose} data-testid="close">
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
											onChange={() =>
												layerStylingController.setLayerLabelVisibility(
													layerLabelVisibility === 'visible' ? 'none' : 'visible'
												)
											}
											size="small"
											data-testid="layer-label-visibility-toggle"
										/>
									}
								/>
							</div>
							<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
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
											onChange={() => layerStylingController.setLayerClickability(!layerClickability)}
											size="small"
											data-testid="layer-pickability-toggle"
										/>
									}
								/>
							</div>
							<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '20px' }} />
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
												onChange={() => layerStylingController.setEnableFillColor(!enablefillColor)}
												size="small"
												data-testid="layer-fill-toggle"
											/>
										}
									/>
									{layerType === 'line' && (
										<WidthPicker width={width} setWidth={layerStylingController.setWidth} layerType={layerType} />
									)}
								</div>
								{enablefillColor && (
									<>
										<AttrsAutocomplete
											options={options}
											selectedValue={selectedValue}
											setSelectedValue={layerStylingController.setSelectedValue}
											typography={'Color based on'}
										/>
										<AttrsValuesDropdown
											selectedValue={selectedValue}
											selectedLayer={selectedLayer}
											fillColor={fillColor}
											setFillColor={layerStylingController.setFillColor}
											attributeBasedColors={attributeBasedColors}
											setAttributeBasedColors={layerStylingController.setAttributeBasedColors}
										/>
									</>
								)}
								<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '25px' }} />
							</Grid>

							{/* dropdown for fill style selection */}

							<Grid item xs={12}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									<Typography variant="h6">Fill Style</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={!!enableColorStyle}
												onChange={() => layerStylingController.setEnableColorStyle(!enableColorStyle)}
												size="small"
												data-testid="layer-stroke-toggle"
											/>
										}
									/>
								</div>
								{enablefillColor && enableColorStyle && (
									<>
										<AttrsAutocomplete
											options={options}
											selectedValue={selectedFillStyle}
											setSelectedValue={layerStylingController.setSelectedFillStyle}
											typography={'Style based on'}
										/>
										<AttrsFillStyleDropdown
											dropDownOptions={['dots', 'hatch-1x', 'hatch-2x', 'hatch-cross']}
											selectedValue={selectedFillStyle}
											selectedLayer={selectedLayer}
											fillStyle={fillStyle}
											setFillStyle={layerStylingController.setFillStyle}
											attributeBasedStyles={attributeBasedStyles}
											setAttributeBasedStyles={layerStylingController.setAttributeBasedStyles}
										/>
									</>
								)}
								<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '25px' }} />
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
													onChange={() => layerStylingController.setEnableStrokeColor(!enableStrokeColor)}
													size="small"
													data-testid="layer-stroke-toggle"
												/>
											}
										/>
									</div>
									{layerType === 'circle' && (
										<WidthPicker width={width} setWidth={layerStylingController.setWidth} layerType={layerType} />
									)}
									{enableStrokeColor && (
										<>
											<AttrsAutocomplete
												options={options}
												selectedValue={selectedStrokeValue}
												setSelectedValue={layerStylingController.setSelectedStrokeValue}
												typography={'Color based on'}
											/>
											<AttrsValuesDropdown
												selectedValue={selectedStrokeValue}
												selectedLayer={selectedLayer}
												fillColor={strokeColor}
												setFillColor={layerStylingController.setStrokeColor}
												attributeBasedColors={attributeBasedStrokeColors}
												setAttributeBasedColors={layerStylingController.setAttributeBasedStrokeColors}
											/>
										</>
									)}
									{/* dropdown for line/stroke style selection */}
									<Divider style={{ marginLeft: '-20px', marginRight: '-20px', marginTop: '25px' }} />

									<Grid item xs={12}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												marginTop: '20px',
											}}
										>
											<Typography variant="h6">Stroke Style</Typography>
											<FormControlLabel
												control={
													<Switch
														checked={enableStrokeStyle}
														onChange={() => layerStylingController.setEnableStrokeStyle(!enableStrokeStyle)}
														size="small"
														data-testid="layer-stroke-toggle"
													/>
												}
											/>
										</div>
										{enableStrokeColor && enableStrokeStyle && (
											<>
												<AttrsAutocomplete
													options={options}
													selectedValue={selectedLineStyle}
													setSelectedValue={layerStylingController.setSelectedLineStyle}
													typography={'Style based on'}
												/>
												<AttrsFillStyleDropdown
													dropDownOptions={['dots', 'dashed', 'connected']}
													selectedValue={selectedLineStyle}
													selectedLayer={selectedLayer}
													fillStyle={lineStyle}
													setFillStyle={layerStylingController.setLineStyle}
													attributeBasedStyles={attributeBasedLineStyles}
													setAttributeBasedStyles={layerStylingController.setAttributeBasedLineStyles}
												/>
											</>
										)}
									</Grid>
									<Typography variant="h6" style={{ margin: '14px 0px 10px 0px' }}>
										Stroke Width
									</Typography>
									<Box display="flex" alignItems="center" justifyContent="space-between">
										<Slider
											value={strokeWidth}
											onChange={(e, val) => layerStylingController.setStrokeWidth(val)}
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
												if (width > 100) {
													width = 100;
												}
												if (width < 0) {
													width = 0;
												}
												layerStylingController.setStrokeWidth(width);
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
