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

import { ADDLAYER } from 'graphQL/useMutationAddLayer';
import { GET_SHAPE_FILE_SCHEMA } from 'graphQL/useQueryGetShapeFileSchema';

import { globalStateController } from 'hookstate/globalStateController';
import { mapControlsController } from 'hookstate/mapControlsController';

import { AppContext } from 'AppContext';

import { ColorPickerStyledBox, useLayerStyle, WidthPicker } from './Common';
import { getDefaultSettings } from '../SourceLayerManager/fileUploadHelper';

function NewLayerManager(props) {
	const [stateApp] = useContext(AppContext);
	const sourceProps = '' + uuid() + '_source';

	const [layer] = useState({
		createBy: stateApp.user.mongoId,
		...getDefaultSettings('Polygon', '', sourceProps),
	});

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
	} = useLayerStyle(layer);

	const [source, setSource] = useState();
	const [selectCategory, setCategory] = useState();

	const { globalStateValues } = globalStateController.useState(['datasets'], 'globalStateValues');

	const createLayer = () => {
		const layerType = source.name === 'M1 Platform' ? 'data layer' : 'file layer';
		const layerCategory = source.name === 'M1 Platform' ? 'UD layer' : selectCategory.name;
		const layerShapeName = source.name === 'M1 Platform' ? null : selectCategory.name;
		const identifier =
			source.name === 'M1 Platform' ? selectCategory.label.replace('Tracts', 'Parcels') + uuid() : layerName + uuid();

		const sourceProps = identifier + '_source';

		addLayer({
			variables: {
				layer: {
					...layer,
					layerCategory,
					layerShapeName,
					layerType,
					identifier,
					groupId: null,
					groupName: null,
					file: source.file,
					layerName: layerName,
					layerGeometry: selectCategory.layerGeometry,
					originalFile: source.originalFile,
					defaultSettings: getDefaultSettings(
						selectCategory.layerGeometry,
						layerName,
						sourceProps,
						selectCategory.bbox
					),
					layerSchema: shapeFileSchema?.getShapeFileSchema || [],
					layerPaintProps: undefined,
					layerSettings: undefined,
					public: true,
				},
			},
			refetchQueries: ['getAllLayerSettingsByUser'],
			awaitRefetchQueries: true,
		}).then(() => {
			handleClose();
		});
	};

	const handleClose = () => {
		mapControlsController.updateState({ manageLayer: false });
	};

	useEffect(() => {
		if (source && selectCategory) {
			getShapeFileSchema({
				variables: {
					file: source.file,
					layerShapeName: selectCategory.layerShapeName,
				},
			});
		}
	}, [source, selectCategory, getShapeFileSchema]);

	const _datasets = useMemo(() => {
		const datasets = globalStateValues.datasets;
		return datasets || [];
	}, [globalStateValues.datasets]);
	const layerCategories = useMemo(() => {
		const dataset = globalStateValues.datasets.find(dataset => dataset.name === source?.name);
		if (source?.name === 'M1 Platform') {
			dataset.categories = dataset?.categories.filter(category => category.value !== 'agreement');
			dataset.categories = [
				...dataset.categories,
				{ value: 'Deeds', label: 'Deeds' },
				{ value: 'Leases', label: 'Leases' },
				{ value: 'Contracts', label: 'Contracts' },
				{ value: 'Surfaces', label: 'Surfaces' },
			];
		}
		return dataset?.categories || [];
	}, [source, globalStateValues.datasets]);

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
												onChange={e => setLayerClickability(!layerClickability)}
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
										disabled={!source || !selectCategory || !layerName}
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
