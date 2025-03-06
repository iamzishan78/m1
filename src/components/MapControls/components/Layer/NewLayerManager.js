import React, { useContext, useState, useMemo, useEffect } from 'react';

import {
	Typography,
	Paper,
	Grid,
	Button,
	IconButton,
	Divider,
	FormControlLabel,
	Switch,
	ClickAwayListener,
	TextField,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

import { useLazyQuery, useMutation } from '@apollo/client';
import { v4 as uuid } from 'uuid';

import { copy } from 'components/Shared/functions';

import { layerController } from 'controllers/layerStateController';
import { mapControlsController } from 'controllers/mapControlsController';

import { ADDLAYER } from 'graphQL/useMutationAddLayer';
import { GET_SHAPE_FILE_SCHEMA } from 'graphQL/useQueryGetShapeFileSchema';

import { AppContext } from 'AppContext';

import { ColorPickerStyledBox, useLayerStyle, WidthPicker } from './Common';
import { getDefaultSettings } from '../SourceLayerManager/fileUploadHelper';

function NewLayerManager() {
	const [stateApp] = useContext(AppContext);

	const [layer] = useState({ createBy: stateApp.user.mongoId, ...getDefaultSettings('Polygon', '') });

	const [addLayer] = useMutation(ADDLAYER);
	const [getShapeFileSchema, { data: shapeFileSchema }] = useLazyQuery(GET_SHAPE_FILE_SCHEMA);

	const layerType = layer.layerPaintProps[0]?.paintType;

	const {
		layerName,
		setLayerName,
		width,
		setWidth,
		fillColor,
		setFillColor,
		layerLabelVisibility,
		setLayerLabelVisibility,
		layerClickability,
		setLayerClickability,
		strokeColor,
		setStrokeColor,
		handleLayerChange,
	} = useLayerStyle(layer);

	const [source, setSource] = useState();
	const [selectCategory, setCategory] = useState();
	const [selectGeometry, setGeometry] = useState();

	const { datasets, layerStateValues } = layerController.useState(['datasets'], 'layerStateValues');

	const handleClose = () => {
		mapControlsController.updateState({ manageLayer: false });
	};

	const createLayer = () => {
		const layerType = source.name === 'M1 Platform' ? 'data layer' : selectGeometry?.value || 'file layer';

		const layerCategory = source.name === 'M1 Platform' ? 'UD layer' : selectCategory.layerIdentifier;

		addLayer({
			variables: {
				layer: {
					...layer,
					layerCategory,
					layerIdentifier: selectCategory.layerIdentifier,
					layerType,
					identifier: selectCategory.layerIdentifier + uuid(),
					groupId: null,
					groupName: null,
					file: source.file,
					layerName: layerName,
					layerGeometry: selectCategory.layerGeometry,
					defaultSettings: {
						...handleLayerChange(),
						bbox: selectCategory?.bbox || [],
					},
					layerSchema: shapeFileSchema?.getShapeFileSchema || [],
					layerPaintProps: undefined,
					layerSettings: undefined,
					public: true,
					dataset: source._id,
				},
			},
		}).then(async ({ data }) => {
			const layerToAdd = copy(data.addLayer.userLayer);
			if (layerToAdd) {
				const { projectedLayers, layers } = layerController.getValues(['projectedLayers', 'layers']);
				layerController.updateState({
					projectedLayers: [...projectedLayers, layerToAdd],
					layers: [...layers, layerToAdd],
				});
			}

			handleClose();
		});
	};

	useEffect(() => {
		if (source && selectCategory) {
			getShapeFileSchema({
				variables: {
					file: source.file,
					layerIdentifier: selectCategory.layerIdentifier,
				},
			});
		}
	}, [source, selectCategory, getShapeFileSchema]);

	const _datasets = useMemo(() => {
		const wellsSource = {
			_id: '67c81d0894b843cd5fbbc87d',
			sourceName: 'PlatformWells',
			types: ['Point'],
			public: true,
			IsDeleted: false,

			categories: [
				{
					name: 'PlatformWells - Point',
					layerGeometry: 'Point',
					layerIdentifier: 'PlatformWells - Point',
				},
			],
			name: 'PlatformWells',
			categoryCount: 1,
			visibility: true,
		};
		return layerStateValues.datasets ? [...layerStateValues.datasets, wellsSource] : [];
	}, [datasets]);

	const layerCategories = useMemo(() => {
		const dataset = layerStateValues.datasets.find(dataset => dataset.name === source?.name);
		if (source?.name === 'M1 Platform') {
			dataset.categories = dataset?.categories.filter(category => category.isNewLayerCreationAllowed);
		}
		if (source?.name === 'PlatformWells') {
			return source?.categories;
		}
		return dataset?.categories || [];
	}, [source, datasets]);

	return (
		<ClickAwayListener>
			<div style={{ width: '100%' }}>
				<Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: '15px' }}>
					<Grid item>
						<Typography variant="h5">Create New Map Layer</Typography>
					</Grid>
					<Grid item>
						<IconButton size="small" onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Divider />
				<div style={{ height: 'calc(100vh - 125px)', overflowY: 'scroll', overflowX: 'hidden' }}>
					<Grid container spacing={3} style={{ padding: '20px' }}>
						<Grid item xs={12}>
							<Autocomplete
								id="data-source"
								options={_datasets}
								getOptionLabel={option => option.name}
								value={source}
								onChange={(_, dataset) => {
									setSource(dataset);
									setCategory(null);
								}}
								renderInput={params => <TextField {...params} label="Select Data Source" />}
							/>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								id="layer-category"
								options={layerCategories}
								value={selectCategory}
								getOptionLabel={option => `${option.name || option.label}(${option.layerGeometry || option.value})`}
								onChange={(_, layerCategory) => setCategory(layerCategory)}
								renderInput={params => <TextField {...params} label="Select Category" />}
							/>
						</Grid>
						{selectCategory?.layerGeometry === 'Point' && (
							<Grid item xs={12}>
								<Autocomplete
									id="layer-geometry"
									options={[
										{ label: 'Point', value: 'point' },
										{ label: 'Hexagon', value: 'hexagon layer' },
										{ label: 'Heat Maps', value: 'heatmap layer' },
										{ label: 'Grid', value: 'grid layer' },
									]}
									getOptionLabel={option => `${option.label}`}
									value={selectGeometry}
									onChange={(_, layerGeometry) => setGeometry(layerGeometry)}
									renderInput={params => <TextField {...params} label="Select Layer Geometry" />}
								/>
							</Grid>
						)}
						<Grid item xs={12}>
							<TextField
								margin="dense"
								id="layerName"
								label="Enter Layer Name"
								fullWidth
								onChange={e => setLayerName(e.target.value)}
							/>
						</Grid>
					</Grid>

					<Grid container spacing={3} style={{ padding: '20px' }}>
						{layer.layerSettings?.colorable && (
							<Grid item xs={12}>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="h6">Layer label visibility</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={layerLabelVisibility === 'visible'}
												onChange={() =>
													setLayerLabelVisibility(layerLabelVisibility === 'visible' ? 'none' : 'visible')
												}
												size="small"
											/>
										}
									/>
								</div>
							</Grid>
						)}
						{(layer.layerSettings?.interaction?.interactionAble || layer.layerType === 'file layer') && (
							<Grid item xs={12}>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography variant="h6">Layer clickable</Typography>
									<FormControlLabel
										control={
											<Switch
												checked={layerClickability}
												onChange={() => setLayerClickability(!layerClickability)}
												size="small"
											/>
										}
									/>
								</div>
							</Grid>
						)}

						{layer.layerSettings?.colorable && (
							<>
								<Grid item xs={12}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<Typography variant="h6">Fill Color</Typography>
										{layerType === 'line' && <WidthPicker width={width} setWidth={setWidth} layerType={layerType} />}
									</div>
									<Paper>
										<ColorPickerStyledBox value={fillColor} onChange={color => setFillColor(color)} />
									</Paper>
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
											{layerType === 'circle' && (
												<WidthPicker width={width} setWidth={setWidth} layerType={layerType} />
											)}
										</div>
										<Paper>
											<ColorPickerStyledBox value={strokeColor} onChange={color => setStrokeColor(color)} />
										</Paper>
									</Grid>
								)}
							</>
						)}

						<div style={{ position: 'absolute', bottom: '0px', width: '100%' }}>
							<Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: '20px' }}>
								<Grid item>
									<Button autoFocus onClick={handleClose} color="primary">
										Cancel
									</Button>
								</Grid>
								<Grid item>
									<Button
										autoFocus
										onClick={createLayer}
										color="primary"
										disabled={!source || !selectCategory || !layerName?.trim()}
									>
										Create layer
									</Button>
								</Grid>
							</Grid>
						</div>
					</Grid>
				</div>
			</div>
		</ClickAwayListener>
	);
}

export default NewLayerManager;
