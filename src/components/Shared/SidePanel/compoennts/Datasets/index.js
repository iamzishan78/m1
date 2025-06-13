import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import GridOnIcon from '@material-ui/icons/GridOn';
import LayersIcon from '@material-ui/icons/Layers';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery, useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { snapGridSideBarData } from 'components/MapGridCard/components/data';
import { copy } from 'components/Shared/functions';
import DatabaseIcon from 'components/Shared/svgIcons/DatabaseIcon';
import FileDatasetIcon from 'components/Shared/svgIcons/FileDatasetIcon';

import { UPDATEMANYLAYERSETTINGS } from 'graphQL/useMutationUpdateManyLayerSettings';
import { UPDATE_USER_MAP_SETTINGS } from 'graphQL/useMutationUserMapSettings';
import { GET_DATASETS } from 'graphQL/useQueryDataset';
import { USER_MAP_SETTINGS_QUERY } from 'graphQL/useQueryUserMapSettings';

import { globalStateController } from 'stateManagement/globalStateController';
import { layerController } from 'stateManagement/layerStateController';
import { mapControlsController } from 'stateManagement/mapControlsController';

import { scrollbarStyle } from 'styles/common';

import { showErrorMessage, showSuccessMessage } from 'actions';

import { StyledListItemSecondaryAction, StyledMenuSecondaryHeaderItem } from '../style';
import DatasetMenu from './Menu';

const useStyles = makeStyles(theme => ({
	root: {
		background: '#0e111a',
		overflow: 'auto',
		maxHeight: '274px',
		paddingTop: '10px',
		borderBottom: '1px solid #263451',
		paddingBottom: '20px',
		...scrollbarStyle,

		'& .item': {
			'&:hover': {
				background: '#506187',
				// "& .actionIcon": {
				//     color: '#FFFF'
				// },
				'& .dIcon': {
					fill: '#ffff ',
				},
			},
			cursor: 'pointer',
			paddingLeft: '10px',
			marginBottom: '15px',
			paddingBottom: '10px',
		},

		'& .dIcon': {
			fill: '#506187',
			position: 'absolute',
			height: '53px',
			width: '43px',
		},

		'& .actionIcons': {
			paddingRight: '20px',
			display: 'flex',
			position: 'relative',
			top: '7px',
			'& .actionIcon': {
				color: '#3b4663',
				'&:hover': {
					color: '#FFFF',
				},
			},
		},
		fontFamily: 'Poppins',

		position: 'relative',
		disabledLayerTitle: {
			'& span': { color: 'rgb(127, 149, 199) !important' },
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
	},
	subContainer: props => ({
		marginLeft: theme.spacing(props.depth * 2),
	}),
	item: {
		paddingLeft: '10px',
		marginBottom: '15px',
	},
}));

function Datasets({ headerButton, search }) {
	const classes = useStyles();
	const dispatch = useDispatch();

	const {
		stateValues: { user },
	} = globalStateController.useState(['user']);

	const [getDatasets, { data: _datasets }] = useLazyQuery(GET_DATASETS);
	const [updateManyUserLayerSettings] = useMutation(UPDATEMANYLAYERSETTINGS);
	const [updateUserMapSettings] = useMutation(UPDATE_USER_MAP_SETTINGS, {
		refetchQueries: ['getUserMapSettings'],
		awaitRefetchQueries: true,
	});
	const [userMapSettings, { data: mapSettings }] = useLazyQuery(USER_MAP_SETTINGS_QUERY);

	useEffect(() => {
		userMapSettings({ variables: { user: user._id, type: 'DatasetVisibility' } });
		getDatasets({ variables: { userId: user._id } });
	}, [getDatasets, user._id, userMapSettings]);

	const datasets = useMemo(() => {
		if (_datasets?.getDatasets?.length && mapSettings?.userMapSettings?.message) {
			let datasets = copy(_datasets.getDatasets);
			const settings = mapSettings?.userMapSettings?.settings?.settings || {};

			datasets.forEach(dataset => {
				dataset.name = dataset.sourceName;
				if (dataset.sourceName === 'M1 Platform') {
					dataset.Icon = DatabaseIcon;
					dataset.visibility = true;
					dataset.categoryCount = snapGridSideBarData.length;
				} else {
					dataset.Icon = FileDatasetIcon;
					dataset.categoryCount = dataset.categories.length;
					dataset.visibility = typeof settings[dataset._id] === 'undefined' ? true : settings[dataset._id];
					dataset.categories.forEach(category => {
						category.file = dataset.file;
						category.fileName = dataset?.fileInfo?.name;
					});
				}
			});
			layerController.updateState({ datasets });
			datasets = datasets.filter(dataset => {
				return dataset.visibility;
			});
			if (search) {
				datasets = datasets.filter(dataset => dataset.name.toLowerCase().includes(search.toLowerCase()));
			}
			return datasets;
		} else {
			return [];
		}
	}, [_datasets, mapSettings, search]);

	const { mapControlsStateValues } = mapControlsController.useState(['selectedDataset'], 'mapControlsStateValues');

	const getBorderColor = useCallback(
		name => (mapControlsStateValues.selectedDataset?.sourceName === name ? '#05aff0' : '#263451'),
		[mapControlsStateValues.selectedDataset?.sourceName]
	);

	const onItemClick = dataset => {
		const stateToUpdate = { selectedLayerControl: null, mapGridCardActivated: false, selectedDataset: dataset };
		if (
			dataset.sourceName === 'M1 Platform' &&
			mapControlsStateValues.selectedDataset?.sourceName !== dataset.sourceName
		) {
			stateToUpdate.layerGridCard = false;
			stateToUpdate.shapeAssetGridCard = false;
			stateToUpdate.mapGridCardActivated = true;
		} else if (dataset.sourceName === 'M1 Platform Entities') {
			stateToUpdate.shapeAssetGridCard = true;
			stateToUpdate.layerGridCard = false;
			stateToUpdate.mapGridCardActivated = true;

			stateToUpdate.selectedLayer = { ...dataset.categories[0] };
		} else {
			const layers = layerController.getValue('layers');
			const layer = layers.find(
				l => l.file === dataset.categories[0]?.file && l.layerIdentifier === dataset.categories[0]?.layerIdentifier
			);
			stateToUpdate.selectedLayer = { ...dataset.categories[0], layerSchema: layer?.layerSchema };
			stateToUpdate.layerGridCard = true;
			stateToUpdate.shapeAssetGridCard = false;
			stateToUpdate.mapGridCardActivated = true;
		}
		mapControlsController.updateState(stateToUpdate);
	};

	const handleRemove = (dataset, value) => {
		datasets.find(d => d._id === dataset._id).visibility = value;
		const layersSettingsToUpdate = [];
		const layers = layerController.getValue('layers');
		layers.forEach((clayer, layerIndex) => {
			if (clayer.file === dataset.file) {
				layersSettingsToUpdate.push({
					_id: clayer._id,
					layerSettings: { ...clayer.layerSettings, showable: value },
				});
				layerController.handleDeckLayer({ ...clayer, layerSettings: { ...clayer.layerSettings, showable: value } });
				layers[layerIndex].layerSettings = {
					...clayer.layerSettings,
					showable: value,
				};
			}
		});
		layerController.updateState({ layers, datasets });

		updateUserMapSettings({
			variables: {
				settings: {
					user: user.mongoId,
					type: 'DatasetVisibility',
					settings: { [dataset._id]: value },
				},
			},
		}).then(response => {
			if (response.data?.updateUserMapSettings?.success) {
				dispatch(showSuccessMessage('Data source hidden successfully'));
			} else {
				dispatch(showErrorMessage('Failed to hide data source'));
			}
		});
		if (layersSettingsToUpdate.length > 0) {
			updateManyUserLayerSettings({
				variables: {
					manySettings: layersSettingsToUpdate,
				},
			});
		}
	};

	const handleTransfer = dataset => {
		mapControlsController.updateState({
			manageSourceLayer: false,
			manageLayer: false,
			manageTransferData: true,
			selectedLayerControl: null,
			selectedDataset: dataset,
		});
	};

	const handleAddLayer = dataset => {
		mapControlsController.updateState({
			layerAddControl: 'addLayers',
			selectedDataset: dataset,
		});
	};

	return (
		<>
			<StyledMenuSecondaryHeaderItem>
				<ListItemText primary={'Data Sources'} />
				{headerButton && (
					<StyledListItemSecondaryAction>
						<Button
							id="managerButton"
							onClick={() => headerButton.fn('manageSourceLayer')}
							color="secondary"
							variant="outlined"
							startIcon={<LayersIcon fontSize="medium" />}
						>
							Manager
						</Button>
					</StyledListItemSecondaryAction>
				)}
			</StyledMenuSecondaryHeaderItem>
			<div className={classes.root}>
				{datasets?.map(({ sourceName, Icon, categories, ...rest }) => (
					<Grid
						className="item"
						key={`dataset-${sourceName}`}
						data-testid={`dataset-${sourceName === 'M1 Platform' ? 'platform' : 'custom'}`}
						onClick={() => onItemClick({ sourceName, Icon, categories, ...rest })}
					>
						<Box borderColor={getBorderColor(sourceName)} borderLeft={4} margin={1} marginLeft={0} textAlign={'start'}>
							<Icon className="dIcon" />
							<Grid container direction="column" justifyContent="center" style={{ paddingLeft: '45px' }}>
								<Grid item md={12}>
									<Grid
										container
										direction="row"
										justifyContent="space-between"
										alignItems="center"
										style={{ width: '100%' }}
									>
										<Grid item style={{ display: 'flex', flexDirection: 'inline' }}>
											<Typography
												style={{
													color: '#ffff',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													width: '254px',
												}}
											>
												{sourceName}
											</Typography>
										</Grid>
										<Grid item className="actionIcons">
											<GridOnIcon id={'grid-icon-' + sourceName} className="actionIcon" />
											{(sourceName === 'M1 Platform' || sourceName === 'M1 Platform Entities') && (
												<Box paddingRight="24px" />
											)}
											{sourceName !== 'M1 Platform' && sourceName !== 'M1 Platform Entities' && (
												<DatasetMenu
													handleRemove={handleRemove}
													handleTransfer={handleTransfer}
													handleAddLayer={handleAddLayer}
													dataset={{ sourceName, Icon, categories, ...rest }}
												/>
											)}
										</Grid>
									</Grid>
								</Grid>
								<Grid item md={12}>
									<Typography variant="body2" gutterBottom style={{ color: 'lightgray' }}>
										{rest.categoryCount} categories
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				))}
			</div>
		</>
	);
}

Datasets.propTypes = {
	headerButton: PropTypes.shape({
		fn: PropTypes.func.isRequired,
	}),
	search: PropTypes.string,
};

const DatasetsContainer = memo(Datasets);

DatasetsContainer.propTypes = {
	headerButton: PropTypes.shape({
		fn: PropTypes.func.isRequired,
	}),
	search: PropTypes.string,
};

export default DatasetsContainer;
